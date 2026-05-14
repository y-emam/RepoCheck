"use client";

import { motion } from "framer-motion";
import {
  Brain,
  ChevronRight,
  CircleAlert,
  FileText,
  Gauge,
  GitCommitHorizontal,
  GitPullRequest,
  Link as LinkIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

type Step = {
  n: string;
  icon: ReactNode;
  title: string;
  body: string;
  glow: string;
  iconColor: string;
  iconBorder: string;
};

const steps: Step[] = [
  {
    n: "01",
    icon: <LinkIcon size={22} strokeWidth={1.75} />,
    title: "Paste a GitHub URL",
    body: "Any public repository — Node, Python, Rust, monorepo, abandoned weekend project. If it has commits, we can read it.",
    glow: "from-emerald-400/20 to-emerald-500/0",
    iconColor: "text-emerald-300",
    iconBorder: "border-emerald-500/20",
  },
  {
    n: "02",
    icon: <Brain size={22} strokeWidth={1.75} />,
    title: "AI reads the signals",
    body: "Commits, issue threads, open PRs, contributor activity, README clarity, release cadence — all weighed against repos of similar shape.",
    glow: "from-teal-400/20 to-teal-500/0",
    iconColor: "text-teal-300",
    iconBorder: "border-teal-500/20",
  },
  {
    n: "03",
    icon: <Gauge size={22} strokeWidth={1.75} />,
    title: "Get a graded report",
    body: "A letter grade, an activity assessment, the three concerns worth fixing now, and the priorities that actually move the needle.",
    glow: "from-emerald-400/20 to-emerald-500/0",
    iconColor: "text-emerald-300",
    iconBorder: "border-emerald-500/20",
  },
];

const signals = [
  { icon: <GitCommitHorizontal size={13} strokeWidth={1.75} />, label: "Commit history" },
  { icon: <CircleAlert size={13} strokeWidth={1.75} />, label: "Open issues" },
  { icon: <GitPullRequest size={13} strokeWidth={1.75} />, label: "PR velocity" },
  { icon: <Users size={13} strokeWidth={1.75} />, label: "Contributor mix" },
  { icon: <FileText size={13} strokeWidth={1.75} />, label: "README quality" },
  { icon: <TrendingUp size={13} strokeWidth={1.75} />, label: "Release cadence" },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[10.5px] uppercase tracking-wider font-mono text-slate-400">
            <span className="h-1 w-1 rounded-full bg-emerald-400" /> How it works
          </div>
          <h2 className="mt-5 text-balance text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.05]">
            Three steps. One honest report.
          </h2>
          <p className="mt-4 text-balance text-slate-400 text-[17px] leading-relaxed">
            No dashboards to configure. No tokens to mint. Paste a URL and read
            the assessment a careful reviewer would write.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-7 backdrop-blur-sm hover:border-slate-700 transition-colors"
            >
              <div
                className={`pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-60 bg-gradient-to-br ${s.glow}`}
              />
              <div className="relative flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-slate-950/70 ${s.iconColor} ${s.iconBorder}`}
                >
                  {s.icon}
                </div>
                <span className="font-mono text-[11px] tracking-widest text-slate-600">
                  STEP {s.n}
                </span>
              </div>
              <h3 className="relative mt-6 text-xl font-semibold text-white tracking-tight">
                {s.title}
              </h3>
              <p className="relative mt-2.5 text-[14.5px] leading-relaxed text-slate-400">
                {s.body}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 z-10 h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-slate-500">
                  <ChevronRight size={12} strokeWidth={1.75} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500"
        >
          <span className="font-mono uppercase tracking-wider text-[10.5px]">
            Signals read
          </span>
          <span className="hidden sm:inline h-3 w-px bg-slate-800" />
          {signals.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 text-slate-400"
            >
              <span className="text-emerald-400/80">{b.icon}</span>
              {b.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
