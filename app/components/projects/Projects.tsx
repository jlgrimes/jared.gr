'use client';

import { useState } from 'react';
import { Project, ExpandedProject } from './Project';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { siteData } from '../../../lib/data';

type ProjectType = (typeof siteData.projects)[0];

export const Projects = () => {
  const projects = siteData.projects;
  const [expandedProject, setExpandedProject] = useState<ProjectType | null>(
    null
  );

  const handleToggle = (project: ProjectType) => {
    setExpandedProject(prev =>
      prev?.title === project.title ? null : project
    );
  };

  return (
    <LayoutGroup>
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
              isExpanded={expandedProject?.title === project.title}
              onToggle={() => handleToggle(project)}
              hasExpandedCard={expandedProject !== null}
            />
          ))}
        </div>
      </motion.section>

      {/* Expanded card overlay */}
      <AnimatePresence>
        {expandedProject && (
          <ExpandedProject
            key={expandedProject.title}
            title={expandedProject.title}
            description={expandedProject.description}
            content={expandedProject.content}
            image={expandedProject.image}
            onClose={() => setExpandedProject(null)}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};
