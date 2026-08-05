'use client';

import React from 'react';
import { ink, inkHairline, inkMuted, lavender, radius } from '../tokens';

/**
 * Inner surfaces use a hairline rather than the 2px ink border. The heavy border is the
 * notch's own signature — repeating it on every nested card turns the panel into a grid of
 * boxes and flattens the hierarchy.
 */
export const PanelCard = ({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  const style = {
    border: `1.5px solid ${inkHairline}`,
    borderRadius: 20,
    color: ink,
  } as const;

  if (!onClick) {
    return (
      <div className={`p-3.5 ${className}`} style={style}>
        {children}
      </div>
    );
  }

  return (
    <button
      type='button'
      onClick={onClick}
      className={`w-full cursor-pointer p-3.5 text-left transition-colors hover:bg-[rgba(26,26,26,0.04)] ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

export const Chip = ({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) => (
  <button
    type='button'
    onClick={onClick}
    disabled={!onClick}
    className='cursor-pointer px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors hover:bg-[rgba(26,26,26,0.05)] disabled:cursor-default disabled:hover:bg-transparent'
    style={{
      color: ink,
      background: active ? lavender : 'transparent',
      border: `1.5px solid ${active ? ink : inkHairline}`,
      borderRadius: radius.pill,
    }}
  >
    {children}
  </button>
);

/** The dotted metadata line under a project title: company · years · stack. */
export const Meta = ({ parts }: { parts: (string | undefined)[] }) => {
  const shown = parts.filter((p): p is string => Boolean(p));
  return (
    <p className='text-[12.5px]' style={{ color: inkMuted }}>
      {shown.join(' · ')}
    </p>
  );
};

export const PanelTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    className='text-[22px] leading-tight'
    style={{ fontFamily: 'var(--font-display)', fontWeight: 400, color: ink }}
  >
    {children}
  </h2>
);

export const yearLabel = (year: number, endYear?: number) =>
  endYear ? `${year}–${endYear}` : `${year}`;
