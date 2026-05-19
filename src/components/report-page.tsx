"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  ExternalLink,
  Eye,
  FileText,
  GitCommitHorizontal,
  GitFork,
  GitPullRequest,
  Github,
  Loader2,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AiReport } from "@/lib/ai";
import type { RepoSnapshot } from "@/lib/github";

interface ReportPageProps {
  owner: string;
  repo: string;
  snapshot: RepoSnapshot | null;
  generatedAt: string | null;
  ai: AiReport | null;
}

// Decorative sparkline for the activity panel header.
const SPARK_PATH =
  "M0,28 L8,26 L16,22 L24,24 L32,20 L40,17 L48,18 L56,14 L64,16 L72,12 L80,13 L88,9 L96,11 L104,7 L112,9 L120,5 L128,7 L136,4 L144,6 L152,3";

const sourceIcon: Record<string, ReactNode> = {
  commit: <GitCommitHorizontal size={11} strokeWidth={1.75} />,
  issue: <CircleAlert size={11} strokeWidth={1.75} />,
  pr: <GitPullRequest size={11} strokeWidth={1.75} />,
  users: <Users size={11} strokeWidth={1.75} />,
  file: <FileText size={11} strokeWidth={1.75} />,
  trend: <TrendingUp size={11} strokeWidth={1.75} />,
};

