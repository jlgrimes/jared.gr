'use client';

import React from 'react';
import { cn } from '../lib/utils';
import { cream, ink, inkHairline } from '../tokens';
import { useAutoScroll } from './use-auto-scroll';

export type ChatMessageListProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * The scroll container for a transcript. Sticks to the newest message while the answer
 * streams, and surfaces a jump-to-bottom affordance once the visitor scrolls away from it.
 */
export const ChatMessageList = ({
  className,
  children,
  ...props
}: ChatMessageListProps) => {
  const { ref, isAtBottom, scrollToBottom, handleScroll } =
    useAutoScroll<HTMLDivElement>();

  return (
    <div className='relative'>
      {/* No height of its own — the caller caps it with a max-height and the list grows
          into that, so a two-line exchange doesn't open a half-empty panel. */}
      <div
        ref={ref}
        onScroll={handleScroll}
        className={cn(
          'flex flex-col gap-4 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6',
          className
        )}
        {...props}
      >
        {children}
      </div>

      {/* Softens the cut where the transcript meets the top of the notch. */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-6'
        style={{ background: `linear-gradient(to bottom, ${cream}, transparent)` }}
      />

      {!isAtBottom && (
        <button
          type='button'
          onClick={() => scrollToBottom()}
          aria-label='Jump to latest'
          className='absolute bottom-3 left-1/2 flex h-8 w-8 -translate-x-1/2 cursor-pointer items-center justify-center transition-colors hover:bg-[rgba(26,26,26,0.06)]'
          style={{
            background: cream,
            border: `1.5px solid ${inkHairline}`,
            borderRadius: 999,
          }}
        >
          <svg width='14' height='14' viewBox='0 0 14 14' fill='none' aria-hidden='true'>
            <path
              d='M3 5.5 7 9.5l4-4'
              stroke={ink}
              strokeWidth='1.6'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      )}
    </div>
  );
};
