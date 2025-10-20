'use client';

import { motion } from 'framer-motion';
import { siteData } from '../../lib/data';

export function Testimonials() {
  const testimonials = siteData.testimonials;

  return (
    <section className='py-12'>
      {/* <h2 className='text-lg sm:text-xl font-semibold text-gray-800 tracking-tight mb-6'>
        What Others Say
      </h2> */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12'>
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6 + index * 0.1,
            }}
            className='flex flex-col justify-between'
          >
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}
