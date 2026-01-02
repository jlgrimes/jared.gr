'use client';

import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogContainer,
  MorphingDialogImage,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogClose,
} from '@/components/motion-primitives/morphing-dialog';

interface ProjectProps {
  title: string;
  company: string;
  year: number;
  content: string;
  image: string;
  url: string;
  infoUrl: string;
}

export const Project = ({
  title,
  company,
  year,
  content,
  image,
  url,
  infoUrl,
}: ProjectProps) => {
  const subtitle = `${company} · ${year}`;

  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        duration: 0.4,
        bounce: 0,
      }}
    >
      <MorphingDialogTrigger className='overflow-hidden group'>
        <MorphingDialogImage
          src={`/assets/${image}`}
          alt={title}
          className='w-full h-full md:h-auto object-cover aspect-square md:aspect-auto'
        />
        <div
          className='absolute inset-0 bg-black/0 group-hover:bg-black/60
                     transition-all duration-200 flex items-center justify-center'
        >
          <div className='opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 text-white text-center px-4'>
            <MorphingDialogTitle>
              <h3 className='text-xl font-semibold'>{title}</h3>
            </MorphingDialogTitle>
            <MorphingDialogSubtitle>
              <p className='text-sm text-white/80 mt-1'>{subtitle}</p>
            </MorphingDialogSubtitle>
          </div>
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className='bg-white dark:bg-gray-900 shadow-2xl overflow-hidden w-full max-w-xl mx-6'>
          <MorphingDialogImage
            src={`/assets/${image}`}
            alt={title}
            className='w-full h-auto object-cover'
          />
          <div className='p-8'>
            <MorphingDialogTitle>
              <h3 className='text-xl font-semibold text-foreground'>{title}</h3>
            </MorphingDialogTitle>
            <MorphingDialogSubtitle>
              <p className='text-sm text-muted-foreground mt-1'>{subtitle}</p>
            </MorphingDialogSubtitle>
            <MorphingDialogDescription
              disableLayoutAnimation
              variants={{
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 12 },
              }}
            >
              <p className='mt-4 text-sm leading-relaxed'>{content}</p>
              <div className='flex gap-4 mt-4'>
                {url.length > 0 && (
                  <a
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={e => e.stopPropagation()}
                    className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
                  >
                    Visit Project →
                  </a>
                )}
                {infoUrl.length > 0 && (
                  <a
                    href={
                      infoUrl.startsWith('http') ? infoUrl : `https://${infoUrl}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={e => e.stopPropagation()}
                    className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
                  >
                    More Info →
                  </a>
                )}
              </div>
            </MorphingDialogDescription>
          </div>
          <MorphingDialogClose
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
            }}
          />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
};
