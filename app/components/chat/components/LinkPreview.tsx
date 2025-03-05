import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { usePreview } from '@/app/hooks/usePreview';
import Image from 'next/image';

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
}

export const LinkPreview = ({ href, children }: LinkPreviewProps) => {
  const { preview } = usePreview(href);

  // Don't render hover card if preview failed to load or is still loading
  if (
    preview.description === 'Failed to load preview' ||
    preview.description === 'Loading preview...'
  ) {
    return (
      <a
        href={href}
        className='text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full'
        target='_blank'
        rel='noopener noreferrer'
      >
        {children}
      </a>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href={href}
          className='text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full'
          target='_blank'
          rel='noopener noreferrer'
        >
          {children}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className='w-80'>
        <div className='space-y-2'>
          {preview.image && (
            <div className='relative w-full h-32'>
              <Image
                src={preview.image}
                alt={preview.title}
                fill
                sizes='320px'
                className='object-cover rounded-md'
                unoptimized
              />
            </div>
          )}
          <div className='space-y-1'>
            <h4 className='text-sm font-semibold'>{preview.title}</h4>
            <p className='text-sm text-muted-foreground'>
              {preview.description}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
