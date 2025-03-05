import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useState, useEffect } from 'react';

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
}

interface PreviewData {
  title: string;
  description: string;
  image?: string;
}

export const LinkPreview = ({ href, children }: LinkPreviewProps) => {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/preview?url=${encodeURIComponent(href)}`
        );
        const data = await response.json();
        setPreview(data);
      } catch (error) {
        console.error('Error fetching preview:', error);
        setPreview({
          title: new URL(href).hostname,
          description: 'Failed to load preview',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();
  }, [href]);

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
          <h4 className='text-sm font-semibold'>{preview?.title}</h4>
          <p className='text-sm text-muted-foreground'>
            {isLoading ? 'Loading preview...' : preview?.description}
          </p>
          {preview?.image && (
            <img
              src={preview.image}
              alt={preview.title}
              className='w-full h-32 object-cover rounded-md'
            />
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
