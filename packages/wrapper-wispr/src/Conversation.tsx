'use client';

import React from 'react';
import type { Info } from '@jared/info';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from './ui/chat-bubble';
import { ChatMessageList } from './ui/chat-message-list';
import type { ChatMessage } from './types';

import { inkMuted } from './tokens';

export interface ConversationProps {
  messages: ChatMessage[];
  /** Waiting on the first token — renders the typing indicator. */
  pending: boolean;
  error?: Error;
  info: Info;
  /** Clear conversation history. */
  onClear?: () => void;
}

/** The transcript inside the notch: bubbles, an indicator, and nothing else. */
export const Conversation = ({
  messages,
  pending,
  error,
  info,
  onClear,
}: ConversationProps) => (
  <div className='flex flex-col'>
    {onClear && (
      <div className='flex items-center justify-between px-5 pt-3 text-[12px]' style={{ color: inkMuted }}>
        <span className='font-medium'>Conversation</span>
        <button
          type='button'
          onClick={onClear}
          className='cursor-pointer text-[12px] hover:underline'
          style={{ color: inkMuted }}
        >
          Clear chat
        </button>
      </div>
    )}
    <ChatMessageList className='max-h-[min(58vh,440px)]'>
    {messages.map(message => {
      const sent = message.role === 'user';
      return (
        <ChatBubble key={message.id} variant={sent ? 'sent' : 'received'}>
          {/* Only the answering side gets a face — a second avatar just adds noise. */}
          {!sent && <ChatBubbleAvatar src={info.profile.avatar} />}
          <ChatBubbleMessage variant={sent ? 'sent' : 'received'}>
            {message.text}
          </ChatBubbleMessage>
        </ChatBubble>
      );
    })}

    {pending && !error && (
      <ChatBubble variant='received'>
        <ChatBubbleAvatar src={info.profile.avatar} />
        <ChatBubbleMessage variant='received' isLoading />
      </ChatBubble>
    )}

    {error && (
      <ChatBubble variant='received'>
        <ChatBubbleAvatar src={info.profile.avatar} />
        <ChatBubbleMessage variant='received'>
          Something went wrong reaching the model. Email{' '}
          <a
            href={`mailto:${info.profile.email}`}
            className='underline underline-offset-4'
          >
            {info.profile.email}
          </a>{' '}
          and Jared will answer himself.
        </ChatBubbleMessage>
      </ChatBubble>
    )}
  </ChatMessageList>
</div>
);
