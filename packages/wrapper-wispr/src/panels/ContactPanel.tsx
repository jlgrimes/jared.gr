'use client';

import React from 'react';
import { usePanel } from './context';
import { ink, inkHairline, inkMuted, lavender, radius } from '../tokens';

export const ContactPanel = () => {
  const { info } = usePanel();

  return (
    <div className='space-y-3'>
      <a
        href={`mailto:${info.profile.email}`}
        className='inline-flex items-center gap-2 px-4 py-2 text-[14px] transition-colors'
        style={{
          color: ink,
          background: lavender,
          border: `1.5px solid ${ink}`,
          borderRadius: radius.pill,
        }}
      >
        {info.profile.email}
      </a>

      <div className='flex flex-wrap gap-2'>
        {info.socials.map(social => (
          <a
            key={social.id}
            href={social.url}
            target='_blank'
            rel='noreferrer'
            className='px-3 py-1.5 text-[13px] transition-colors hover:bg-[rgba(26,26,26,0.05)]'
            style={{
              color: ink,
              border: `1.5px solid ${inkHairline}`,
              borderRadius: radius.pill,
            }}
          >
            {social.name}
          </a>
        ))}
      </div>

      <p className='text-[12.5px]' style={{ color: inkMuted }}>
        Fastest way to reach him is email.
      </p>
    </div>
  );
};
