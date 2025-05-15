'use client';

import { Project } from './Project';
import { motion } from 'framer-motion';

const projects = [
  {
    title: 'Copilot Actions',
    description: 'Microsoft Office AI - 2024',
    content:
      'Developed the majority of the front-end UI for Copilot Actions and owned stylistic implementation app-wide - rapidly incorporating design feedback. Collaborated with localization teams, design, and product to support 20+ languages for the linguistically complex, mad-lib-style AI input for the Copilot Actions Create flow.',
    image: 'actions-web.webp',
  },
  {
    title: 'Stream Copilot',
    description: 'Microsoft Office Media Group - 2023',
    content:
      'Led front-end development and integration of O365 Copilot into Microsoft Stream, giving users the ability to interact with videos with natural language. Implemented lazy loading the front-end, the interactive prompt menu UI, and the end-to-end user feedback collection system.',
    image: 'stream-copilot.png',
  },
  {
    title: 'pokestats.live',
    description: 'Freelance - 2023',
    content:
      'Sole developer for pokestats.live, a community-powered live tournament analytics tool for competitors of the Pokémon Trading Card Game, accruing 3M+ total impressions and 10K+ weekly active users',
    image: 'pokestats.png',
  },
  {
    title: 'Stream Transcripts',
    description: 'Microsoft Office Media Group - 2022',
    content:
      'Front-end developer for Stream Transcripts, a tool to help users transcribe and search through their Stream videos. Owned rollout of Transcript Edit Batching and various optimizations for accessibility.',
    image: 'transcripts.webp',
  },
  {
    title: 'MI Symptoms',
    description: 'University of Michigan + Michigan Government - 2020',
    content:
      'Lead developer for MI Symptoms - a free online tool to help organizations screen their members for COVID-19 symptoms, accruing 1M+ survey submissions in the State of Michigan.',
    image: 'mi-symptoms.jpg',
    //link: 'https://cse.engin.umich.edu/stories/students-lead-the-way-on-state-of-michigan-web-application-to-help-curb-the-spread-of-covid-19',
  },
  {
    title: 'Amazon Business Intelligence',
    description: 'Amazon - 2019',
    content:
      'Introduced suite of front-end best practices to engineers, decreasing code review turnaround time by 50%, and increasing front-end code reusability, maintainability, and scalability. Created 2020 VP-level award-winning Turismo new features notification framework to 10,000+ users, increasing new feature discoverability by 93.5%.',
    image: 'amazon.webp',
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
