'use client';

import React from 'react';
import { usePanel } from './context';
import { Meta, PanelCard } from './primitives';
import { ink } from '../tokens';

export const TestimonialsPanel = () => {
  const { info } = usePanel();

  return (
    <div className='space-y-2.5'>
      {info.testimonials.map(t => (
        <PanelCard key={`${t.role}-${t.company}`}>
          <p
            className='text-[15px] leading-relaxed'
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: ink }}
          >
            “{t.content}”
          </p>
          <div className='mt-2'>
            <Meta parts={[t.role, t.company]} />
          </div>
        </PanelCard>
      ))}
    </div>
  );
};
