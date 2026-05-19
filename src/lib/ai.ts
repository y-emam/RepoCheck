import type { RepoSnapshot } from "@/lib/github";

const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 45_000;

function geminiEndpoint(): string {
  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

export interface AiSubscore {
  label: string;
  grade: string;
  value: number;
}

export interface AiFinding {
  title: string;
  body: string;
}

export interface AiReport {
  healthGrade: string;
  healthScore: number;
  scoreNote: string;
  subscores: AiSubscore[];
  activityAssessment: string;
  topConcerns: AiFinding[];
  suggestedPriorities: AiFinding[];
  aiSummary: string;
}

export type AiReportResult =
  | { ok: true; data: AiReport }
  | { ok: false; message: string };

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    healthGrade: { type: "STRING" },
    healthScore: { type: "INTEGER" },
    scoreNote: { type: "STRING" },
    subscores: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          label: { type: "STRING" },
          grade: { type: "STRING" },
          value: { type: "INTEGER" },
        },
        required: ["label", "grade", "value"],
      },
    },
    activityAssessment: { type: "STRING" },
    topConcerns: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          body: { type: "STRING" },
        },
        required: ["title", "body"],
      },
    },
    suggestedPriorities: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          body: { type: "STRING" },
        },
        required: ["title", "body"],
      },
    },
    aiSummary: { type: "STRING" },
  },
  required: [
    "healthGrade",
    "healthScore",
    "scoreNote",
    "subscores",
    "activityAssessment",
    "topConcerns",
    "suggestedPriorities",
    "aiSummary",
  ],
} as const;

const SYSTEM_INSTRUCTION = `You are a senior open-source maintainer auditing the health of a public GitHub repository.
You are given a factual snapshot of the repository. Judge it honestly — do not flatter.

Produce a structured health report:
- healthGrade: a letter grade from "A+" down to "F" reflecting overall project health.
- healthScore: an integer 0-100 consistent with the grade.
- scoreNote: a short phrase contextualizing the score (e.g. "Healthy, actively maintained" or "At risk — low bus factor").
- subscores: exactly four items with labels "Activity", "Maintenance", "Community", "Docs". Each has a letter grade and an integer value 0-100.
- activityAssessment: 2-4 sentences on development cadence, citing concrete numbers from the snapshot.
- topConcerns: exactly 3 of the most material risks. Each has a short title and a 1-2 sentence body grounded in the data.
- suggestedPriorities: exactly 3 concrete, actionable recommendations. Each has a short title and a 1-2 sentence body.
- aiSummary: one sentence summarizing the verdict.

Base every claim on the snapshot. If data is sparse (e.g. an archived or tiny repo), say so and grade accordingly.`;

function buildPrompt(snapshot: RepoSnapshot): string {
  const m = snapshot.metadata;
  const ageYears = m.createdAt
    ? ((Date.now() - new Date(m.createdAt).getTime()) / (365.25 * 24 * 3600 * 1000)).toFixed(1)
    : "unknown";

  const contributors = snapshot.topContributors
    .map((c) => `  - ${c.login}: ${c.contributions} contributions`)
    .join("\n");

  const issues = snapshot.issues.recent
    .slice(0, 15)
    .map((i) => {
      const labels = i.labels.length ? ` [${i.labels.join(", ")}]` : "";
      return `  - #${i.number} "${i.title}"${labels} (opened ${i.createdAt.slice(0, 10)})`;
    })
    .join("\n");

  const prs = snapshot.pullRequests.recent
    .slice(0, 12)
    .map((p) => `  - #${p.number} "${p.title}"${p.draft ? " (draft)" : ""} (opened ${p.createdAt.slice(0, 10)})`)
    .join("\n");

  return `REPOSITORY SNAPSHOT

Full name: ${m.fullName}
Description: ${m.description ?? "(none)"}
Primary language: ${m.language ?? "(unknown)"}
Stars: ${m.stars} | Forks: ${m.forks} | Watchers: ${m.watchers}
License: ${m.license ?? "(none)"}
Archived: ${m.archived ? "yes" : "no"}
Repository age: ${ageYears} years
Last commit: ${m.lastCommitAt ?? "(unknown)"}
Default branch: ${m.defaultBranch}

ACTIVITY
Commits in last 30 days: ${snapshot.commits.totalLast30}
Commits in last 90 days: ${snapshot.commits.totalLast90}
Releases in last 90 days: ${snapshot.releaseCount90d}

TOP CONTRIBUTORS
${contributors || "  (none reported)"}

OPEN ISSUES (total: ${snapshot.issues.totalOpen}; showing recent)
${issues || "  (none)"}

OPEN PULL REQUESTS (showing recent)
${prs || "  (none)"}

README EXCERPT
${snapshot.readme ? snapshot.readme.slice(0, 3000) : "(no README found)"}

Analyze this repository and return the structured health report.`;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

function parseReport(raw: unknown): AiReport | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  const grade = typeof r.healthGrade === "string" ? r.healthGrade : null;
  const score = typeof r.healthScore === "number" ? r.healthScore : null;
  const note = typeof r.scoreNote === "string" ? r.scoreNote : null;
  const assessment =
    typeof r.activityAssessment === "string" ? r.activityAssessment : null;
  const summary = typeof r.aiSummary === "string" ? r.aiSummary : null;

  if (!grade || score === null || !note || !assessment || !summary) return null;

  const subscores = Array.isArray(r.subscores)
    ? r.subscores.flatMap<AiSubscore>((s) => {
        if (typeof s !== "object" || s === null) return [];
        const o = s as Record<string, unknown>;
        if (
          typeof o.label === "string" &&
          typeof o.grade === "string" &&
          typeof o.value === "number"
        ) {
          return [{ label: o.label, grade: o.grade, value: o.value }];
        }
        return [];
      })
    : [];

  const toFindings = (value: unknown): AiFinding[] =>
    Array.isArray(value)
      ? value.flatMap<AiFinding>((f) => {
          if (typeof f !== "object" || f === null) return [];
          const o = f as Record<string, unknown>;
          if (typeof o.title === "string" && typeof o.body === "string") {
            return [{ title: o.title, body: o.body }];
          }
          return [];
        })
      : [];

  const topConcerns = toFindings(r.topConcerns);
  const suggestedPriorities = toFindings(r.suggestedPriorities);

  if (subscores.length === 0 || topConcerns.length === 0 || suggestedPriorities.length === 0) {
    return null;
  }

  return {
    healthGrade: grade,
    healthScore: Math.max(0, Math.min(100, Math.round(score))),
    scoreNote: note,
    subscores,
    activityAssessment: assessment,
    topConcerns,
    suggestedPriorities,
    aiSummary: summary,
  };
}

export async function generateReport(
  snapshot: RepoSnapshot
): Promise<AiReportResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, message: "GEMINI_API_KEY is not set" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(geminiEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ parts: [{ text: buildPrompt(snapshot) }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return {
        ok: false,
        message: `Gemini request failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`,
      };
    }

    const payload = (await response.json()) as GeminiResponse;
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return { ok: false, message: "Gemini returned an empty response" };
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(text);
    } catch {
      return { ok: false, message: "Gemini returned malformed JSON" };
    }

    const report = parseReport(parsedJson);
    if (!report) {
      return { ok: false, message: "Gemini response did not match the expected shape" };
    }

    return { ok: true, data: report };
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, message: "Gemini request timed out" };
    }
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown AI error",
    };
  } finally {
    clearTimeout(timeout);
  }
}