const metaIcon: Record<string, ReactNode> = {
  star: <Star size={12} strokeWidth={1.75} />,
  fork: <GitFork size={12} strokeWidth={1.75} />,
  eye: <Eye size={12} strokeWidth={1.75} />,
};

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}k`;
  return n.toLocaleString("en-US");
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return "just now";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function ReportPage({ owner, repo, snapshot, generatedAt, ai }: ReportPageProps) {
  if (!snapshot || !generatedAt) {
    return <NotAnalyzedState owner={owner} repo={repo} />;
  }

  const githubUrl = `https://github.com/${owner}/${repo}`;

  const meta: { kind: string; value: string; label: string }[] = [
    { kind: "star", value: formatCompact(snapshot.metadata.stars), label: "stars" },
    { kind: "fork", value: formatCompact(snapshot.metadata.forks), label: "forks" },
    { kind: "eye", value: formatCompact(snapshot.metadata.watchers), label: "watchers" },
  ];

  const sources: { kind: string; label: string }[] = [
    { kind: "commit", label: `${formatNumber(snapshot.commits.totalLast90)} commits / 90d` },
    { kind: "issue", label: `${formatNumber(snapshot.issues.totalOpen)} open issues` },
    { kind: "pr", label: `${formatNumber(snapshot.pullRequests.totalOpen)} open PRs` },
    {
      kind: "users",
      label: `${formatNumber(snapshot.topContributors.length)} top contributors`,
    },
    { kind: "trend", label: `${formatNumber(snapshot.releaseCount90d)} releases / 90d` },
  ];
  if (snapshot.readme) {
    sources.splice(4, 0, { kind: "file", label: "README" });
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-96 max-w-3xl rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-10 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft
              size={14}
              strokeWidth={1.75}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            back to repocheck
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
        >
          <div className="flex flex-col gap-3 border-b border-slate-800/80 bg-slate-950/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex items-center gap-2 font-mono text-[13px] text-slate-500">
              <Github size={14} strokeWidth={1.75} />
              <span className="text-slate-300">{owner}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300">{repo}</span>
              <span className="ml-2 hidden sm:inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/[0.07] px-1.5 py-0.5 text-[11px] text-emerald-300">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RegenerateButton owner={owner} repo={repo} />
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                View on GitHub
                <ExternalLink size={12} strokeWidth={1.75} />
              </a>
            </div>
          </div>

          <div className="grid gap-px bg-slate-800/60 lg:grid-cols-[1.05fr_2fr]">
            <div className="relative bg-slate-950/60 p-8 sm:p-10">
              <div className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500">
                Overall health
              </div>

              {ai ? (
                <>
                  <div className="mt-3 flex items-end gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 -m-6 rounded-full bg-emerald-500/20 blur-3xl" />
                      <div className="relative font-bold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-500 text-[140px] sm:text-[170px]">
                        {ai.healthGrade}
                      </div>
                    </div>
                    <div className="pb-4">
                      <div className="font-mono text-xs text-emerald-300">
                        {ai.healthScore} / 100
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {ai.scoreNote}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3.5">
                    {ai.subscores.map((s) => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between text-[12.5px]">
                          <span className="text-slate-300">{s.label}</span>
                          <span className="font-mono text-emerald-300">{s.grade}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            style={{ width: `${Math.max(0, Math.min(100, s.value))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-3 flex items-end gap-4">
                  <div className="relative font-bold leading-none tracking-tight text-slate-700 text-[140px] sm:text-[170px]">
                    —
                  </div>
                  <div className="pb-4 text-xs text-slate-500">
                    AI analysis didn&apos;t complete. Use{" "}
                    <span className="text-slate-300">Regenerate report</span> to
                    try again.
                  </div>
                </div>
              )}

              <div className="mt-7 grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-6">
                {meta.map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center gap-1 text-slate-500">
                      {metaIcon[m.kind]}
                      <span className="text-[10.5px] font-mono uppercase tracking-wider">
                        {m.label}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-sm text-white">
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/40 p-8 sm:p-10">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300">
                      <Activity size={14} strokeWidth={1.75} />
                    </span>
                    <h3 className="text-[15px] font-semibold text-white">
                      Activity assessment
                    </h3>
                  </div>
                  <svg
                    viewBox="0 0 152 32"
                    className="h-7 w-32 text-emerald-400/80"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="sparkFill2" x1="0" x2="0" y1="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor="rgb(52,211,153)"
                          stopOpacity="0.35"
                        />
                        <stop
                          offset="100%"
                          stopColor="rgb(52,211,153)"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={`${SPARK_PATH} L152,32 L0,32 Z`}
                      fill="url(#sparkFill2)"
                    />
                    <path
                      d={SPARK_PATH}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-slate-300">
                  {ai
                    ? ai.activityAssessment
                    : "The AI activity assessment for this repository didn't complete. The GitHub data below is still accurate — regenerate the report to produce the analysis."}
                </p>
                <AnalyzedAt generatedAt={generatedAt} />
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/[0.07] text-amber-300">
                      <AlertTriangle size={13} strokeWidth={1.75} />
                    </span>
                    <h3 className="text-[15px] font-semibold text-white">
                      Top concerns
                    </h3>
                  </div>
                  {ai && ai.topConcerns.length > 0 ? (
                    <ul className="mt-4 space-y-4">
                      {ai.topConcerns.map((c, i) => (
                        <li key={c.title} className="relative pl-6">
                          <span className="absolute left-0 top-1.5 font-mono text-[11px] text-amber-300/80">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="text-[13.5px] font-medium text-slate-100">
                            {c.title}
                          </div>
                          <div className="mt-1 text-[13px] leading-relaxed text-slate-400">
                            {c.body}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
                      Not available — regenerate the report.
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300">
                      <Target size={13} strokeWidth={1.75} />
                    </span>
                    <h3 className="text-[15px] font-semibold text-white">
                      Suggested priorities
                    </h3>
                  </div>
                  {ai && ai.suggestedPriorities.length > 0 ? (
                    <ul className="mt-4 space-y-4">
                      {ai.suggestedPriorities.map((p) => (
                        <li key={p.title} className="relative pl-6">
                          <Check
                            size={12}
                            strokeWidth={1.75}
                            className="absolute left-0 top-1.5 text-emerald-400"
                          />
                          <div className="text-[13.5px] font-medium text-slate-100">
                            {p.title}
                          </div>
                          <div className="mt-1 text-[13px] leading-relaxed text-slate-400">
                            {p.body}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
                      Not available — regenerate the report.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-9 border-t border-slate-800/80 pt-5">
                <div className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500">
                  Source data
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sources.map((s) => (
                    <span
                      key={s.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11.5px] font-mono text-slate-300"
                    >
                      <span className="text-emerald-400/80">
                        {sourceIcon[s.kind]}
                      </span>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-12 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-slate-400 text-[15px]">
            Want a report for a different repo?
          </p>
          <Link
            href="/#hero-input"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.35)] hover:from-emerald-300 hover:to-emerald-400 active:translate-y-px transition-all"
          >
            <Zap size={15} strokeWidth={2.2} />
            Analyze another repo
            <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function AnalyzedAt({ generatedAt }: { generatedAt: string }) {
  const [label, setLabel] = useState<string>(() => formatRelative(generatedAt));
  useEffect(() => {
    setLabel(formatRelative(generatedAt));
    const id = setInterval(() => setLabel(formatRelative(generatedAt)), 30_000);
    return () => clearInterval(id);
  }, [generatedAt]);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500">
      <span>Last analyzed: {label}</span>
      <span className="text-slate-700">·</span>
      <span className="inline-flex items-center gap-1">
        <Sparkles size={11} strokeWidth={1.75} className="text-emerald-400/80" />
        Powered by Gemini 2.5 Flash
      </span>
    </div>
  );
}

function RegenerateButton({ owner, repo }: { owner: string; repo: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `https://github.com/${owner}/${repo}` }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Failed to regenerate");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error("Regenerate failed", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-[11px] text-rose-300">{error}</span>}
      <Button
        type="button"
        variant="emeraldOutline"
        size="sm"
        disabled={loading}
        onClick={handleClick}
        className="h-8 rounded-lg px-3 text-xs"
      >
        {loading ? (
          <Loader2 size={12} strokeWidth={2} className="animate-spin" />
        ) : (
          <RefreshCw size={12} strokeWidth={2} />
        )}
        {loading ? "Regenerating…" : "Regenerate report"}
      </Button>
    </div>
  );
}

function NotAnalyzedState({ owner, repo }: { owner: string; repo: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: `https://github.com/${owner}/${repo}` }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Failed to analyze");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error("Analyze failed", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl px-6 lg:px-10 pt-10 pb-24">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.75}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          back to repocheck
        </Link>

        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center backdrop-blur-xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300">
            <Github size={20} strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-white">
            Repository not yet analyzed
          </h1>
          <p className="mt-2 font-mono text-sm text-slate-400">
            {owner}/{repo}
          </p>
          <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-slate-400">
            We don&apos;t have a report for this repository yet. Run an analysis
            to fetch its commits, issues, PRs, and README.
          </p>

          {error && (
            <div
              role="alert"
              className="mx-auto mt-5 max-w-md rounded-lg border border-rose-500/30 bg-rose-500/[0.06] px-3 py-2 text-xs text-rose-200"
            >
              {error}
            </div>
          )}

          <div className="mt-7 flex items-center justify-center gap-3">
            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              {loading ? (
                <Loader2 size={15} strokeWidth={2.2} className="animate-spin" />
              ) : (
                <Sparkles size={15} strokeWidth={2.2} />
              )}
              {loading ? "Analyzing…" : "Analyze this repo"}
            </Button>
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
            >
              View on GitHub
              <ExternalLink size={13} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
