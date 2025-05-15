'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const greetings = [
  { text: "Hi, I'm Jared", lang: 'en' },
  { text: 'Γεια, είμαι ο Jared', lang: 'el' },
  { text: 'こんにちは、Jaredです', lang: 'ja' },
  { text: '你好，我是Jared', lang: 'zh' },
];

export const Hero = () => {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);

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
      className='flex flex-col items-start justify-center min-h-[60vh] gap-8 px-4'
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
          {`I'm a front-end engineer at Microsoft. I work on UI/UX for Copilot
          Actions, focusing on creating thoughtful, intuitive experiences for
          the new AI scape. Collaborating closely with design, I aim to optimize
          the delivery of high-performance applications that don't sacrifice
          user experience.`}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='flex gap-4'
        >
          <a
            href='https://github.com/jaredgrimes'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
          >
            GitHub
          </a>
          <a
            href='https://linkedin.com/in/jaredgrimes'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
          >
            LinkedIn
          </a>
          <a
            href='https://twitter.com/jgrimesey'
            target='_blank'
            rel='noopener noreferrer'
            className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
          >
            Twitter
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
