import { NextResponse } from "next/server";

import { generateReport } from "@/lib/ai";
import { fetchRepoSnapshot, type RepoSnapshot } from "@/lib/github";
import { createServerClient } from "@/lib/supabase";
import { parseGithubUrl } from "@/lib/validate-github-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface AnalyzeRequestBody {
  url?: unknown;
}

interface AnalyzeSuccess {
  owner: string;
  repo: string;
  data: RepoSnapshot;
  cached: boolean;
  generatedAt: string;
  aiGenerated: boolean;
}

interface ReportInsertRow {
  repo_id: string;
  health_grade: string | null;
  health_score: number | null;
  score_note: string | null;
  subscores: unknown;
  activity_assessment: string | null;
  top_concerns: unknown;
  suggested_priorities: unknown;
  raw_data: RepoSnapshot;
  ai_summary: string | null;
}

function jsonError(status: number, error: string): NextResponse {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: AnalyzeRequestBody;
  try {
    body = (await request.json()) as AnalyzeRequestBody;
  } catch {
    return jsonError(400, "Request body must be valid JSON");
  }

  if (typeof body?.url !== "string") {
    return jsonError(400, "url is required and must be a string");
  }

  const parsed = parseGithubUrl(body.url);
  if (!parsed.valid) {
    return jsonError(400, parsed.error);
  }
  const { owner, repo } = parsed;
  const fullName = `${owner}/${repo}`;

  let supabase;
  try {
    supabase = createServerClient();
  } catch (err) {
    console.error("Supabase init failed", err);
    return jsonError(500, "Server is not configured");
  }

  const cutoffIso = new Date(Date.now() - CACHE_TTL_MS).toISOString();

  const cachedRepo = await supabase
    .from("repos")
    .select("id, owner, name, full_name, last_analyzed_at")
    .eq("full_name", fullName)
    .maybeSingle();

  if (cachedRepo.error) {
    console.error("Supabase repo lookup failed", cachedRepo.error);
    return jsonError(500, "Failed to look up repository");
  }

  if (cachedRepo.data) {
    const cachedReport = await supabase
      .from("reports")
      .select("raw_data, generated_at, health_grade")
      .eq("repo_id", cachedRepo.data.id)
      .gte("generated_at", cutoffIso)
      .order("generated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cachedReport.error) {
      console.error("Supabase report lookup failed", cachedReport.error);
      return jsonError(500, "Failed to look up cached report");
    }

    if (cachedReport.data?.raw_data) {
      const response: AnalyzeSuccess = {
        owner,
        repo,
        data: cachedReport.data.raw_data as RepoSnapshot,
        cached: true,
        generatedAt: cachedReport.data.generated_at,
        aiGenerated: cachedReport.data.health_grade !== null,
      };
      return NextResponse.json(response);
    }
  }

  const snapshot = await fetchRepoSnapshot(owner, repo);
  if (!snapshot.ok) {
    if (snapshot.errorType === "not_found") {
      return jsonError(404, snapshot.message);
    }
    if (snapshot.errorType === "rate_limited") {
      return jsonError(429, snapshot.message);
    }
    if (snapshot.errorType === "forbidden") {
      return jsonError(403, snapshot.message);
    }
    return jsonError(500, snapshot.message);
  }

  const nowIso = new Date().toISOString();
  const upsertRepo = await supabase
    .from("repos")
    .upsert(
      {
        owner,
        name: repo,
        full_name: fullName,
        description: snapshot.data.metadata.description,
        language: snapshot.data.metadata.language,
        stars: snapshot.data.metadata.stars,
        last_analyzed_at: nowIso,
      },
      { onConflict: "full_name" }
    )
    .select("id")
    .single();

  if (upsertRepo.error || !upsertRepo.data) {
    console.error("Supabase repo upsert failed", upsertRepo.error);
    return jsonError(500, "Failed to save repository");
  }

  // Generate the AI health report. A failure here is non-fatal: the snapshot
  // is still saved so the report page can render real GitHub data, and the
  // analysis can be regenerated later.
  const ai = await generateReport(snapshot.data);
  if (!ai.ok) {
    console.error("AI report generation failed", ai.message);
  }

  const reportRow: ReportInsertRow = ai.ok
    ? {
        repo_id: upsertRepo.data.id,
        health_grade: ai.data.healthGrade,
        health_score: ai.data.healthScore,
        score_note: ai.data.scoreNote,
        subscores: ai.data.subscores,
        activity_assessment: ai.data.activityAssessment,
        top_concerns: ai.data.topConcerns,
        suggested_priorities: ai.data.suggestedPriorities,
        raw_data: snapshot.data,
        ai_summary: ai.data.aiSummary,
      }
    : {
        repo_id: upsertRepo.data.id,
        health_grade: null,
        health_score: null,
        score_note: null,
        subscores: null,
        activity_assessment: null,
        top_concerns: null,
        suggested_priorities: null,
        raw_data: snapshot.data,
        ai_summary: null,
      };

  const insertReport = await supabase
    .from("reports")
    .insert(reportRow)
    .select("generated_at")
    .single();

  if (insertReport.error || !insertReport.data) {
    console.error("Supabase report insert failed", insertReport.error);
    return jsonError(500, "Failed to save report");
  }

  const response: AnalyzeSuccess = {
    owner,
    repo,
    data: snapshot.data,
    cached: false,
    generatedAt: insertReport.data.generated_at,
    aiGenerated: ai.ok,
  };
  return NextResponse.json(response);
}
