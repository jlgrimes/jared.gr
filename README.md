# jared.gr

Personal site, structured as a monorepo that separates **what the site says** from **how it looks**.

```
apps/
  web/                    Next.js shell — routing, styles entry, public assets, deploy target
                          SiteShell picks a wrapper; the corner peel switches between them.
                          api/flow            answers questions (AI Gateway)
                          api/transcribe-token mints a short-lived speech-to-text token
packages/
  info/                   @jared/info — pure content (profile, projects, testimonials,
                          socials, skills, redirects) + the Info type. No React, no deps.
  wrapper-windows/        @wrapper/windows — Windows 11 desktop renderer.
                          Exports <WindowsWrapper info={...} />.
  wrapper-wispr/          @wrapper/wispr — Wispr Flow-style renderer. A floating notch that
                          grows into a panel and holds the whole site.
                          Exports <WisprWrapper info={...} />.
```

## The two faces

The site opens as **Flow** — a cream canvas and a floating bar you talk or type to. Ask it
something and the bar grows into a panel holding the answer plus a card (projects,
a project, testimonials, skills, contact).

The **Windows** desktop is still there. Peel the top-right corner and the whole page tears
away to reveal it; peel again to come back. The choice persists.

Both are pure functions of the same `Info`. Neither knows the other exists — `SiteShell`
owns the switch.

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

### Environment

| Variable | Needed for | Notes |
|---|---|---|
| `AI_GATEWAY_API_KEY` | answering questions | On Vercel, `VERCEL_OIDC_TOKEN` is injected automatically and this can be left unset. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | rate limiting | Optional. Without them the limiter falls back to an in-process counter, which is much weaker on serverless. |
| `FLOW_TRANSCRIPTION_MODEL` | dictation | Defaults to `openai/gpt-4o-mini-transcribe`. |
| `NEXT_PUBLIC_FLOW_ASR` | dictation | `webspeech` (default) or `gateway`. See below. |

Both API routes are rate limited, and the Gateway API key should carry a budget — the
endpoints are public and spend real money.

### Speech to text

The Flow Bar dictates through one of two adapters behind the same interface:

- **`webspeech`** (default) — the browser's own recognizer. On-device, free, and the fastest
  interim results available. Chrome, Edge, and Safari only.
- **`gateway`** — streaming transcription over the AI Gateway. Better accuracy, and it works
  in Firefox. Audio goes browser-to-Gateway directly over a WebSocket; the only server hop
  is minting a token, and that happens on mic hover, before you speak.

Web Speech is the default because it needs no key and can't fail in a way that costs money.
To switch, confirm the transcription model is in your catalog and set the flag:

```bash
vercel ai-gateway models ls | grep transcribe
NEXT_PUBLIC_FLOW_ASR=gateway
```

If the Gateway path can't start — no key, unknown model, no `AudioWorklet` — it reports
itself unsupported and the browser recognizer takes over.

## Deploy (Vercel)

The Vercel project's **Root Directory** must be set to `apps/web`
(Project Settings → Build & Deployment). Install/build commands stay default;
Vercel detects the npm workspace from the repo root.
