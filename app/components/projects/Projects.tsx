'use client';

import { useState } from 'react';
import { Project, ExpandedProject } from './Project';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { siteData } from '../../../lib/data';
import Masonry from 'react-masonry-css';

type ProjectType = (typeof siteData.projects)[0];

const breakpointColumns = {
  default: 3, // 3 columns for large screens
  1024: 2, // 2 columns for tablet
  768: 1, // 1 column for mobile
};

export const Projects = () => {
  // Sort projects by year, newest first
  const projects = [...siteData.projects].sort((a, b) => b.year - a.year);
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
        <Masonry
          breakpointCols={breakpointColumns}
          className='flex w-auto'
          columnClassName='bg-clip-padding'
        >
          {projects.map(project => (
            <Project
              key={project.title}
              title={project.title}
              company={project.company}
              year={project.year}
              content={project.content}
              image={project.image}
              isExpanded={expandedProject?.title === project.title}
              onToggle={() => handleToggle(project)}
              hasExpandedCard={expandedProject !== null}
            />
          ))}
        </Masonry>
      </motion.section>

      {/* Expanded card overlay */}
      <AnimatePresence>
        {expandedProject && (
          <ExpandedProject
            key={expandedProject.title}
            title={expandedProject.title}
            company={expandedProject.company}
            year={expandedProject.year}
            content={expandedProject.content}
            image={expandedProject.image}
            onClose={() => setExpandedProject(null)}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};
