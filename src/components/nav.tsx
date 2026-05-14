"use client";

import { motion } from "framer-motion";
import { Github, ShieldCheck } from "lucide-react";

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative z-30"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
            <ShieldCheck size={18} strokeWidth={2.4} className="text-slate-950" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            repocheck
          </span>
          <span className="ml-1 hidden sm:inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-300">
            beta
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#how" className="hover:text-white transition-colors">
            How it works
          </a>
          <a href="#report" className="hover:text-white transition-colors">
            Example report
          </a>
        </nav>

        <a
          href="https://github.com/y-emam/repocheck"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <Github size={16} strokeWidth={1.75} />
          <span className="hidden sm:inline">Star on GitHub</span>
        </a>
      </div>
    </motion.header>
  );
}
