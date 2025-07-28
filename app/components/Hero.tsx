'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='flex flex-col items-start justify-center gap-8 pt-24'
    >
      <div className='space-y-4'>
        <div className='flex items-center gap-4'>
          <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500'>
            {t('hero.greeting')}
          </h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='text-gray-600 dark:text-gray-300 text-lg'
        >
          {t('hero.bio')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='flex gap-4'
        >
          <a
            href='https://github.com/jlgrimes'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
          >
            {t('hero.github')}
          </a>
          <a
            href='https://linkedin.com/in/jaredlgrimes'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
          >
            {t('hero.linkedin')}
          </a>
          <a
            href='https://twitter.com/jgrimesey'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
          >
            {t('hero.twitter')}
          </a>
        </motion.div>
      </div>
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='w-full max-w-2xl'
      >
        <ChatInput
          input={input}
          setInput={setInput}
          isInputFocused={isInputFocused}
          setIsInputFocused={setIsInputFocused}
          onSubmit={onSubmit}
          inputRef={inputRef}
        />
      </motion.div> */}
    </motion.div>
  );
};
