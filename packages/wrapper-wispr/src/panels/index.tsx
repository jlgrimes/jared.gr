'use client';

import React from 'react';
import type { Card } from '../types';
import { ContactPanel } from './ContactPanel';
import { ProjectPanel } from './ProjectPanel';
import { ProjectsPanel } from './ProjectsPanel';
import { SkillsPanel } from './SkillsPanel';
import { TestimonialsPanel } from './TestimonialsPanel';

export { PanelProvider, usePanel } from './context';
export { Chip, PanelCard, PanelTitle } from './primitives';

/** Maps a card — produced by a tool call or by a chip click — onto its panel. */
export const CardView = ({ card }: { card: Card }) => {
  switch (card.kind) {
    case 'projects':
      return <ProjectsPanel stack={card.stack} />;
    case 'project':
      return <ProjectPanel title={card.title} />;
    case 'testimonials':
      return <TestimonialsPanel />;
    case 'skills':
      return <SkillsPanel />;
    case 'contact':
      return <ContactPanel />;
  }
};
