'use client';

import React from 'react';
import {
  CAPTURE_PROCESSOR,
  CAPTURE_SAMPLE_RATE,
  captureWorkletUrl,
} from './audioWorklet';
import type { Dictation } from './types';

// Wire protocol for the Gateway's transcription socket, mirroring what @ai-sdk/gateway does
// server-side. We speak it directly from the browser because the SDK's own path wants a
// ReadableStream request body, and streaming request bodies are Chrome-only.
const SUBPROTOCOL = 'ai-gateway-transcription.v1';
const AUTH_PREFIX = 'ai-gateway-auth.';
const START_FRAME = 'transcription-stream.start';
const AUDIO_DONE_FRAME = 'transcription-stream.audio-done';

const MAX_SECONDS = 30;
const AMPLITUDE_WINDOW = 64;

interface TokenResponse {
  token: string;
  url: string;
  model: string;
}

/** Server frames are serialized transcription stream parts. */
interface StreamPart {
  type: string;
  text?: string;
  delta?: string;
  error?: unknown;
}

/**
 * Dictation over the Gateway's streaming transcription socket.
 *
 * Audio goes straight from the browser to the Gateway — the only server hop is minting a
 * short-lived token, and that happens before the user speaks. Interim results arrive as
 * `transcript-partial` (revisable) and settle into `transcript-final`, which is exactly the
 * behaviour that makes dictation feel instant.
 *
 * Reports `supported: false` if anything in the chain is unavailable, so the caller can fall
 * back to the browser's own recognizer.
 */
