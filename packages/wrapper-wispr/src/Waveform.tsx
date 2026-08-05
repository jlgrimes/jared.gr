'use client';

import React from 'react';
import { ember, ink } from './tokens';

const BAR_COUNT = 28;

/**
 * The recording waveform. Newest amplitude is on the right, so the bars read as a tape
 * scrolling past — the same direction Wispr's does.
 */
export const Waveform = ({
  amplitudes,
  active,
}: {
  amplitudes: number[];
  active: boolean;
}) => {
  // Right-align a fixed number of bars so the strip doesn't grow as audio accumulates.
  const bars = React.useMemo(() => {
    const tail = amplitudes.slice(-BAR_COUNT);
    return [...new Array(Math.max(0, BAR_COUNT - tail.length)).fill(0), ...tail];
  }, [amplitudes]);

  return (
    <div
      className='flex h-6 flex-1 items-center gap-[3px]'
      aria-hidden='true'
      data-testid='waveform'
    >
      {bars.map((amp, i) => (
        <span
          key={i}
          className='flex-1 rounded-full'
          style={{
            // Never fully collapse — a flat line reads as "broken", not "quiet".
            height: `${12 + Math.min(1, amp) * 88}%`,
            background: active ? ember : ink,
            opacity: active ? 0.45 + Math.min(1, amp) * 0.55 : 0.18,
            transition: 'height 90ms linear, opacity 90ms linear',
          }}
        />
      ))}
    </div>
  );
};
