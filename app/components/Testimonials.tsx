'use client';

import { useTranslation } from '../i18n/useTranslation';

export function Testimonials() {
  const { t } = useTranslation();
  const testimonials = ['testimonial1', 'testimonial2', 'testimonial3'];

  return (
    <section className='py-16'>
      <h2 className='text-2xl font-bold mb-8 text-gray-900 dark:text-white'>
        {t('testimonials.title')}
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {testimonials.map((testimonial, index) => (
          <div key={index} className='w-full'>
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm h-full'>
              <p className='text-gray-700 dark:text-gray-300 italic mb-4'>
                {t(`testimonials.entries.${testimonial}.content`)}
              </p>
              <div className='flex items-center gap-2'>
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
          </div>
        ))}
      </div>
    </section>
  );
}
