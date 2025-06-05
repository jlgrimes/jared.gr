'use client';

import { useTranslation } from '../i18n/useTranslation';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Quote } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { EmblaCarouselType as CarouselApi } from 'embla-carousel';

export function Testimonials() {
  const { t } = useTranslation();
  const testimonials = [
    'testimonial1',
    'testimonial2',
    'testimonial3',
    'testimonial4',
  ];
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    if (!api) return;

    api.scrollTo(1);

    const interval = setInterval(() => {
      api.scrollNext();
    }, 8000);

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
    });

    return () => {
      clearInterval(interval);
      api.off('select', () => {});
    };
  }, [api]);

  return (
    <section className='py-12'>
      <div className='max-w-4xl mx-auto w-full'>
        <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white container mx-auto'>
          {t('testimonials.title')}
        </h2>
      </div>
      <div className='relative'>
        <Carousel
          opts={{
            align: 'center',
            loop: true,
            skipSnaps: false,
            dragFree: false,
            startIndex: 1,
          }}
          setApi={setApi}
          className='w-full'
        >
          <CarouselContent className='-ml-4'>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className='pl-4 basis-full md:basis-1/3'
              >
                <div className='p-1 h-full'>
                  <Card
                    className='h-full transition-all duration-300'
                    style={{
                      opacity: currentIndex === index ? 1 : 0.5,
                      transform:
                        currentIndex === index ? 'scale(1)' : 'scale(0.95)',
                    }}
                  >
                    <div className='flex flex-col h-full justify-between'>
                      <CardHeader className='p-4 pb-0'>
                        <Quote className='h-6 w-6 text-gray-400 dark:text-gray-500' />
                      </CardHeader>
                      <CardContent className='p-4 pt-3'>
                        <p className='text-lg text-gray-700 dark:text-gray-300 italic'>
                          {t(`testimonials.entries.${testimonial}.content`)}
                        </p>
                      </CardContent>
                      <CardFooter className='px-4 pb-4 pt-0'>
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
                      </CardFooter>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='-left-12' />
          <CarouselNext className='-right-12' />
        </Carousel>
      </div>
    </section>
  );
}
