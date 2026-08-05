'use client';

import React from 'react';
import { motion } from 'motion/react';
import type { Info } from '@jared/info';
import { ink, inkMuted } from './tokens';

/**
 * The page at rest: a cream sheet holding a hero and nothing else. Every other surface lives
 * inside the notch, so this deliberately stays empty — the restraint is the design.
 */
export const Canvas = ({ info }: { info: Info }) => (
  <div className='flex h-full w-full items-center justify-center px-6 pb-40'>
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className='w-full max-w-2xl'
    >
      <img
        src={info.profile.avatar}
        alt=''
        width={60}
        height={60}
        draggable={false}
        className='mb-8 h-15 w-15 rounded-full object-cover select-none'
        style={{ border: `2px solid ${ink}`, height: 60, width: 60 }}
      />

      <h1
        className='leading-[0.95] tracking-[-0.015em]'
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          color: ink,
        }}
      >
        {info.hero.greeting}
      </h1>

      <p
        className='mt-7 max-w-xl text-[17px] leading-relaxed'
        style={{ fontFamily: 'var(--font-figtree)', color: inkMuted }}
      >
        {info.hero.bio}
      </p>
    </motion.div>
  </div>
);
