'use client';

import React from 'react';
import { usePanel } from './context';
import { Meta, PanelCard, yearLabel } from './primitives';
import { inkMuted } from '../tokens';

/** The project grid, optionally narrowed to one technology. */
export const ProjectsPanel = ({ stack }: { stack?: string }) => {
  const { info, show } = usePanel();

  const matches = React.useMemo(() => {
    if (!stack) return info.projects;
    const needle = stack.toLowerCase();
    const hits = info.projects.filter(
      p =>
        p.stack.toLowerCase().includes(needle) ||
        p.title.toLowerCase().includes(needle)
    );
    // A filter that finds nothing is worse than no filter — fall back to the full set.
    return hits.length > 0 ? hits : info.projects;
  }, [info.projects, stack]);

  const filtered = stack && matches.length !== info.projects.length;

  return (
    <div className='space-y-2.5'>
      {filtered && (
        <p className='text-[12.5px]' style={{ color: inkMuted }}>
          {matches.length} {matches.length === 1 ? 'project' : 'projects'} using {stack}
        </p>
      )}
      <div className='grid gap-2.5 sm:grid-cols-2'>
        {matches.map(p => (
          <PanelCard key={p.title} onClick={() => show({ kind: 'project', title: p.title })}>
            <p
              className='text-[15px] leading-tight'
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              {p.title}
            </p>
            <div className='mt-1'>
              <Meta parts={[p.company, yearLabel(p.year, p.endYear)]} />
            </div>
            <div className='mt-1.5'>
              <Meta parts={[p.stack]} />
            </div>
          </PanelCard>
        ))}
      </div>
    </div>
  );
};
