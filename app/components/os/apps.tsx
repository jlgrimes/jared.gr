import React from 'react';
import { Home, PanelTop, Chrome } from 'lucide-react';
import { Hero } from '../Hero';
import { Projects } from '../projects/Projects';
import { Testimonials } from '../Testimonials';

export const desktopApps = [
  {
    id: 'about',
    name: 'About Me.txt',
    icon: <PanelTop className='w-full h-full text-blue-500' />,
    content: (
      <div className='p-8 bg-white dark:bg-[#202020] min-h-full font-mono'>
        <Hero />
      </div>
    ),
  },
  {
    id: 'projects',
    name: 'Projects',
    icon: <Chrome className='w-full h-full text-indigo-500' />,
    content: (
      <div className='p-4 bg-[#f3f3f3] dark:bg-[#202020] min-h-full'>
        <Projects />
      </div>
    ),
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    icon: <Home className='w-full h-full text-green-500' />,
    content: (
      <div className='p-4 bg-white dark:bg-[#111] min-h-full'>
        <Testimonials />
      </div>
    ),
  },
];
