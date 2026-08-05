'use client';

import React from 'react';
import type { Info } from '@jared/info';
import { Canvas } from './Canvas';
import { FlowBar } from './FlowBar';
import { useDictation } from './useDictation';
import type { FlowState, WritingStyle } from './types';
import { cream, ink, inkHairline, inkMuted, radius } from './tokens';

export type { FlowState, WritingStyle, Card, Dictation } from './types';
export { WRITING_STYLES } from './types';

/**
 * The wrapper contract, same as the Windows one: give it an Info, it renders the whole site.
 *
 * Phase 1 wiring — the bar echoes back locally. Phase 2 replaces `ask` with a `useChat`
 * transport against /api/flow; nothing else here has to change.
 */
export const WisprWrapper = ({ info }: { info: Info }) => {
  const [style, setStyle] = React.useState<WritingStyle>('Default');
  const [state, setState] = React.useState<FlowState>('idle');
  const [answer, setAnswer] = React.useState<string | null>(null);
  const [asked, setAsked] = React.useState<string | null>(null);
  const dictation = useDictation();

  const suggestions = React.useMemo(() => {
    const newest = info.projects[0]?.title;
    return [
      'Ask me anything…',
      newest ? `Tell me about ${newest}` : 'Show me your projects',
      "What's your stack?",
      'What do people say about working with you?',
      'How do I reach you?',
    ];
  }, [info.projects]);

  const ask = React.useCallback((question: string) => {
    setAsked(question);
    setAnswer(null);
    setState('processing');
    // Placeholder for the model call — replaced in Phase 2.
    window.setTimeout(() => {
      setAnswer(
        `Heard you: “${question}”. The model isn't wired up yet — that's Phase 2.`
      );
      setState('open');
    }, 650);
  }, []);

  const dismiss = React.useCallback(() => {
    setAsked(null);
    setAnswer(null);
    setState('idle');
  }, []);

  const panel =
    asked == null ? null : (
      <div className='space-y-3'>
        <p className='text-[13px]' style={{ color: inkMuted }}>
          {asked}
        </p>
        {answer ? (
          <p className='text-[15px] leading-relaxed'>{answer}</p>
        ) : (
          <p className='text-[15px]' style={{ color: inkMuted }}>
            Thinking…
          </p>
        )}
      </div>
    );

  return (
    <div
      className='relative h-screen w-screen overflow-hidden'
      style={{ background: cream, color: ink }}
    >
      <Canvas info={info} bio={info.hero.bio} />

      {/* Before the first question, the suggestions double as the site map. */}
      {state === 'idle' && !asked && (
        <div className='pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4 sm:bottom-26'>
          <div className='pointer-events-auto flex max-w-2xl flex-wrap justify-center gap-2'>
            {suggestions.slice(1).map(s => (
              <button
                key={s}
                type='button'
                onClick={() => ask(s)}
                className='cursor-pointer px-3.5 py-1.5 text-[13px] transition-colors hover:bg-[rgba(26,26,26,0.05)]'
                style={{
                  fontFamily: 'var(--font-figtree)',
                  color: inkMuted,
                  border: `1.5px solid ${inkHairline}`,
                  borderRadius: radius.pill,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <FlowBar
        state={state}
        style={style}
        onStyleChange={setStyle}
        onSubmit={ask}
        onDismiss={dismiss}
        dictation={dictation}
        panel={panel}
        suggestions={suggestions}
      />
    </div>
  );
};
