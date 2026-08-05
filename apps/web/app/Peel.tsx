'use client';

import React from 'react';

/** Corner sizes, in px: at rest, under the cursor, and mid-tear. */
const REST = 34;
const HOVER = 62;
const TORN = 3600;

export const PEEL_DURATION_MS = 780;

/**
 * The top-right corner of the page, lifted.
 *
 * The layer on top is clipped to everything *except* a triangle in that corner, so whatever
 * is underneath shows through the gap. Growing the triangle past the viewport tears the
 * whole sheet away on a diagonal — one clip-path, no compositing tricks.
 */
export const peelClipPath = (size: number) =>
  `polygon(0 0, calc(100% - ${size}px) 0, 100% ${size}px, 100% 100%, 0 100%)`;

export const PeelCorner = ({
  label,
  hovered,
  onHoverChange,
  onClick,
  hidden,
}: {
  label: string;
  hovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onClick: () => void;
  hidden: boolean;
}) => {
  const size = hovered ? HOVER : REST;

  return (
    <button
      type='button'
      onClick={onClick}
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      aria-label={label}
      title={label}
      className='group fixed top-0 right-0 z-[60] cursor-pointer focus:outline-none overflow-hidden'
      style={{
        width: HOVER + 24,
        height: HOVER + 24,
        // The tear animates the layer underneath; the affordance itself just gets out of
        // the way rather than scaling along with it.
        opacity: hidden ? 0 : 1,
        transition: 'opacity 200ms ease',
        pointerEvents: hidden ? 'none' : 'auto',
      }}
    >
      {/* Shadow cast by the lifted corner onto the page below it. */}
      <span
        aria-hidden='true'
        className='absolute top-0 right-0 block'
        style={{
          width: size,
          height: size,
          clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
          background:
            'linear-gradient(225deg, rgba(26,26,26,0.30) 0%, rgba(26,26,26,0.06) 42%, rgba(26,26,26,0) 70%)',
          transition: `width ${PEEL_DURATION_MS / 4}ms ease, height ${PEEL_DURATION_MS / 4}ms ease`,
        }}
      />
      {/* The fold itself — a hairline along the diagonal so the corner reads as creased. */}
      <span
        aria-hidden='true'
        className='absolute top-0 right-0 block origin-top-right'
        style={{
          width: Math.SQRT2 * size,
          height: 1.5,
          background: 'rgba(26,26,26,0.55)',
          transform: 'rotate(45deg) translateX(-100%)',
          transformOrigin: '100% 0',
          transition: `width ${PEEL_DURATION_MS / 4}ms ease`,
        }}
      />
    </button>
  );
};
