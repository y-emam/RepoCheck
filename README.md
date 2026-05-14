# RepoCheck

GitHub repo health, instantly graded.

Paste any public repository — AI reads the commits, issues, PRs, and README, then hands back a letter grade with the concerns and priorities that actually matter.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for animations
- [lucide-react](https://lucide.dev/) for icons

## Getting started

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the project |
| `npm run type-check` | Run TypeScript without emitting |

## Project structure

```
src/
├── app/              # App Router entry (layout, page, globals)
├── components/       # Page sections (hero, how-it-works, report, nav, footer)
│   └── ui/           # Reusable primitives (button, input)
└── lib/              # Shared utilities
```

## Status

Public beta. The current build is the marketing surface and a sample report; repo-analysis is wired up next.

## License

[MIT](./LICENSE) &copy; Yasser Emam
