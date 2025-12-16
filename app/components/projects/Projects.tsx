'use client';

import { useState } from 'react';
import { Project } from './Project';
import { motion } from 'framer-motion';
import { siteData } from '../../../lib/data';

export const Projects = () => {
  const projects = siteData.projects;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggle = (title: string) => {
    setExpandedId(expandedId === title ? null : title);
  };

  return (
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
            isExpanded={expandedId === project.title}
            onToggle={() => handleToggle(project.title)}
            hasExpandedCard={expandedId !== null}
          />
        ))}
      </div>
    </motion.section>
  );
};
