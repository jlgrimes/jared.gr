'use client';

import { useState } from 'react';
import { Project, ExpandedProject } from './Project';
import { motion, AnimatePresence } from 'framer-motion';
import { siteData } from '../../../lib/data';

interface ExpandedState {
  project: (typeof siteData.projects)[0];
  rect: DOMRect;
}

export const Projects = () => {
  const projects = siteData.projects;
  const [expanded, setExpanded] = useState<ExpandedState | null>(null);

  const handleToggle = (
    project: (typeof siteData.projects)[0],
    rect: DOMRect | null
  ) => {
    if (expanded?.project.title === project.title) {
      setExpanded(null);
    } else if (rect) {
      setExpanded({ project, rect });
    }
  };

  const handleClose = () => {
    setExpanded(null);
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className='py-12'
      >
        <div className='columns-1 lg:columns-2 gap-0'>
          {projects.map(project => (
            <Project
              key={project.title}
              title={project.title}
              description={project.description}
              content={project.content}
              image={project.image}
              isExpanded={expanded?.project.title === project.title}
              onToggle={rect => handleToggle(project, rect)}
              hasExpandedCard={expanded !== null}
            />
          ))}
        </div>
      </motion.section>

      {/* Expanded card overlay */}
      <AnimatePresence>
        {expanded && (
          <ExpandedProject
            key={expanded.project.title}
            title={expanded.project.title}
            description={expanded.project.description}
            content={expanded.project.content}
            image={expanded.project.image}
            originRect={expanded.rect}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};
