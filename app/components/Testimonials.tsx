'use client';

import { siteData } from '../../lib/data';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';
import { InView } from '@/components/motion-primitives/in-view';

export function Testimonials() {
  const testimonials = siteData.testimonials;

  return (
    <InView
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
      viewOptions={{ margin: '0px 0px -100px 0px' }}
      once
    >
      <section className='py-12'>
        <AnimatedGroup
          className='grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12'
          preset='blur-slide'
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className='flex flex-col justify-between'>
              <p className='text-base text-gray-700 dark:text-gray-300 italic'>
                {testimonial.content}
              </p>
              <div className='flex items-center gap-2 mt-4'>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  {testimonial.role}
                </span>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  •
                </span>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {testimonial.company}
                </span>
              </div>
            </div>
          ))}
        </AnimatedGroup>
      </section>
    </InView>
  );
}
