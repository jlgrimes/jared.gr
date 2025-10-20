'use client';

import { Project } from './Project';
import { motion } from 'framer-motion';
import { siteData } from '../../../lib/data';

export const Projects = () => {
  const projects = siteData.projects;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className='py-12'
    >
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {projects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className='h-full'
          >
            <Project
              title={project.title}
              description={project.description}
              content={project.content}
              image={project.image}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
