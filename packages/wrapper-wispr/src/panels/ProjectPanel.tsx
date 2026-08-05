'use client';

import React from 'react';
import { usePanel } from './context';
import { Chip, Meta, PanelTitle, yearLabel } from './primitives';
import { inkHairline, inkMuted } from '../tokens';

/** One project in full. Falls back to the grid if the model names something that isn't real. */
export const ProjectPanel = ({ title }: { title: string }) => {
  const { info, show } = usePanel();

  const project = React.useMemo(() => {
    const needle = title.trim().toLowerCase();
    return (
      info.projects.find(p => p.title.toLowerCase() === needle) ??
      info.projects.find(p => p.title.toLowerCase().includes(needle))
    );
  }, [info.projects, title]);

  if (!project) {
    return (
      <div className='space-y-3'>
        <p className='text-[15px]' style={{ color: inkMuted }}>
          No project by that name — here's everything instead.
        </p>
        <Chip onClick={() => show({ kind: 'projects' })}>Show all projects</Chip>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <div>
        <PanelTitle>{project.title}</PanelTitle>
        <div className='mt-1.5'>
          <Meta
            parts={[
              project.company,
              project.team || undefined,
              yearLabel(project.year, project.endYear),
            ]}
          />
        </div>
      </div>

      {project.image && (
        <img
          src={`/assets/${project.image}`}
          alt=''
          draggable={false}
          className='max-h-56 w-full rounded-2xl object-cover select-none'
          style={{ border: `1.5px solid ${inkHairline}` }}
        />
      )}

      <p className='text-[15px] leading-relaxed'>{project.content}</p>

      <div className='flex flex-wrap items-center gap-2 pt-0.5'>
        <Chip>{project.stack}</Chip>
        {project.url && (
          <a
            href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
            target='_blank'
            rel='noreferrer'
            className='text-[13px] underline underline-offset-4'
          >
            {project.url}
          </a>
        )}
        {project.infoUrl && (
          <a
            href={project.infoUrl}
            target='_blank'
            rel='noreferrer'
            className='text-[13px] underline underline-offset-4'
            style={{ color: inkMuted }}
          >
            Read more
          </a>
        )}
      </div>

      <div className='pt-1'>
        <Chip onClick={() => show({ kind: 'projects' })}>← All projects</Chip>
      </div>
    </div>
  );
};
