import { gateway } from '@ai-sdk/gateway';
import { rateLimit, rateLimited } from '../../../lib/rate-limit';

export const runtime = 'edge';

/**
 * Streaming speech-to-text model. `gpt-4o-mini-transcribe` streams interim results, which is
 * what makes dictation feel immediate; `whisper-1` only returns a final transcript.
 *
 * Confirm the exact id against the live catalog (`vercel ai-gateway models ls`) — this is the
 * one string here that can't be verified without an authenticated Gateway.
 */
const TRANSCRIPTION_MODEL =
  process.env.FLOW_TRANSCRIPTION_MODEL ?? 'openai/gpt-4o-mini-transcribe';

/**
 * Mints a short-lived, single-use client secret so the browser can open the Gateway's
 * transcription WebSocket directly.
 *
 * Audio never passes through this function — only the token does. That's the whole point:
 * a serverless hop in the middle of a live microphone stream is exactly the latency Wispr
 * doesn't have.
 */
export async function POST(req: Request) {
  if (!(await rateLimit(req))) return rateLimited();

  try {
    const { token, url, expiresAt } = await gateway.experimental_transcription.getToken({
      model: TRANSCRIPTION_MODEL,
      expiresAfterSeconds: 120,
    });

    return Response.json(
      { token, url, expiresAt, model: TRANSCRIPTION_MODEL },
      // A minted credential must never be cached by a CDN or the browser.
      { headers: { 'cache-control': 'no-store' } }
    );
  } catch (error) {
    // Most likely an unset AI_GATEWAY_API_KEY or a model id the catalog doesn't have. The
    // client treats any failure here as "no streaming ASR" and falls back to the browser's
    // own recognizer, so this is a downgrade rather than an outage.
    console.error('[transcribe-token] failed to mint client secret', error);
    return new Response(JSON.stringify({ error: 'transcription_unavailable' }), {
      status: 503,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
}
