'use client';

import React from 'react';
import type { Info } from '@jared/info';
import { Canvas } from './Canvas';
import { Conversation } from './Conversation';
import { FlowBar } from './FlowBar';
import { useDictation } from './useDictation';
import { useFlow } from './useFlow';
import type { WritingStyle } from './types';
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

  const suggestions = React.useMemo(() => {
    return [
      'Show me your projects',
      "What's your stack?",
      'What do people say about working with you?',
    ];
  }, [info.projects]);

  return (
    <div
      className='fixed inset-0 w-full h-full overflow-hidden'
      style={{ background: cream, color: ink }}
    >
      <Canvas info={info} />

      <FlowBar
        state={flow.state}
        style={style}
        onStyleChange={setStyle}
        onSubmit={flow.ask}
        onDismiss={flow.reset}
        onCollapse={flow.collapse}
        onExpand={flow.expand}
        hasMessages={flow.hasMessages}
        dictation={dictation}
        panelOpen={flow.isPanelOpen}
        suggestions={suggestions}
        panel={
          <Conversation
            messages={flow.transcript}
            pending={flow.pending}
            error={flow.error}
            info={info}
          />
        }
      />
    </div>
  );
};
