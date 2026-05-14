"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Check,
  CircleAlert,
  Clock,
  Eye,
  FileText,
  GitCommitHorizontal,
  GitFork,
  GitPullRequest,
  Github,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

const concerns = [
  {
    title: "Issue backlog outpacing close rate",
    body: "1,247 open issues, with median time-to-first-response now at 6.4 days — up from 2.1 days a year ago.",
  },
  {
    title: "Concentration on top maintainers",
    body: "Three contributors account for 71% of commits over the last 90 days. Bus factor is the dominant risk.",
  },
  {
    title: 'Stale "good first issue" labels',
    body: "38 of 52 onboarding-tagged issues haven't been touched in 6+ months, blunting the new-contributor pipeline.",
  },
];

const priorities = [
  {
    title: "Triage rotation for stale issues",
    body: "A weekly two-hour triage block would clear the 30-day-old backlog within a quarter.",
  },
  {
    title: "Document the release pipeline",
    body: "Release notes are excellent; the path to becoming a release manager is not. Codify it.",
  },
  {
    title: 'Onboarding pass on "good first issue"',
    body: "Re-scope or close half the stale ones. The remaining set should be reachable in a single afternoon.",
  },
];

type Source = { icon: ReactNode; label: string };
const sources: Source[] = [
  { icon: <GitCommitHorizontal size={11} strokeWidth={1.75} />, label: "47,182 commits" },
  { icon: <CircleAlert size={11} strokeWidth={1.75} />, label: "1,247 open issues" },
  { icon: <GitPullRequest size={11} strokeWidth={1.75} />, label: "283 open PRs" },
  { icon: <Users size={11} strokeWidth={1.75} />, label: "1,694 contributors" },
  { icon: <FileText size={11} strokeWidth={1.75} />, label: "README · CONTRIBUTING" },
  { icon: <TrendingUp size={11} strokeWidth={1.75} />, label: "12 releases / 90d" },
];

const subscores = [
  { label: "Activity", grade: "A", value: 96 },
  { label: "Maintenance", grade: "A−", value: 88 },
  { label: "Community", grade: "B+", value: 82 },
  { label: "Docs", grade: "A", value: 94 },
];

const meta = [
  { icon: <Star size={12} strokeWidth={1.75} />, value: "228k", label: "stars" },
  { icon: <GitFork size={12} strokeWidth={1.75} />, value: "46.7k", label: "forks" },
  { icon: <Eye size={12} strokeWidth={1.75} />, value: "6,508", label: "watchers" },
];

const sparkPath =
  "M0,28 L8,26 L16,22 L24,24 L32,20 L40,17 L48,18 L56,14 L64,16 L72,12 L80,13 L88,9 L96,11 L104,7 L112,9 L120,5 L128,7 L136,4 L144,6 L152,3";

export function Report() {
  return (
    <section id="report" className="relative py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-20 mx-auto h-96 max-w-3xl rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[10.5px] uppercase tracking-wider font-mono text-slate-400">
            <span className="h-1 w-1 rounded-full bg-emerald-400" /> Sample report
          </div>
          <h2 className="mt-5 text-balance text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.05]">
            What a report actually looks like.
          </h2>
          <p className="mt-4 text-balance text-slate-400 text-[17px] leading-relaxed">
            Generated for{" "}
            <span className="font-mono text-slate-300">facebook/react</span> —
            same layout you&apos;ll see for your own paste.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              </div>
              <div className="hidden sm:flex items-center gap-2 font-mono text-[12px] text-slate-500">
                <Github size={13} strokeWidth={1.75} />
                <span className="text-slate-300">facebook</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-300">react</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={11} strokeWidth={1.75} />
                analyzed 14s ago
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/[0.07] px-1.5 py-0.5 text-emerald-300">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                live
              </span>
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
                    A
                  </div>
                </div>
                <div className="pb-4">
                  <div className="font-mono text-xs text-emerald-300">
                    92 / 100
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Top 4% of repos at this scale
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3.5">
                {subscores.map((s) => (
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
                {meta.map((m) => (
                  <div key={m.label}>
                    <div className="flex items-center gap-1 text-slate-500">
                      {m.icon}
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
                      <linearGradient
                        id="sparkFill"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
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
                      d={`${sparkPath} L152,32 L0,32 Z`}
                      fill="url(#sparkFill)"
                    />
                    <path
                      d={sparkPath}
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
                    {concerns.map((c, i) => (
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
                    {priorities.map((p) => (
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
                  {sources.map((s) => (
                    <span
                      key={s.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11.5px] font-mono text-slate-300"
                    >
                      <span className="text-emerald-400/80">{s.icon}</span>
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
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-slate-400 text-[15px]">
            Run one against your own repo. It&apos;s free during beta.
          </p>
          <a
            href="#hero-input"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.35)] hover:from-emerald-300 hover:to-emerald-400 active:translate-y-px transition-all"
          >
            <Zap size={15} strokeWidth={2.2} />
            Analyze a repo
            <ArrowRight size={15} strokeWidth={2.2} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
