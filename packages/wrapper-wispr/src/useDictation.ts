'use client';

import React from 'react';
import type { Dictation } from './types';

// The Web Speech API isn't in TS's DOM lib. Only the surface we actually touch is declared.
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  readonly length: number;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionResultListLike {
  readonly length: number;
  [index: number]: SpeechRecognitionResultLike;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const getRecognitionCtor = (): SpeechRecognitionCtor | undefined => {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

const MAX_SECONDS = 30; // a stuck recognizer shouldn't hold the mic open forever
const AMPLITUDE_WINDOW = 64;

/**
 * Dictation backed by the browser's own streaming recognizer.
 *
 * This is the default adapter: on-device, free, and the interim results arrive fast enough
 * to feel like Wispr. The waveform is driven by a real AnalyserNode when the mic is
 * available, and degrades to a synthesized pulse if it isn't — a flat bar would read as
 * broken rather than quiet.
 *
 * The Gateway streaming-transcription adapter implements the same `Dictation` interface and
 * can replace this wholesale; the Flow Bar can't tell them apart.
 */
export const useDictation = (): Dictation => {
  const [supported, setSupported] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [partial, setPartial] = React.useState('');
  const [amplitudes, setAmplitudes] = React.useState<number[]>([]);

  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null);
  const finalRef = React.useRef('');
  const partialRef = React.useRef('');
  const resolveRef = React.useRef<((text: string) => void) | null>(null);
  const cancelledRef = React.useRef(false);
  const timeoutRef = React.useRef<number | null>(null);

  const audioRef = React.useRef<{
    ctx: AudioContext;
    stream: MediaStream;
    raf: number;
  } | null>(null);

  // Detect after mount so SSR and the first client render agree.
  React.useEffect(() => {
    setSupported(getRecognitionCtor() != null);
  }, []);

  const teardownAudio = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audioRef.current = null;
    cancelAnimationFrame(audio.raf);
    audio.stream.getTracks().forEach(t => t.stop());
    void audio.ctx.close().catch(() => {});
  }, []);

  const startAudioMeter = React.useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);

      const buffer = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(buffer);
        // RMS around the 128 midpoint, scaled so normal speech lands near the top.
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          const v = (buffer[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buffer.length);
        setAmplitudes(prev =>
          [...prev, Math.min(1, rms * 3.2)].slice(-AMPLITUDE_WINDOW)
        );
        const raf = requestAnimationFrame(tick);
        if (audioRef.current) audioRef.current.raf = raf;
      };

      audioRef.current = { ctx, stream, raf: requestAnimationFrame(tick) };
    } catch {
      // Mic metering denied or unavailable — synthesize motion so the bar still reads as live.
      let t = 0;
      const tick = () => {
        t += 0.18;
        const pulse = (Math.sin(t) * 0.5 + 0.5) * 0.55 + Math.random() * 0.2;
        setAmplitudes(prev => [...prev, pulse].slice(-AMPLITUDE_WINDOW));
        const raf = requestAnimationFrame(tick);
        if (audioRef.current) audioRef.current.raf = raf;
      };
      audioRef.current = {
        ctx: null as unknown as AudioContext,
        stream: { getTracks: () => [] } as unknown as MediaStream,
        raf: requestAnimationFrame(tick),
      };
    }
  }, []);

  /** Single exit path for the recognizer, so start/stop/cancel can't leave it half-torn-down. */
  const settle = React.useCallback(
    (text: string) => {
      if (timeoutRef.current != null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      teardownAudio();
      recognitionRef.current = null;
      setListening(false);
      setPartial('');
      setAmplitudes([]);
      partialRef.current = '';
      finalRef.current = '';
      resolveRef.current?.(text);
      resolveRef.current = null;
    },
    [teardownAudio]
  );

  const start = React.useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor || recognitionRef.current) return;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    cancelledRef.current = false;
    finalRef.current = '';
    partialRef.current = '';

    recognition.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const transcript = result[0]?.transcript ?? '';
        if (result.isFinal) finalRef.current += transcript;
        else interim += transcript;
      }
      const combined = (finalRef.current + interim).trimStart();
      partialRef.current = combined;
      setPartial(combined);
    };

    recognition.onerror = () => {
      // `no-speech` and `aborted` are routine; treat every error as "nothing heard".
      if (!cancelledRef.current) settle(partialRef.current.trim());
    };

    recognition.onend = () => {
      if (cancelledRef.current) settle('');
      else settle(partialRef.current.trim());
    };

    recognitionRef.current = recognition;
    setListening(true);
    void startAudioMeter();

    try {
      recognition.start();
    } catch {
      settle('');
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      recognitionRef.current?.stop();
    }, MAX_SECONDS * 1000);
  }, [settle, startAudioMeter]);

  const stop = React.useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return Promise.resolve('');
    // `onend` fires asynchronously — hand the caller a promise it settles.
    return new Promise<string>(resolve => {
      resolveRef.current = resolve;
      recognition.stop();
    });
  }, []);

  const cancel = React.useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    cancelledRef.current = true;
    recognition.abort();
  }, []);

  React.useEffect(() => () => teardownAudio(), [teardownAudio]);

  return { supported, listening, partial, amplitudes, start, stop, cancel };
};
