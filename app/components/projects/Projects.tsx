'use client';

import { Project } from './Project';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Copilot Actions',
    year: '2024',
    description:
      'Developed the majority of the front-end UI for Copilot Actions and owned stylistic implementation app-wide - rapidly incorporating design feedback. Collaborated with localization teams, design, and product to support 20+ languages for the linguistically complex, mad-lib-style AI input for the Copilot Actions Create flow.',
    image: 'actions-web.webp',
  },
  {
    title: 'Stream Copilot',
    year: '2023',
    description:
      'Implemented lazy loading the front-end, the interactive prompt menu UI, and the end-to-end user feedback collection system.',
    image: 'stream-copilot.png',
  },
  {
    title: 'pokestats.live',
    year: '2023',
    description:
      'Sole developer for pokestats.live, a community-powered live tournament analytics tool for competitors of the Pokémon Trading Card Game, accruing 3M+ total impressions and 10K+ weekly active users',
    image: 'pokestats.PNG',
  },
  {
    title: 'MI Symptoms',
    year: '2020',
    description:
      'Lead developer for MI Symptoms - a free online tool to help organizations screen their members for COVID-19 symptoms, accruing 1M+ survey submissions in the State of Michigan.',
    image: 'mi-symptoms.jpg',
    //link: 'https://cse.engin.umich.edu/stories/students-lead-the-way-on-state-of-michigan-web-application-to-help-curb-the-spread-of-covid-19',
  },
];

export const Projects = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className='px-4 py-12'
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
              year={project.year}
              description={project.description}
              image={project.image}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
