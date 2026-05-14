"use client";

import Link from "next/link";
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
  RefreshCw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { sampleReport } from "@/lib/sample-report";

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

export function ReportPage({ owner, repo }: { owner: string; repo: string }) {
  const r = sampleReport;
  const githubUrl = `https://github.com/${owner}/${repo}`;
  const analyzedLabel = "Last analyzed: 2 minutes ago";

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
              <Button
                variant="emeraldOutline"
                size="sm"
                className="h-8 rounded-lg px-3 text-xs"
              >
                <RefreshCw size={12} strokeWidth={2} />
                Regenerate report
              </Button>
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

              <div className="mt-3 flex items-end gap-4">
                <div className="relative">
                  <div className="absolute inset-0 -m-6 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="relative font-bold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-500 text-[140px] sm:text-[170px]">
                    {r.grade}
                  </div>
                </div>
                <div className="pb-4">
                  <div className="font-mono text-xs text-emerald-300">
                    {r.score} / 100
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {r.scoreNote}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3.5">
                {r.subscores.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="text-slate-300">{s.label}</span>
                      <span className="font-mono text-emerald-300">{s.grade}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        style={{ width: `${s.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 border-t border-slate-800/80 pt-6">
                {r.meta.map((m) => (
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
                      d={`${r.sparkPath} L152,32 L0,32 Z`}
                      fill="url(#sparkFill2)"
                    />
                    <path
                      d={r.sparkPath}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-slate-300">
                  Sustained, high-cadence engineering. The project shipped{" "}
                  <span className="text-white">
                    12 releases in the last 90 days
                  </span>
                  , with commit volume up{" "}
                  <span className="text-emerald-300">
                    14% quarter-over-quarter
                  </span>
                  . Maintainer responsiveness on security-tagged issues remains
                  under 24 hours. Discussion threads on RFC-class proposals are
                  dense and substantive — a signal of a healthy contributor
                  culture rather than churn.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-slate-500">
                  <span>{analyzedLabel}</span>
                  <span className="text-slate-700">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Sparkles
                      size={11}
                      strokeWidth={1.75}
                      className="text-emerald-400/80"
                    />
                    Powered by Gemini 2.0 Flash
                  </span>
                </div>
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
                  <ul className="mt-4 space-y-4">
                    {r.concerns.map((c, i) => (
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
                  <ul className="mt-4 space-y-4">
                    {r.priorities.map((p) => (
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
                </div>
              </div>

              <div className="mt-9 border-t border-slate-800/80 pt-5">
                <div className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500">
                  Source data
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.sources.map((s) => (
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
