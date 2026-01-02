'use client';

import Link from 'next/link';
import { siteData } from '../../lib/data';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';

export const Hero = () => {
  return (
    <AnimatedGroup
      className='flex flex-col items-start justify-center gap-8 pt-24'
      preset='blur-slide'
      variants={{
        container: {
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        },
      }}
    >
      <div className='space-y-4'>
        <div className='flex items-center gap-4'>
          <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500'>
            {siteData.hero.greeting}
          </h1>
        </div>
      </div>
      <p className='text-gray-600 dark:text-gray-300 text-lg'>
        {siteData.hero.bio}
      </p>
      <div className='flex gap-4'>
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
      </div>
    </AnimatedGroup>
  );
};
