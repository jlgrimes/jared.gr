'use client';

import { useTranslation } from '../i18n/useTranslation';

export function Testimonials() {
  const { t } = useTranslation();
  const testimonials = [
    'testimonial1',
    'testimonial2',
    'testimonial3',
    'testimonial4',
  ];

  return (
    <section className='py-12'>
      {/* <h2 className='text-lg sm:text-xl font-semibold text-gray-800 tracking-tight mb-6'>
        What Others Say
      </h2> */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12'>
        {testimonials.map((testimonial, index) => (
          <div key={index} className='flex flex-col justify-between'>
            <p className='text-base text-gray-700 dark:text-gray-300 italic'>
              {t(`testimonials.entries.${testimonial}.content`)}
            </p>
            <div className='flex items-center gap-2 mt-4'>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>
                {t(`testimonials.entries.${testimonial}.role`)}
              </span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                •
              </span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                {t(`testimonials.entries.${testimonial}.company`)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
