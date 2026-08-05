'use client';

import React from 'react';
import type { Dictation } from './types';
import { useGatewayDictation } from './useGatewayDictation';
import { useWebSpeechDictation } from './useWebSpeechDictation';

/**
 * Which speech source the Flow Bar talks to.
 *
 * - `webspeech` (default) — the browser's own recognizer. On-device, free, and the fastest
 *   interim results available, but Chrome/Edge/Safari only and less accurate on names and
 *   technical terms.
 * - `gateway` — streaming transcription through the AI Gateway. Better accuracy, and it works
 *   in Firefox. Audio goes browser-to-Gateway directly; only the token is minted server-side.
 *
 * Web Speech is the default because it needs no key, no catalog lookup, and can't fail in a
 * way that costs money. Set `NEXT_PUBLIC_FLOW_ASR=gateway` once the transcription model id
 * is confirmed against the live Gateway catalog.
 */
export type AsrSource = 'webspeech' | 'gateway';

const configured = (): AsrSource =>
  process.env.NEXT_PUBLIC_FLOW_ASR === 'gateway' ? 'gateway' : 'webspeech';

/**
 * Picks a speech source and hands the Flow Bar one `Dictation` regardless.
 *
 * Both adapters are instantiated — hooks can't be conditional — but only the selected one
 * ever opens a microphone. If the Gateway path reports itself unavailable (no key, bad model
 * id, no AudioWorklet), this falls through to the browser recognizer rather than leaving the
 * visitor with a dead mic button.
 */
export const useDictation = (): Dictation => {
  const [source] = React.useState<AsrSource>(configured);

  const gateway = useGatewayDictation(source === 'gateway');
  const webSpeech = useWebSpeechDictation();

  if (source === 'gateway' && gateway.supported) return gateway;
  return webSpeech;
};
