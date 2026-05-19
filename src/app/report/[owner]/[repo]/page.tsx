import { ReportPage } from "@/components/report-page";
import type { AiReport } from "@/lib/ai";
import type { RepoSnapshot } from "@/lib/github";
import { createServerClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RepoLookupRow {
  id: string;
}

interface ReportLookupRow {
  raw_data: unknown;
  generated_at: string;
  health_grade: string | null;
  health_score: number | null;
  score_note: string | null;
  subscores: unknown;
  activity_assessment: string | null;
  top_concerns: unknown;
  suggested_priorities: unknown;
  ai_summary: string | null;
}

interface LoadedReport {
  snapshot: RepoSnapshot;
  generatedAt: string;
  ai: AiReport | null;
}

function buildAiReport(row: ReportLookupRow): AiReport | null {
  if (
    row.health_grade === null ||
    row.health_score === null ||
    row.score_note === null ||
    row.activity_assessment === null ||
    row.ai_summary === null
  ) {
    return null;
  }
  return {
    healthGrade: row.health_grade,
    healthScore: row.health_score,
    scoreNote: row.score_note,
    subscores: Array.isArray(row.subscores) ? (row.subscores as AiReport["subscores"]) : [],
    activityAssessment: row.activity_assessment,
    topConcerns: Array.isArray(row.top_concerns)
      ? (row.top_concerns as AiReport["topConcerns"])
      : [],
    suggestedPriorities: Array.isArray(row.suggested_priorities)
      ? (row.suggested_priorities as AiReport["suggestedPriorities"])
      : [],
    aiSummary: row.ai_summary,
  };
}

async function loadReport(
  owner: string,
  repo: string
): Promise<LoadedReport | null> {
  const supabase = createServerClient();
  const fullName = `${owner}/${repo}`;

  const repoRes = await supabase
    .from("repos")
    .select("id")
    .eq("full_name", fullName)
    .maybeSingle<RepoLookupRow>();

  if (repoRes.error) {
    console.error("Failed to load repo", repoRes.error);
    return null;
  }
  if (!repoRes.data) return null;

  const reportRes = await supabase
    .from("reports")
    .select(
      "raw_data, generated_at, health_grade, health_score, score_note, subscores, activity_assessment, top_concerns, suggested_priorities, ai_summary"
    )
    .eq("repo_id", repoRes.data.id)
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle<ReportLookupRow>();

  if (reportRes.error) {
    console.error("Failed to load report", reportRes.error);
    return null;
  }
  if (!reportRes.data?.raw_data) return null;

  return {
    snapshot: reportRes.data.raw_data as RepoSnapshot,
    generatedAt: reportRes.data.generated_at,
    ai: buildAiReport(reportRes.data),
  };
}

export default async function Page({
  params,
}: {
  params: { owner: string; repo: string };
}) {
  const result = await loadReport(params.owner, params.repo);
  return (
    <ReportPage
      owner={params.owner}
      repo={params.repo}
      snapshot={result?.snapshot ?? null}
      generatedAt={result?.generatedAt ?? null}
      ai={result?.ai ?? null}
    />
  );
}
