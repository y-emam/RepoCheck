export const sampleReport = {
  owner: "facebook",
  repo: "react",
  grade: "A",
  score: 92,
  scoreNote: "Top 4% of repos at this scale",
  analyzedSecondsAgo: 14,
  subscores: [
    { label: "Activity", grade: "A", value: 96 },
    { label: "Maintenance", grade: "A−", value: 88 },
    { label: "Community", grade: "B+", value: 82 },
    { label: "Docs", grade: "A", value: 94 },
  ],
  meta: [
    { kind: "star", value: "228k", label: "stars" },
    { kind: "fork", value: "46.7k", label: "forks" },
    { kind: "eye", value: "6,508", label: "watchers" },
  ],
  concerns: [
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
  ],
  priorities: [
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
  ],
  sources: [
    { kind: "commit", label: "47,182 commits" },
    { kind: "issue", label: "1,247 open issues" },
    { kind: "pr", label: "283 open PRs" },
    { kind: "users", label: "1,694 contributors" },
    { kind: "file", label: "README · CONTRIBUTING" },
    { kind: "trend", label: "12 releases / 90d" },
  ],
  sparkPath:
    "M0,28 L8,26 L16,22 L24,24 L32,20 L40,17 L48,18 L56,14 L64,16 L72,12 L80,13 L88,9 L96,11 L104,7 L112,9 L120,5 L128,7 L136,4 L144,6 L152,3",
} as const;

export type SampleReport = typeof sampleReport;
