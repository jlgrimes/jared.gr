import React from 'react';
import { Hero } from '../Hero';
import { Projects } from '../projects/Projects';
import { Testimonials } from '../Testimonials';

const AppIcon = ({ src }: { src: string }) => (
  <img src={src} alt="" className="w-full h-full" draggable={false} />
);

export const desktopApps = [
  {
    id: 'about',
    name: 'About Me',
    icon: <AppIcon src="/assets/icons/briefcase2.ico" />,
    content: (
      <div className='p-8 bg-white dark:bg-[#202020] min-h-full font-mono'>
        <Hero />
      </div>
    ),
  },
  {
    id: 'projects',
    name: 'Project Explorer',
    icon: <AppIcon src="/assets/icons/explorer.ico" />,
    content: (
      <div className='p-4 bg-[#f3f3f3] dark:bg-[#202020] min-h-full'>
        <Projects />
      </div>
    ),
  },
  {
    id: 'testimonials',
    name: 'Feedback',
    icon: <AppIcon src="/assets/icons/feedback.ico" />,
    content: (
      <div className='p-4 bg-white dark:bg-[#111] min-h-full'>
        <Testimonials />
      </div>
    ),
  },
];
