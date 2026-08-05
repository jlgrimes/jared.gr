'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { StylePill } from './StylePill';
import { Waveform } from './Waveform';
import type { Dictation, FlowState, WritingStyle } from './types';
import {
  cream,
  ember,
  ink,
  inkHairline,
  inkMuted,
  lavender,
  lift,
  notchSpring,
  radius,
} from './tokens';

export interface FlowBarProps {
  state: FlowState;
  style: WritingStyle;
  onStyleChange: (style: WritingStyle) => void;
  /** Fired on Enter, on Done, or when dictation settles with text. */
  onSubmit: (text: string) => void;
  /** Collapse the panel back to a bare pill. */
  onDismiss: () => void;
  dictation: Dictation;
  /** Whatever the notch is currently holding — answer prose, cards, suggestions. */
  panel?: React.ReactNode;
  /** Shown as the cycling placeholder, and as chips before the first question. */
  suggestions?: string[];
}

const isTypingTarget = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.isContentEditable);

export const FlowBar = ({
  state,
  style,
  onStyleChange,
  onSubmit,
  onDismiss,
  dictation,
  panel,
  suggestions = [],
}: FlowBarProps) => {
  const [text, setText] = React.useState('');
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Whether the mic is open is the dictation hook's truth, not the conversation's — the
  // chat only knows about idle/processing/answering/open.
  const listening = dictation.listening;
  const busy = state === 'processing' || state === 'answering';
  const panelOpen = Boolean(panel);

  // Cycle the placeholder only while idle and empty — movement anywhere else is noise.
  React.useEffect(() => {
    if (suggestions.length === 0 || state !== 'idle' || text) return;
    const id = window.setInterval(
      () => setPlaceholderIndex(i => (i + 1) % suggestions.length),
      3800
    );
    return () => window.clearInterval(id);
  }, [suggestions.length, state, text]);

  const submit = React.useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || busy) return;
      setText('');
      onSubmit(trimmed);
    },
    [busy, onSubmit]
  );

  const startDictation = React.useCallback(() => {
    if (!dictation.supported || dictation.listening || busy) return;
    dictation.start();
  }, [busy, dictation]);

  const finishDictation = React.useCallback(async () => {
    if (!dictation.listening) return;
    const transcript = await dictation.stop();
    if (transcript.trim()) submit(transcript);
  }, [dictation, submit]);

  // ⌘K / `/` to focus, Esc to back out, hold Space to dictate — the web analog of holding Fn.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      if (e.key === 'Escape') {
        if (dictation.listening) dictation.cancel();
        else if (panelOpen) onDismiss();
        inputRef.current?.blur();
        return;
      }
      if (isTypingTarget(e.target)) return;

      if (e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      // `repeat` guards against key-repeat restarting the recognizer every few ms.
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        startDictation();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && dictation.listening && !isTypingTarget(e.target)) {
        e.preventDefault();
        void finishDictation();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [dictation, finishDictation, onDismiss, panelOpen, startDictation]);

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 sm:pb-8'>
      <motion.div
        layout
        transition={notchSpring}
        animate={{ borderRadius: panelOpen ? radius.panel : radius.pill }}
        className='pointer-events-auto w-full max-w-2xl overflow-hidden'
        style={{
          background: cream,
          border: `2px solid ${ink}`,
          boxShadow: lift,
        }}
      >
        {/* Panel — grows upward out of the pill. Same element, so it reads as a notch. */}
        <AnimatePresence initial={false} mode='wait'>
          {panelOpen && (
            <motion.div
              key='panel'
              layout
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={notchSpring}
              className='overflow-hidden'
            >
              <div
                className='max-h-[58vh] overflow-y-auto px-5 pt-5 pb-4 sm:px-6'
                style={{ fontFamily: 'var(--font-figtree)', color: ink }}
              >
                {panel}
              </div>
              <div className='mx-5 sm:mx-6' style={{ borderTop: `1.5px solid ${inkHairline}` }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* The pill row — always present, always the same height. */}
        <motion.div layout className='flex h-14 items-center gap-3 px-3 sm:px-4'>
          <MicButton
            supported={dictation.supported}
            listening={listening}
            disabled={busy}
            onPointerDown={startDictation}
            onPointerUp={() => void finishDictation()}
            onWarm={dictation.prefetch}
          />

          {listening ? (
            <>
              {dictation.partial ? (
                <span
                  className='flex-1 truncate text-[15px]'
                  style={{ fontFamily: 'var(--font-figtree)', color: ink }}
                >
                  {dictation.partial}
                </span>
              ) : (
                <Waveform amplitudes={dictation.amplitudes} active />
              )}
              <button
                type='button'
                onClick={() => dictation.cancel()}
                className='shrink-0 cursor-pointer px-2 text-[13px]'
                style={{ fontFamily: 'var(--font-figtree)', color: inkMuted }}
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={() => void finishDictation()}
                className='shrink-0 cursor-pointer px-3 py-1.5 text-[13px]'
                style={{
                  fontFamily: 'var(--font-figtree)',
                  color: ink,
                  background: lavender,
                  border: `1.5px solid ${ink}`,
                  borderRadius: radius.pill,
                }}
              >
                Done
              </button>
            </>
          ) : (
            <>
              <form
                className='flex-1'
                onSubmit={e => {
                  e.preventDefault();
                  submit(text);
                }}
              >
                <input
                  ref={inputRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  disabled={busy}
                  maxLength={400}
                  aria-label='Ask about Jared'
                  placeholder={
                    busy
                      ? 'Thinking…'
                      : (suggestions[placeholderIndex] ?? 'Ask me anything…')
                  }
                  className='w-full bg-transparent text-[15px] outline-none placeholder:transition-opacity disabled:opacity-60'
                  style={{ fontFamily: 'var(--font-figtree)', color: ink }}
                />
              </form>

              {busy ? (
                <Shimmer />
              ) : (
                <>
                  {panelOpen && (
                    <button
                      type='button'
                      onClick={onDismiss}
                      aria-label='Close panel'
                      className='shrink-0 cursor-pointer px-2 text-[13px]'
                      style={{ fontFamily: 'var(--font-figtree)', color: inkMuted }}
                    >
                      Esc
                    </button>
                  )}
                  <StylePill value={style} onChange={onStyleChange} />
                </>
              )}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const MicButton = ({
  supported,
  listening,
  disabled,
  onPointerDown,
  onPointerUp,
  onWarm,
}: {
  supported: boolean;
  listening: boolean;
  disabled: boolean;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onWarm?: () => void;
}) => {
  // No graceful degradation to show — if the browser can't dictate, the input is the whole UI.
  if (!supported) return null;

  return (
    <button
      type='button'
      disabled={disabled}
      // Warm the token on approach, so pressing the mic doesn't wait on a round-trip.
      onPointerEnter={() => !disabled && onWarm?.()}
      onFocus={() => !disabled && onWarm?.()}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={() => listening && onPointerUp()}
      aria-label={listening ? 'Stop dictating' : 'Hold to dictate'}
      className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center transition-colors disabled:cursor-default disabled:opacity-40'
      style={{
        background: listening ? ember : 'transparent',
        border: `1.5px solid ${listening ? ink : inkHairline}`,
        borderRadius: radius.pill,
      }}
    >
      <svg width='14' height='18' viewBox='0 0 14 18' fill='none' aria-hidden='true'>
        <rect x='4.25' y='0.75' width='5.5' height='9.5' rx='2.75' stroke={ink} strokeWidth='1.5' />
        <path
          d='M1.25 8.25v.75a5.75 5.75 0 0 0 11.5 0v-.75M7 14.75v2.5'
          stroke={ink}
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </svg>
    </button>
  );
};

/** Processing state: an ember pulse where the style pill sits, so nothing jumps. */
const Shimmer = () => (
  <div className='flex shrink-0 items-center gap-1 px-3' aria-label='Thinking' role='status'>
    {[0, 1, 2].map(i => (
      <motion.span
        key={i}
        className='h-1.5 w-1.5 rounded-full'
        style={{ background: ember }}
        animate={{ opacity: [0.25, 1, 0.25] }}
        transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }}
      />
    ))}
  </div>
);
