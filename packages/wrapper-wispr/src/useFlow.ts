'use client';

import React from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import type { Card, FlowState, WritingStyle } from './types';

/** Tool name → card, so a streamed tool call becomes a panel with no extra protocol. */
const toCard = (name: string, input: unknown): Card | null => {
  const arg = (input ?? {}) as Record<string, unknown>;
  switch (name) {
    case 'show_projects':
      return {
        kind: 'projects',
        stack: typeof arg.stack === 'string' ? arg.stack : undefined,
      };
    case 'show_project':
      return typeof arg.title === 'string' ? { kind: 'project', title: arg.title } : null;
    case 'show_testimonials':
      return { kind: 'testimonials' };
    case 'show_skills':
      return { kind: 'skills' };
    case 'show_contact':
      return { kind: 'contact' };
    default:
      return null;
  }
};

const readMessage = (message: UIMessage | undefined) => {
  if (!message) return { text: '', cards: [] as Card[] };

  let text = '';
  const cards: Card[] = [];

  for (const part of message.parts ?? []) {
    if (part.type === 'text') {
      text += part.text;
      continue;
    }
    if (!part.type.startsWith('tool-')) continue;

    // `input-streaming` inputs are still partial JSON — waiting for `input-available`
    // means a card mounts once, fully formed, instead of flickering through half-parsed
    // arguments.
    const toolPart = part as { type: string; state?: string; input?: unknown };
    if (toolPart.state === 'input-streaming') continue;

    const card = toCard(part.type.slice('tool-'.length), toolPart.input);
    if (card) cards.push(card);
  }

  return { text, cards };
};

/**
 * Owns the conversation with /api/flow and reduces it down to what the notch renders:
 * a question, some prose, and zero or more cards.
 */
export const useFlow = (style: WritingStyle) => {
  const { messages, sendMessage, status, setMessages, error, stop } = useChat({
    transport: new DefaultChatTransport({ api: '/api/flow' }),
  });

  // Chip clicks swap the panel locally — instant, free, and no model round-trip. Cleared as
  // soon as a new question arrives so the model's answer takes over again.
  const [pinnedCard, setPinnedCard] = React.useState<Card | null>(null);

  const ask = React.useCallback(
    (question: string) => {
      setPinnedCard(null);
      // Style rides along per-message rather than being baked into the transport, so
      // switching styles mid-conversation takes effect on the very next question.
      void sendMessage({ text: question }, { body: { style } });
    },
    [sendMessage, style]
  );

  const show = React.useCallback((card: Card) => setPinnedCard(card), []);

  const reset = React.useCallback(() => {
    stop();
    setMessages([]);
    setPinnedCard(null);
  }, [setMessages, stop]);

  const lastUser = React.useMemo(
    () => [...messages].reverse().find(m => m.role === 'user'),
    [messages]
  );
  const lastAssistant = React.useMemo(
    () => [...messages].reverse().find(m => m.role === 'assistant'),
    [messages]
  );

  const question = React.useMemo(() => {
    const part = lastUser?.parts?.find(p => p.type === 'text');
    return part && part.type === 'text' ? part.text : '';
  }, [lastUser]);

  const { text, cards } = React.useMemo(
    () => readMessage(lastAssistant),
    [lastAssistant]
  );

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
    question,
    text,
    cards: pinnedCard ? [pinnedCard] : cards,
    /** True once the panel has anything worth showing. */
    hasPanel: messages.length > 0 || pinnedCard != null,
    error,
    ask,
    show,
    reset,
  };
};
