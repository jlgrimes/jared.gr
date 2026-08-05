'use client';

import React from 'react';
import type { Info } from '@jared/info';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from './ui/chat-bubble';
import { ChatMessageList } from './ui/chat-message-list';
import type { ChatMessage } from './types';

export interface ConversationProps {
  messages: ChatMessage[];
  /** Waiting on the first token — renders the typing indicator. */
  pending: boolean;
  error?: Error;
  info: Info;
}

/** The transcript inside the notch: bubbles, an indicator, and nothing else. */
export const Conversation = ({
  messages,
  pending,
  error,
  info,
}: ConversationProps) => (
  <ChatMessageList className='max-h-[min(58vh,440px)]'>
    {messages.map(message => {
      const sent = message.role === 'user';
      return (
        <ChatBubble key={message.id} variant={sent ? 'sent' : 'received'}>
          {/* Only the answering side gets a face — a second avatar just adds noise. */}
          {/* jared here - neither of them get a face! */}
          {/* {!sent && <ChatBubbleAvatar src={info.profile.avatar} />} */}
          <ChatBubbleMessage variant={sent ? 'sent' : 'received'}>
            {message.text}
          </ChatBubbleMessage>
        </ChatBubble>
      );
    })}

    {pending && !error && (
      <ChatBubble variant='received'>
        {/* <ChatBubbleAvatar src={info.profile.avatar} /> */}
        <ChatBubbleMessage variant='received' isLoading />
      </ChatBubble>
    )}

    {error && (
      <ChatBubble variant='received'>
        {/* <ChatBubbleAvatar src={info.profile.avatar} /> */}
        <ChatBubbleMessage variant='received'>
          You've maxed out on tokens! Or, something.
        </ChatBubbleMessage>
      </ChatBubble>
    )}
  </ChatMessageList>
);
