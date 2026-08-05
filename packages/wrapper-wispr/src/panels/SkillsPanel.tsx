'use client';

import React from 'react';
import { usePanel } from './context';
import { Chip } from './primitives';
import { inkMuted } from '../tokens';

/**
 * The stack, as chips. Wispr's Dictionary is a list of words it knows; here the words are
 * technologies, and clicking one filters the projects — so the skills list doubles as
 * navigation instead of being a dead end.
 */
export const SkillsPanel = () => {
  const { info, show } = usePanel();

  return (
    <div className='space-y-3'>
      {info.skills.map(group => (
        <div key={group.category}>
          <p className='mb-1.5 text-[12.5px]' style={{ color: inkMuted }}>
            {group.category}
          </p>
          <div className='flex flex-wrap gap-2'>
            {group.items.split(',').map(item => {
              const label = item.trim();
              return (
                <Chip
                  key={label}
                  onClick={() => show({ kind: 'projects', stack: label })}
                >
                  {label}
                </Chip>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
