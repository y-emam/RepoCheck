import { Github, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-slate-900 mt-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-teal-500">
            <ShieldCheck size={11} strokeWidth={2.6} className="text-slate-950" />
          </span>
          <span className="text-slate-400">repocheck</span>
          <span className="text-slate-700">·</span>
          <span>Built by Y. Emam</span>
          <span className="text-slate-700">·</span>
          <span>Powered by Gemini</span>
        </div>
        <a
          href="https://github.com/y-emam/repocheck"
          className="inline-flex items-center gap-1.5 font-mono text-[12px] text-slate-500 hover:text-emerald-300 transition-colors"
        >
          <Github size={13} strokeWidth={1.75} />
          github.com/y-emam/repocheck
        </a>
      </div>
    </footer>
  );
}
