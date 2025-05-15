'use client';

import { Project } from './Project';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';

export const Projects = () => {
  const { t } = useTranslation();

  const projects = [
    {
      title: t('projects.copilotActions.title'),
      description: t('projects.copilotActions.description'),
      content: t('projects.copilotActions.content'),
      image: 'actions-web.webp',
    },
    {
      title: t('projects.streamCopilot.title'),
      description: t('projects.streamCopilot.description'),
      content: t('projects.streamCopilot.content'),
      image: 'stream-copilot.png',
    },
    {
      title: t('projects.pokestats.title'),
      description: t('projects.pokestats.description'),
      content: t('projects.pokestats.content'),
      image: 'pokestats.png',
    },
    {
      title: t('projects.streamTranscripts.title'),
      description: t('projects.streamTranscripts.description'),
      content: t('projects.streamTranscripts.content'),
      image: 'transcripts.webp',
    },
    {
      title: t('projects.miSymptoms.title'),
      description: t('projects.miSymptoms.description'),
      content: t('projects.miSymptoms.content'),
      image: 'mi-symptoms.jpg',
    },
    {
      title: t('projects.amazonBI.title'),
      description: t('projects.amazonBI.description'),
      content: t('projects.amazonBI.content'),
      image: 'amazon.webp',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
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
