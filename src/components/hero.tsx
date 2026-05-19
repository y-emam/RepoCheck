"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  ClipboardPaste,
  Github,
  Link as LinkIcon,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const examples = [
  { label: "facebook/react", url: "https://github.com/facebook/react" },
  { label: "vercel/next.js", url: "https://github.com/vercel/next.js" },
  { label: "microsoft/vscode", url: "https://github.com/microsoft/vscode" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaste = () => {
    navigator.clipboard
      ?.readText()
      .then((t) => t && setUrl(t))
      .catch(() => {});
  };

  const submitUrl = async (target: string) => {
    const value = target.trim();
    if (!value || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
      const payload = (await res.json().catch(() => null)) as
        | { owner?: string; repo?: string; error?: string }
        | null;
      if (!res.ok) {
        setError(payload?.error ?? "Something went wrong analyzing that repo");
        return;
      }
      if (!payload?.owner || !payload?.repo) {
        setError("Server returned an unexpected response");
        return;
      }
      router.push(`/report/${payload.owner}/${payload.repo}`);
      // Bust the client Router Cache so the report page reflects the analysis
      // that just completed, even if that route was visited earlier.
      router.refresh();
    } catch (err) {
      console.error("Analyze request failed", err);
      setError("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitUrl(url);
  };

  const handleChipClick = (chipUrl: string) => {
    setUrl(chipUrl);
    void submitUrl(chipUrl);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full bg-emerald-500/25 blur-[120px] animate-blob1" />
        <div className="absolute top-[20%] left-[10%] h-[360px] w-[360px] rounded-full bg-teal-500/20 blur-[100px] animate-blob2" />
        <div className="absolute top-[5%] right-[8%] h-[300px] w-[300px] rounded-full bg-emerald-400/15 blur-[110px] animate-blob3" />
      </div>

      <div className="pointer-events-none absolute inset-0 grid-bg" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-10 pt-16 pb-28 sm:pt-24 sm:pb-36 text-center">
        <motion.div {...fadeUp(0)} className="flex justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1 text-xs text-emerald-200 backdrop-blur-sm hover:bg-emerald-500/10 transition-colors"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono uppercase tracking-wider text-[10.5px]">
              Now in public beta
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Powered by Gemini</span>
            <ChevronRight
              size={12}
              strokeWidth={1.75}
              className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
            />
          </a>
        </motion.div>

        <motion.h1
          {...fadeUp(0.08)}
          className="mt-8 text-balance text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.02]"
        >
          GitHub Repo Health,
          <br />
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Instantly Graded.
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.16)}
          className="mx-auto mt-6 max-w-2xl text-balance text-base sm:text-lg text-slate-400 leading-relaxed"
        >
          Paste any public repository — AI reads the commits, issues, PRs, and
          README, then hands back a letter grade with the concerns and
          priorities that actually matter.
        </motion.p>

        <motion.form
          {...fadeUp(0.24)}
          id="hero-input"
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-2xl"
        >
          <div
            className={cn(
              "group relative flex items-center gap-2 rounded-2xl border bg-slate-900/60 p-1.5 backdrop-blur-xl transition-all",
              focused
                ? "border-emerald-400/40 shadow-[0_0_0_4px_rgba(52,211,153,0.08),0_20px_60px_-20px_rgba(16,185,129,0.45)]"
                : "border-slate-800 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]"
            )}
          >
            <div className="pl-3 pr-1 text-slate-500">
              <Github size={18} strokeWidth={1.75} />
            </div>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="https://github.com/owner/repository"
              className="flex-1 min-w-0 py-3 font-mono"
              spellCheck={false}
              autoCorrect="off"
            />
            <button
              type="button"
              onClick={handlePaste}
              disabled={submitting}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 transition-colors disabled:opacity-50"
              title="Paste from clipboard"
            >
              <ClipboardPaste size={14} strokeWidth={1.75} />
              Paste
            </button>
            <Button
              type="submit"
              disabled={submitting || url.trim().length === 0}
              className="shrink-0 rounded-xl px-4 sm:px-5 py-2.5 text-sm font-semibold"
            >
              {submitting ? (
                <Loader2 size={15} strokeWidth={2.2} className="animate-spin" />
              ) : (
                <Sparkles size={15} strokeWidth={2.2} />
              )}
              {submitting ? "Analyzing…" : "Analyze"}
            </Button>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/[0.06] px-3 py-2 text-xs text-rose-200"
            >
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-500">Try:</span>
            {examples.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => handleChipClick(ex.url)}
                disabled={submitting}
                className="group inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 font-mono text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/[0.06] hover:text-emerald-200 transition-all disabled:opacity-50"
              >
                <LinkIcon
                  size={11}
                  strokeWidth={1.75}
                  className="text-slate-500 group-hover:text-emerald-400 transition-colors"
                />
                {ex.label}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Check size={13} strokeWidth={1.75} className="text-emerald-400" />
              No sign-in required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={13} strokeWidth={1.75} className="text-emerald-400" />
              Public repos only
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={13} strokeWidth={1.75} className="text-emerald-400" />
              Report in &lt; 20 seconds
            </span>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
