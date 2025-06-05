'use client';

import { useTranslation } from '../i18n/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function Testimonials() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = ['testimonial1', 'testimonial2', 'testimonial3'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className='py-16'>
      <h2 className='text-2xl font-bold mb-8 text-gray-900 dark:text-white'>
        {t('testimonials.title')}
      </h2>
      <div className='relative h-[200px] overflow-hidden'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className='absolute w-full'
          >
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm'>
              <p className='text-gray-700 dark:text-gray-300 italic mb-4'>
                {t(
                  `testimonials.entries.${testimonials[currentIndex]}.content`
                )}
              </p>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>
                  {t(`testimonials.entries.${testimonials[currentIndex]}.role`)}
                </span>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  •
                </span>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {t(
                    `testimonials.entries.${testimonials[currentIndex]}.company`
                  )}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='flex justify-center gap-2 mt-4'>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex
                ? 'bg-gray-900 dark:bg-white'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
