import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { rateLimit, rateLimited } from '../../../lib/rate-limit';
import { DOSSIER, PERSONA } from './dossier';

// Edge keeps the cold start and the first token close to the visitor, which is most of what
// "feels fast" actually means here.
export const runtime = 'edge';

/**
 * The nano tier is deliberate: answering from a ~2.5K-token dossier and picking a card is an
 * easy task, and time-to-first-token matters far more than prose quality in a floating bar.
 *
 * Swapping this string is the entire cost of changing models — that's why the site talks to
 * the Gateway rather than to a provider SDK. If the prose reads thin, move up a tier here
 * and change nothing else.
 */
const MODEL = 'openai/gpt-5.4-nano';

const MAX_QUESTION_CHARS = 400;
const MAX_TURNS = 24;

const STYLE_DIRECTION: Record<string, string> = {
  Default: 'Write plainly and warmly, the way a thoughtful colleague would.',
  Casual: 'Write casually and conversationally, with contractions. Stay professional.',
  Formal:
    'Write formally and precisely, as though for a hiring committee. No contractions, no slang.',
  'Very casual':
    'Write very casually — lowercase, clipped, texting a friend. Keep every fact accurate.',
  Excited:
    'Write with genuine enthusiasm and energy. Be vivid, but never overstate what the dossier says.',
};

export async function POST(req: Request) {
  if (!(await rateLimit(req))) return rateLimited();

  let body: { messages?: UIMessage[]; style?: string };
  try {
    body = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const messages = body.messages ?? [];
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('Bad request', { status: 400 });
  }

  // Bound the conversation regardless of what the client sends — the browser is not trusted
  // to keep its own history short.
  const trimmed = messages.slice(-MAX_TURNS);
  const oversized = trimmed.some(m =>
    m.parts?.some(p => p.type === 'text' && p.text.length > MAX_QUESTION_CHARS)
  );
  if (oversized) {
    return new Response('Question too long', { status: 413 });
  }

  const styleDirection =
    STYLE_DIRECTION[body.style ?? 'Default'] ?? STYLE_DIRECTION.Default;

  const result = streamText({
    model: MODEL,
    // Stable prefix first, volatile style last, so the cacheable span stays byte-identical
    // across requests and across style changes.
    system: `${PERSONA}\n\n${DOSSIER}\n\n## Voice\n${styleDirection}`,
    messages: await convertToModelMessages(trimmed),
    maxOutputTokens: 400,
  });

  return result.toUIMessageStreamResponse();
}