export const useGatewayDictation = (enabled: boolean): Dictation => {
  const [supported, setSupported] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [partial, setPartial] = React.useState('');
  const [amplitudes, setAmplitudes] = React.useState<number[]>([]);

  const sessionRef = React.useRef<{
    socket: WebSocket;
    ctx: AudioContext;
    stream: MediaStream;
    node: AudioWorkletNode;
  } | null>(null);
  const finalRef = React.useRef('');
  const partialRef = React.useRef('');
  const resolveRef = React.useRef<((text: string) => void) | null>(null);
  const cancelledRef = React.useRef(false);
  const timeoutRef = React.useRef<number | null>(null);
  // Pre-minted on hover so the socket handshake isn't in the critical path.
  const tokenRef = React.useRef<TokenResponse | null>(null);

  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    setSupported(
      typeof AudioWorkletNode !== 'undefined' &&
        typeof WebSocket !== 'undefined' &&
        Boolean(navigator.mediaDevices?.getUserMedia)
    );
  }, [enabled]);

  const mintToken = React.useCallback(async () => {
    const res = await fetch('/api/transcribe-token', { method: 'POST' });
    if (!res.ok) throw new Error(`token mint failed: ${res.status}`);
    return (await res.json()) as TokenResponse;
  }, []);

  const teardown = React.useCallback(() => {
    const session = sessionRef.current;
    sessionRef.current = null;
    if (timeoutRef.current != null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!session) return;
    session.node.port.onmessage = null;
    session.node.disconnect();
    session.stream.getTracks().forEach(t => t.stop());
    void session.ctx.close().catch(() => {});
    if (
      session.socket.readyState === WebSocket.OPEN ||
      session.socket.readyState === WebSocket.CONNECTING
    ) {
      session.socket.close(1000);
    }
  }, []);

  const settle = React.useCallback(
    (text: string) => {
      teardown();
      setListening(false);
      setPartial('');
      setAmplitudes([]);
      partialRef.current = '';
      finalRef.current = '';
      resolveRef.current?.(text);
      resolveRef.current = null;
    },
    [teardown]
  );

  const start = React.useCallback(async () => {
    if (!supported || sessionRef.current) return;
    cancelledRef.current = false;
    finalRef.current = '';
    partialRef.current = '';
    setListening(true);

    try {
      const auth = tokenRef.current ?? (await mintToken());
      // Single-use secret — never reuse it for a second utterance.
      tokenRef.current = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Asking the context for 16kHz avoids resampling the capture ourselves.
      const ctx = new AudioContext({ sampleRate: CAPTURE_SAMPLE_RATE });
      await ctx.audioWorklet.addModule(captureWorkletUrl());
      const node = new AudioWorkletNode(ctx, CAPTURE_PROCESSOR, {
        processorOptions: { batchSize: 1024 },
      });
      ctx.createMediaStreamSource(stream).connect(node);

      const socket = new WebSocket(auth.url, [
        SUBPROTOCOL,
        `${AUTH_PREFIX}${auth.token}`,
      ]);
      socket.binaryType = 'arraybuffer';

      sessionRef.current = { socket, ctx, stream, node };

      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            type: START_FRAME,
            inputAudioFormat: { type: 'audio/pcm', rate: ctx.sampleRate },
          })
        );
      };

      node.port.onmessage = event => {
        const { pcm, rms } = event.data as { pcm: ArrayBuffer; rms: number };
        setAmplitudes(prev => [...prev, Math.min(1, rms * 3.2)].slice(-AMPLITUDE_WINDOW));
        if (socket.readyState === WebSocket.OPEN) socket.send(pcm);
      };

      socket.onmessage = event => {
        if (typeof event.data !== 'string') return;
        let part: StreamPart;
        try {
          part = JSON.parse(event.data) as StreamPart;
        } catch {
          return;
        }

        switch (part.type) {
          case 'transcript-partial':
            // Non-final and revisable — replace rather than append.
            partialRef.current = (finalRef.current + (part.text ?? '')).trimStart();
            setPartial(partialRef.current);
            break;
          case 'transcript-delta':
            finalRef.current += part.delta ?? '';
            partialRef.current = finalRef.current.trimStart();
            setPartial(partialRef.current);
            break;
          case 'transcript-final':
            finalRef.current += part.text ?? '';
            partialRef.current = finalRef.current.trimStart();
            setPartial(partialRef.current);
            break;
          case 'finish':
            settle(cancelledRef.current ? '' : (part.text || finalRef.current).trim());
            break;
          case 'error':
            settle(cancelledRef.current ? '' : partialRef.current.trim());
            break;
        }
      };

      socket.onerror = () => {
        if (!cancelledRef.current) settle(partialRef.current.trim());
      };
      socket.onclose = () => {
        if (sessionRef.current) settle(cancelledRef.current ? '' : partialRef.current.trim());
      };

      timeoutRef.current = window.setTimeout(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: AUDIO_DONE_FRAME }));
        }
      }, MAX_SECONDS * 1000);
    } catch (error) {
      console.error('[flow] streaming transcription unavailable', error);
      // One failure is enough — stop offering the mic rather than failing repeatedly.
      setSupported(false);
      settle('');
    }
  }, [mintToken, settle, supported]);

  const stop = React.useCallback(() => {
    const session = sessionRef.current;
    if (!session) return Promise.resolve('');
    return new Promise<string>(resolve => {
      resolveRef.current = resolve;
      if (session.socket.readyState === WebSocket.OPEN) {
        // Ask for the final transcript; `finish` settles the promise.
        session.socket.send(JSON.stringify({ type: AUDIO_DONE_FRAME }));
        // Don't hang forever if the server never sends one.
        window.setTimeout(() => {
          if (resolveRef.current) settle(partialRef.current.trim());
        }, 2500);
      } else {
        settle(partialRef.current.trim());
      }
    });
  }, [settle]);

  const cancel = React.useCallback(() => {
    if (!sessionRef.current) return;
    cancelledRef.current = true;
    settle('');
  }, [settle]);

  /** Mint ahead of time so the handshake is warm before the user commits to speaking. */
  const prefetch = React.useCallback(() => {
    if (!supported || tokenRef.current) return;
    void mintToken()
      .then(t => {
        tokenRef.current = t;
      })
      .catch(() => {});
  }, [mintToken, supported]);

  React.useEffect(() => () => teardown(), [teardown]);

  return {
    supported,
    listening,
    partial,
    amplitudes,
    start: () => void start(),
    stop,
    cancel,
    prefetch,
  };
};
