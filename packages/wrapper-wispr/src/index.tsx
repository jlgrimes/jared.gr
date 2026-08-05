'use client';

import React from 'react';
import type { Info } from '@jared/info';
import { Canvas } from './Canvas';
import { Conversation } from './Conversation';
import { FlowBar } from './FlowBar';
import { useDictation } from './useDictation';
import { useFlow } from './useFlow';
import { BIO_STYLE_KEY, type WritingStyle } from './types';
import { cream, ink, inkHairline, inkMuted, radius } from './tokens';

export type { FlowState, WritingStyle, ChatMessage, Dictation } from './types';
export { WRITING_STYLES } from './types';
export { Conversation } from './Conversation';
export {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from './ui/chat-bubble';
export { ChatMessageList } from './ui/chat-message-list';
export { MessageLoading } from './ui/message-loading';

/** The wrapper contract, same as the Windows one: give it an Info, it renders the whole site. */
export const WisprWrapper = ({ info }: { info: Info }) => {
  const [style, setStyle] = React.useState<WritingStyle>('Default');
  const dictation = useDictation();
  const flow = useFlow(style);

  // Pre-authored, so switching voice is instant and costs nothing — and the words stay
  // Jared's rather than the model's. The same style also steers the answers.
  const bio = React.useMemo(() => {
    const key = BIO_STYLE_KEY[style];
    return (key && info.hero.bioVariants?.[key]) || info.hero.bio;
  }, [info.hero, style]);

  const suggestions = React.useMemo(() => {
    const newest = info.projects[0]?.title;
    return [
      newest ? `Tell me about ${newest}` : 'Show me your projects',
      "What's your stack?",
      'What do people say about working with you?',
      'How do I reach you?',
    ];
  }, [info.projects]);

  return (
    <div
      className='relative h-screen w-screen overflow-hidden'
      style={{ background: cream, color: ink }}
    >
      <Canvas info={info} bio={bio} />

      {/* Before the first question the suggestions double as the site map. */}
      {!flow.hasPanel && (
        <div className='pointer-events-none fixed inset-x-0 bottom-24 z-40 flex justify-center px-4'>
          <div className='pointer-events-auto flex max-w-2xl flex-wrap justify-center gap-2'>
            {suggestions.map(s => (
              <button
                key={s}
                type='button'
                onClick={() => flow.ask(s)}
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
        state={flow.state}
        style={style}
        onStyleChange={setStyle}
        onSubmit={flow.ask}
        onDismiss={flow.reset}
        dictation={dictation}
        panel={
          flow.hasPanel ? (
            <Conversation
              messages={flow.transcript}
              pending={flow.pending}
              error={flow.error}
              info={info}
            />
          ) : null
        }
        suggestions={['Ask me anything…', ...suggestions]}
      />
    </div>
  );
};
