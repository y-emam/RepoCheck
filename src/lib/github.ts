import { Octokit } from "@octokit/rest";

export type RepoSnapshotErrorType =
  | "not_found"
  | "rate_limited"
  | "forbidden"
  | "unknown";

export type RepoSnapshotResult =
  | { ok: true; data: RepoSnapshot }
  | { ok: false; errorType: RepoSnapshotErrorType; message: string };

export interface RepoSnapshot {
  metadata: RepoMetadata;
  topContributors: ContributorSummary[];
  commits: CommitActivity;
  issues: IssueActivity;
  pullRequests: PullRequestActivity;
  readme: string | null;
  releaseCount90d: number;
}

export interface RepoMetadata {
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;
  archived: boolean;
  defaultBranch: string;
  lastCommitAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  homepage: string | null;
  license: string | null;
}

export interface ContributorSummary {
  login: string;
  contributions: number;
  avatarUrl: string | null;
  htmlUrl: string | null;
}

export interface CommitActivity {
  totalLast30: number;
  totalLast90: number;
}

export interface IssueSummary {
  number: number;
  title: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

export interface IssueActivity {
  totalOpen: number;
  recent: IssueSummary[];
}

export interface PullRequestSummary {
  number: number;
  title: string;
  state: "open" | "closed";
  draft: boolean;
  createdAt: string;
  updatedAt: string;
  htmlUrl: string;
}

export interface PullRequestActivity {
  totalOpen: number;
  recent: PullRequestSummary[];
}

const README_LIMIT = 5000;

function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  return new Octokit(token ? { auth: token } : {});
}

function isErrorWithStatus(value: unknown): value is { status: number; message?: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof (value as { status: unknown }).status === "number"
  );
}

function classifyError(err: unknown): {
  errorType: RepoSnapshotErrorType;
  message: string;
} {
  if (isErrorWithStatus(err)) {
    if (err.status === 404) {
      return { errorType: "not_found", message: "Repository not found" };
    }
    if (err.status === 403) {
      const msg = err.message ?? "";
      if (/rate limit/i.test(msg) || /api rate limit/i.test(msg)) {
        return { errorType: "rate_limited", message: "GitHub API rate limit exceeded" };
      }
      return { errorType: "forbidden", message: msg || "Forbidden" };
    }
    if (err.status === 429) {
      return { errorType: "rate_limited", message: "GitHub API rate limit exceeded" };
    }
  }
  const message =
    err instanceof Error ? err.message : "Unknown error fetching repository";
  return { errorType: "unknown", message };
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function decodeBase64(content: string): string {
  return Buffer.from(content, "base64").toString("utf8");
}

export async function fetchRepoSnapshot(
  owner: string,
  repo: string
): Promise<RepoSnapshotResult> {
  const octokit = getOctokit();
  const since30 = isoDaysAgo(30);
  const since90 = isoDaysAgo(90);

  try {
    const repoResp = await octokit.repos.get({ owner, repo });
    const r = repoResp.data;

    const [
      contributorsResp,
      commits30Resp,
      commits90Resp,
      issuesResp,
      prsResp,
      readmeResp,
      releasesResp,
    ] = await Promise.all([
      octokit.repos.listContributors({ owner, repo, per_page: 5 }).catch(() => null),
      octokit.repos
        .listCommits({ owner, repo, since: since30, per_page: 100 })
        .catch(() => null),
      octokit.repos
        .listCommits({ owner, repo, since: since90, per_page: 100 })
        .catch(() => null),
      octokit.issues
        .listForRepo({ owner, repo, state: "open", per_page: 30, sort: "created", direction: "desc" })
        .catch(() => null),
      octokit.pulls
        .list({ owner, repo, state: "open", per_page: 20, sort: "created", direction: "desc" })
        .catch(() => null),
      octokit.repos.getReadme({ owner, repo }).catch(() => null),
      octokit.repos
        .listReleases({ owner, repo, per_page: 100 })
        .catch(() => null),
    ]);

    const topContributors: ContributorSummary[] = (contributorsResp?.data ?? [])
      .slice(0, 5)
      .map((c) => ({
        login: c.login ?? "unknown",
        contributions: c.contributions ?? 0,
        avatarUrl: c.avatar_url ?? null,
        htmlUrl: c.html_url ?? null,
      }));

    const recentIssues = (issuesResp?.data ?? [])
      .filter((i) => !("pull_request" in i) || i.pull_request === undefined)
      .slice(0, 30)
      .map<IssueSummary>((i) => ({
        number: i.number,
        title: i.title,
        labels: i.labels.map((l) => (typeof l === "string" ? l : l.name ?? "")).filter(Boolean),
        createdAt: i.created_at,
        updatedAt: i.updated_at,
        htmlUrl: i.html_url,
      }));

    const recentPrs = (prsResp?.data ?? []).slice(0, 20).map<PullRequestSummary>((p) => ({
      number: p.number,
      title: p.title,
      state: p.state === "closed" ? "closed" : "open",
      draft: Boolean(p.draft),
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      htmlUrl: p.html_url,
    }));

    const cutoff90 = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const releaseCount90d = (releasesResp?.data ?? []).filter((rel) => {
      const t = rel.published_at ?? rel.created_at;
      return t ? new Date(t).getTime() >= cutoff90 : false;
    }).length;

    let readme: string | null = null;
    if (readmeResp?.data?.content) {
      const decoded = decodeBase64(readmeResp.data.content);
      readme = decoded.slice(0, README_LIMIT);
    }

    const lastCommitAt =
      commits30Resp?.data?.[0]?.commit?.author?.date ??
      commits30Resp?.data?.[0]?.commit?.committer?.date ??
      r.pushed_at ??
      null;

    const metadata: RepoMetadata = {
      fullName: r.full_name,
      description: r.description ?? null,
      language: r.language ?? null,
      stars: r.stargazers_count ?? 0,
      forks: r.forks_count ?? 0,
      watchers: r.subscribers_count ?? r.watchers_count ?? 0,
      archived: Boolean(r.archived),
      defaultBranch: r.default_branch,
      lastCommitAt,
      createdAt: r.created_at ?? null,
      updatedAt: r.updated_at ?? null,
      homepage: r.homepage ?? null,
      license: r.license?.spdx_id ?? r.license?.name ?? null,
    };

    return {
      ok: true,
      data: {
        metadata,
        topContributors,
        commits: {
          totalLast30: commits30Resp?.data?.length ?? 0,
          totalLast90: commits90Resp?.data?.length ?? 0,
        },
        issues: {
          totalOpen: r.open_issues_count ?? recentIssues.length,
          recent: recentIssues,
        },
        pullRequests: {
          totalOpen: recentPrs.length,
          recent: recentPrs,
        },
        readme,
        releaseCount90d,
      },
    };
  } catch (err) {
    const { errorType, message } = classifyError(err);
    return { ok: false, errorType, message };
  }
}
