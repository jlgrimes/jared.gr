'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { siteData } from '../../lib/data';

export const Hero = () => {
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
            {siteData.hero.greeting}
          </h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='text-gray-600 dark:text-gray-300 text-lg'
        >
          {siteData.hero.bio}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='flex gap-4'
        >
          <Link
            href='/github'
            className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
          >
            {siteData.hero.github}
          </Link>
          <Link
            href='/linkedin'
            className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
          >
            {siteData.hero.linkedin}
          </Link>
          <Link
            href='/x'
            className='text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors'
          >
            {siteData.hero.twitter}
          </Link>
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
