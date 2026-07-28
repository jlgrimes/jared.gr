# jared.gr

Personal site, structured as a monorepo that separates **what the site says** from **how it looks**.

```
apps/
  web/                    Next.js shell — routing, styles entry, public assets, deploy target
packages/
  info/                   @jared/info — pure content (profile, projects, testimonials,
                          socials, skills, redirects) + the Info type. No React, no deps.
  wrapper-windows/        @wrapper/windows — Windows 11 desktop renderer.
                          Exports <WindowsWrapper info={...} />.
```

## The wrapper contract

A wrapper is a package that renders an `Info` (from `@jared/info`) as a full site:

```tsx
// apps/web/app/page.tsx
import { info } from '@jared/info';
import { WindowsWrapper } from '@wrapper/windows';

export default function Home() {
  return <WindowsWrapper info={info} />;
}
```

To redesign the site, build a new package (e.g. `@wrapper/terminal`, `@wrapper/apple`)
with the same `{ info: Info }` prop and swap it in `page.tsx`. Content changes only ever
touch `packages/info/src/data.ts`.

## Development

```bash
npm install
npm run dev      # runs apps/web on localhost:3000
npm run build
```

## Deploy (Vercel)

The Vercel project's **Root Directory** must be set to `apps/web`
(Project Settings → Build & Deployment). Install/build commands stay default;
Vercel detects the npm workspace from the repo root.
