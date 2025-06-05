'use client';

import { useTranslation } from '../i18n/useTranslation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { EmblaCarouselType as CarouselApi } from 'embla-carousel';

export function Testimonials() {
  const { t } = useTranslation();
  const testimonials = ['testimonial1', 'testimonial2', 'testimonial3'];
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className='py-12'>
      <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white'>
        {t('testimonials.title')}
      </h2>
      <div className='relative'>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          setApi={setApi}
          className='w-full'
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className='md:basis-1/2'>
                <Card className='border-none shadow-lg bg-gray-50 dark:bg-gray-800/50'>
                  <CardHeader className='p-4 pb-0'>
                    <Quote className='h-6 w-6 text-gray-400 dark:text-gray-500' />
                  </CardHeader>
                  <CardContent className='p-4 pt-3'>
                    <p className='text-gray-700 dark:text-gray-300 italic mb-3'>
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
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
