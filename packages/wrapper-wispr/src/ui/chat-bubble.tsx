'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { ink, inkHairline, inkMuted, lavender } from '../tokens';
import { MessageLoading } from './message-loading';

/* -------------------------------------------------------------------------- */
/*  ChatBubble — the row: avatar plus message, aligned by who is speaking.     */
/* -------------------------------------------------------------------------- */

const chatBubbleVariants = cva('flex w-max max-w-[88%] items-end gap-2.5', {
  variants: {
    variant: {
      received: 'self-start',
      // Reversed so the avatar slot, when present, sits on the outside edge.
      sent: 'self-end flex-row-reverse',
    },
  },
  defaultVariants: { variant: 'received' },
});

export interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariants> {}

export const ChatBubble = ({
  className,
  variant,
  ...props
}: ChatBubbleProps) => (
  <div className={cn(chatBubbleVariants({ variant }), className)} {...props} />
);

/* -------------------------------------------------------------------------- */
/*  ChatBubbleAvatar                                                          */
/* -------------------------------------------------------------------------- */

export interface ChatBubbleAvatarProps {
  src?: string;
  /** Shown when there is no image — initials, usually. */
  fallback?: string;
  className?: string;
}

export const ChatBubbleAvatar = ({
  src,
  fallback = '',
  className,
}: ChatBubbleAvatarProps) => (
  <div
    aria-hidden='true'
    className={cn(
      'flex h-7 w-7 shrink-0 select-none items-center justify-center overflow-hidden',
      className
    )}
    style={{
      border: `1.5px solid ${inkHairline}`,
      borderRadius: 999,
      fontFamily: 'var(--font-figtree)',
      fontSize: 11,
      color: inkMuted,
    }}
  >
    {src ? (
      <img src={src} alt='' draggable={false} className='h-full w-full object-cover' />
    ) : (
      fallback
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/*  ChatBubbleMessage — the bubble itself.                                     */
/* -------------------------------------------------------------------------- */

const messageVariants = cva('text-[15px] leading-relaxed', {
  variants: {
    variant: {
      received: 'px-4 py-2.5',
      sent: 'px-4 py-2.5',
    },
  },
  defaultVariants: { variant: 'received' },
});

// Colour and border live here rather than in the cva class list because the palette is a
// set of JS tokens, not Tailwind theme colours — same approach as the rest of the package.
const surfaces = {
  received: {
    background: 'rgba(26, 26, 26, 0.035)',
    border: `1.5px solid ${inkHairline}`,
    // Tightened bottom-left corner points the bubble at its avatar.
    borderRadius: '20px 20px 20px 6px',
  },
  sent: {
    background: lavender,
    border: `1.5px solid ${ink}`,
    borderRadius: '20px 20px 6px 20px',
  },
} as const;

export interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  isLoading?: boolean;
}

export const ChatBubbleMessage = ({
  className,
  variant,
  isLoading = false,
  children,
  ...props
}: ChatBubbleMessageProps) => (
  <div
    className={cn(messageVariants({ variant }), className)}
    style={{
      ...surfaces[variant ?? 'received'],
      fontFamily: 'var(--font-figtree)',
      color: ink,
      // Answers arrive as plain text, so newlines are the only structure there is.
      whiteSpace: 'pre-wrap',
    }}
    {...props}
  >
    {isLoading ? (
      <span className='flex items-center' style={{ color: inkMuted }}>
        <MessageLoading />
      </span>
    ) : (
      children
    )}
  </div>
);
