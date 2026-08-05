'use client';

import React from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import type { ChatMessage, FlowState, WritingStyle } from './types';

/** Answers are prose, so a message flattens to the concatenation of its text parts. */
const textOf = (message: UIMessage) =>
  (message.parts ?? [])
    .map(part => (part.type === 'text' ? part.text : ''))
    .join('');

/** Owns the conversation with /api/flow and hands the notch a transcript to render. */
export const useFlow = (style: WritingStyle) => {
  const { messages, sendMessage, status, setMessages, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/flow' }),
  });

  const ask = React.useCallback(
    (question: string) => {
      // Style rides along per-message rather than being baked into the transport, so
      // switching styles mid-conversation takes effect on the very next question.
      void sendMessage({ text: question }, { body: { style } });
    },
    [sendMessage, style]
  );

  const reset = React.useCallback(() => {
    stop();
    setMessages([]);
  }, [setMessages, stop]);

  const transcript = React.useMemo<ChatMessage[]>(
    () =>
      messages
        .flatMap(message => {
          if (message.role !== 'user' && message.role !== 'assistant') return [];
          const text = textOf(message);
          // An assistant message exists from the moment the stream opens, before any token
          // has landed. Dropping it here keeps an empty bubble from sitting next to the
          // typing indicator.
          if (message.role === 'assistant' && !text) return [];
          return [{ id: message.id, role: message.role, text }];
        }),
    [messages]
  );

  const last = transcript[transcript.length - 1];

  const state: FlowState =
    status === 'submitted'
      ? 'processing'
      : status === 'streaming'
        ? 'answering'
        : messages.length > 0
          ? 'open'
          : 'idle';

  return {
    state,
    transcript,
    /** Request is in flight and the answer hasn't started arriving — show the indicator. */
    pending:
      (status === 'submitted' || status === 'streaming') && last?.role !== 'assistant',
    /** True once the notch has a conversation worth expanding for. */
    hasPanel: messages.length > 0,
    error,
    ask,
    reset,
  };
};
