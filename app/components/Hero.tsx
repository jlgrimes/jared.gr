'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/useTranslation';

// Use translations instead of hardcoded greetings
export const Hero = () => {
  const { t } = useTranslation();
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

  const greetings = [
    { text: t('hero.greeting'), lang: 'en' },
    { text: t('hero.greeting_el'), lang: 'el' },
    { text: t('hero.greeting_ja'), lang: 'ja' },
    { text: t('hero.greeting_zh'), lang: 'zh' },
  ];

  useEffect(() => {
    const greetingInterval = setInterval(() => {
      setCurrentGreetingIndex(prev => (prev + 1) % greetings.length);
    }, 6000);

    return () => {
      clearInterval(greetingInterval);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className='flex flex-col items-start justify-center gap-8 pt-24'
    >
      <div className='space-y-4'>
        <div className='flex items-center gap-4'>
          <div className='relative h-12 w-full'>
            <AnimatePresence mode='wait'>
              <motion.h1
                key={currentGreetingIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 absolute'
              >
                {greetings[currentGreetingIndex].text}
              </motion.h1>
            </AnimatePresence>
          </div>
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
