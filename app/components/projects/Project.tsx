import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface ProjectProps {
  title: string;
  description: string;
  content: string;
  image: string;
  isExpanded: boolean;
  onToggle: (rect: DOMRect | null) => void;
  hasExpandedCard: boolean;
}

export const Project = ({
  title,
  description,
  content,
  image,
  isExpanded,
  onToggle,
  hasExpandedCard,
}: ProjectProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Extract year from description (e.g., "Microsoft Office AI - 2025")
  const year = description.match(/\d{4}/)?.[0] ?? '';

  const handleClick = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      onToggle(rect);
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={cn(
        'relative cursor-pointer break-inside-avoid overflow-hidden group',
        'transition-opacity duration-200',
        hasExpandedCard && !isExpanded && 'opacity-40',
        isExpanded && 'opacity-0'
      )}
    >
      {/* Image */}
      <div className='relative'>
        <Image
          src={`/assets/${image}`}
          alt={title}
          width={800}
          height={600}
          className='w-full h-auto object-cover'
        />

        {/* Hover Overlay - pure CSS, no Framer Motion */}
        <div
          className='absolute inset-0 bg-black/0 group-hover:bg-black/60 
                     transition-all duration-200 flex items-center justify-center'
        >
          <div className='opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 text-white text-center px-4'>
            <h3 className='text-xl font-semibold'>{title}</h3>
            <p className='text-sm text-white/80 mt-1'>{year}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Expanded card overlay component
interface ExpandedProjectProps {
  title: string;
  description: string;
  content: string;
  image: string;
  originRect: DOMRect;
  onClose: () => void;
}

export const ExpandedProject = ({
  title,
  description,
  content,
  image,
  originRect,
  onClose,
}: ExpandedProjectProps) => {
  const year = description.match(/\d{4}/)?.[0] ?? '';
  const company = description.replace(/\s*-\s*\d{4}/, '');

  // Calculate the center position for expanded state
  const expandedWidth = Math.min(600, window.innerWidth - 48);
  const expandedLeft = (window.innerWidth - expandedWidth) / 2;
  const expandedTop = 100;

  // Calculate the aspect ratio to maintain image height during animation
  const aspectRatio = originRect.height / originRect.width;
  const expandedImageHeight = expandedWidth * aspectRatio;

  return (
    <motion.div
      className='fixed inset-0 z-50'
      initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
      animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className='absolute bg-white dark:bg-gray-900 shadow-2xl cursor-pointer overflow-hidden'
        style={{
          borderRadius: 0,
        }}
        initial={{
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
        }}
        animate={{
          top: expandedTop,
          left: expandedLeft,
          width: expandedWidth,
        }}
        exit={{
          top: originRect.top,
          left: originRect.left,
          width: originRect.width,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image container with fixed aspect during animation */}
        <motion.div
          initial={{ height: originRect.height }}
          animate={{ height: expandedImageHeight }}
          exit={{ height: originRect.height }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className='overflow-hidden'
        >
          <Image
            src={`/assets/${image}`}
            alt={title}
            width={800}
            height={600}
            className='w-full h-full object-cover'
          />
        </motion.div>

        {/* Content - fades in after position animation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{
            opacity: { delay: 0.15, duration: 0.15 },
            height: { delay: 0.1, duration: 0.2 },
          }}
          className='overflow-hidden'
        >
          <div className='p-6'>
            <h3 className='text-xl font-semibold'>{title}</h3>
            <p className='text-sm text-muted-foreground mt-1'>
              {company} &middot; {year}
            </p>
            <p className='mt-4 text-sm leading-relaxed'>{content}</p>
            <button
              onClick={onClose}
              className='mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
