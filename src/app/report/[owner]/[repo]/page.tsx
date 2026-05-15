import { ReportPage } from "@/components/report-page";
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
}

async function loadReport(
  owner: string,
  repo: string
): Promise<{ snapshot: RepoSnapshot; generatedAt: string } | null> {
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
    .select("raw_data, generated_at")
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
    />
  );
}
