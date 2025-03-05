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
    <span className='inline-block'>
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
        <HoverCardContent className='w-80' align='start' sideOffset={5}>
          <div className='space-y-2'>
            {preview.image && (
              <span className='relative block w-full h-32'>
                <Image
                  src={preview.image}
                  alt={preview.title}
                  fill
                  sizes='320px'
                  className='object-cover rounded-md'
                  unoptimized
                />
              </span>
            )}
            <div className='space-y-1'>
              <div className='text-sm font-semibold'>{preview.title}</div>
              <div className='text-sm text-muted-foreground'>
                {preview.description}
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </span>
  );
};
