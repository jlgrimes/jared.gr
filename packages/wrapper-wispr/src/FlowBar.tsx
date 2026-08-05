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
  onCollapse?: () => void;
  onExpand?: () => void;
  hasMessages?: boolean;
  dictation: Dictation;
  /** The transcript, once there is one. Absent collapses the notch back to a bare pill. */
  panel?: React.ReactNode;
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
  onCollapse,
  onExpand,
  hasMessages = false,
  dictation,
  panel,
}: FlowBarProps) => {
  const [text, setText] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Whether the mic is open is the dictation hook's truth, not the conversation's — the
  // chat only knows about idle/processing/answering/open.
  const listening = dictation.listening;
  const busy = state === 'processing' || state === 'answering';
  const panelOpen = Boolean(panel);

  // Collapse when clicking outside the FlowBar component
  React.useEffect(() => {
    if (!panelOpen || !onCollapse) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (containerRef.current?.contains(target)) return;
      if (target.closest('[role="listbox"]')) return;

      onCollapse();
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [panelOpen, onCollapse]);

  const submit = React.useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed || busy) return;
      setText('');
      onSubmit(trimmed);
    },
    [busy, onSubmit]
  );

  const prefixRef = React.useRef('');
  const suffixRef = React.useRef('');

  const startDictation = React.useCallback(() => {
    if (!dictation.supported || dictation.listening || busy) return;
    const input = inputRef.current;
    if (input && typeof input.selectionStart === 'number' && typeof input.selectionEnd === 'number') {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      prefixRef.current = text.slice(0, start);
      suffixRef.current = text.slice(end);
    } else {
      prefixRef.current = text;
      suffixRef.current = '';
    }
    input?.focus();
    dictation.start();
  }, [busy, dictation, text]);

  // Dynamic sync: stream partial speech directly into selection position in text input field while preserving focus & cursor
  React.useEffect(() => {
    if (dictation.listening) {
      const prefix = prefixRef.current;
      const suffix = suffixRef.current;
      const partial = dictation.partial;
      const needsLeadingSpace = prefix && partial && !prefix.endsWith(' ');
      const needsTrailingSpace = suffix && partial && !partial.endsWith(' ') && !suffix.startsWith(' ');
      const combined = `${prefix}${needsLeadingSpace ? ' ' : ''}${partial}${needsTrailingSpace ? ' ' : ''}${suffix}`;
      const cursorPos = prefix.length + (needsLeadingSpace ? 1 : 0) + partial.length;

      setText(combined);
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(cursorPos, cursorPos);
        }
      });
    }
  }, [dictation.listening, dictation.partial]);

  const cancelDictation = React.useCallback(() => {
    dictation.cancel();
    const originalText = `${prefixRef.current}${suffixRef.current}`;
    const cursorPos = prefixRef.current.length;
    prefixRef.current = '';
    suffixRef.current = '';
    setText(originalText);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(cursorPos, cursorPos);
      }
    });
  }, [dictation]);

  const finishDictation = React.useCallback(async () => {
    if (!dictation.listening) return;
    const transcript = await dictation.stop();
    const prefix = prefixRef.current;
    const suffix = suffixRef.current;
    prefixRef.current = '';
    suffixRef.current = '';
    const inserted = transcript.trim();
    const needsLeadingSpace = prefix && inserted && !prefix.endsWith(' ');
    const needsTrailingSpace = suffix && inserted && !inserted.endsWith(' ') && !suffix.startsWith(' ');
    const finalString = `${prefix}${needsLeadingSpace ? ' ' : ''}${inserted}${needsTrailingSpace ? ' ' : ''}${suffix}`;
    const finalCursorPos = prefix.length + (needsLeadingSpace ? 1 : 0) + inserted.length;

    // Place transcribed text in input field without auto-submitting, maintaining focus & cursor
    setText(finalString);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(finalCursorPos, finalCursorPos);
      }
    });
  }, [dictation]);

  // ⌘K / `/` to focus, Esc to back out, Space to toggle dictation
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }
      if (e.key === 'Escape') {
        if (dictation.listening) cancelDictation();
        else if (panelOpen) (onCollapse ?? onDismiss)();
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
      if (e.code === 'Space' && !e.repeat && !isTypingTarget(e.target)) {
        e.preventDefault();
        if (dictation.listening) {
          void finishDictation();
        } else {
          startDictation();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [cancelDictation, dictation.listening, finishDictation, onCollapse, onDismiss, panelOpen, startDictation]);

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6 sm:pb-8'>
      <motion.div
        ref={containerRef}
        layout
        transition={notchSpring}
        animate={{ borderRadius: radius.panel }}
        className='pointer-events-auto w-full max-w-2xl overflow-hidden'
        style={{
          background: cream,
          border: `2px solid ${ink}`,
          boxShadow: lift,
        }}
      >
        {/* Panel — grows upward out of the notch. */}
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
              {/* The transcript caps its own height; the notch just grows to fit it. */}
              <div style={{ fontFamily: 'var(--font-figtree)', color: ink }}>
                {panel}
              </div>
              <div className='mx-5 sm:mx-6' style={{ borderTop: `1.5px solid ${inkHairline}` }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Row 1: Text Input Area */}
        <div className='px-4 pt-3.5 pb-1 sm:px-5 sm:pt-4'>
          <form
            onSubmit={e => {
              e.preventDefault();
              if (listening) {
                void finishDictation();
              } else {
                submit(text);
              }
            }}
          >
            <input
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onFocus={() => {
                if (hasMessages && !panelOpen) onExpand?.();
              }}
              onClick={() => {
                if (hasMessages && !panelOpen) onExpand?.();
              }}
              disabled={busy}
              maxLength={400}
              aria-label='Ask about Jared'
              placeholder='Ask me anything…'
              className='w-full bg-transparent text-[15px] outline-none placeholder:transition-opacity disabled:opacity-60'
              style={{ fontFamily: 'var(--font-figtree)', color: ink }}
            />
          </form>
        </div>

        {/* Card Row 2: Action Toolbar (Left: StylePill; Right: Waveform, Mic & Send buttons) */}
        <div className='flex items-center justify-between gap-3 px-3 pb-3 pt-1.5 sm:px-4 sm:pb-3.5'>
          {/* Left Controls */}
          <div className='flex items-center gap-2 overflow-x-auto min-w-0'>
            <StylePill value={style} onChange={onStyleChange} />
          </div>

          {/* Right Controls */}
          <div className='flex items-center gap-2.5 shrink-0'>
            {busy ? (
              <Shimmer />
            ) : (
              <>
                {listening && (
                  <div className='flex items-center gap-2 max-w-[120px] sm:max-w-[180px] px-1'>
                    <Waveform amplitudes={dictation.amplitudes} active />
                  </div>
                )}

                <MicButton
                  supported={dictation.supported}
                  listening={listening}
                  disabled={busy}
                  onClick={() => {
                    if (listening) {
                      void finishDictation();
                    } else {
                      startDictation();
                    }
                  }}
                  onWarm={dictation.prefetch}
                />

                <SendButton
                  disabled={busy || (!text.trim() && !listening)}
                  onClick={() => {
                    if (listening) {
                      void finishDictation();
                    } else {
                      submit(text);
                    }
                  }}
                />
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SendButton = ({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) => (
  <button
    type='button'
    disabled={disabled}
    onClick={onClick}
    aria-label='Send message'
    className='flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors disabled:cursor-default disabled:opacity-30'
    style={{
      background: ink,
      color: cream,
    }}
  >
    <svg width='14' height='14' viewBox='0 0 16 16' fill='none' aria-hidden='true'>
      <path
        d='M8 13V3M8 3L3 8M8 3L13 8'
        stroke={cream}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  </button>
);

const MicButton = ({
  supported,
  listening,
  disabled,
  onClick,
  onWarm,
}: {
  supported: boolean;
  listening: boolean;
  disabled: boolean;
  onClick: () => void;
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
      onClick={onClick}
      aria-label={listening ? 'Stop recording' : 'Start recording'}
      className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center transition-colors disabled:cursor-default disabled:opacity-40'
      style={{
        background: listening ? ember : 'transparent',
        border: `1.5px solid ${listening ? ink : inkHairline}`,
        borderRadius: radius.pill,
      }}
    >
      {listening ? (
        <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden='true'>
          <rect width='12' height='12' rx='2.5' fill={ink} />
        </svg>
      ) : (
        <svg width='14' height='18' viewBox='0 0 14 18' fill='none' aria-hidden='true'>
          <rect x='4.25' y='0.75' width='5.5' height='9.5' rx='2.75' stroke={ink} strokeWidth='1.5' />
          <path
            d='M1.25 8.25v.75a5.75 5.75 0 0 0 11.5 0v-.75M7 14.75v2.5'
            stroke={ink}
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      )}
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
