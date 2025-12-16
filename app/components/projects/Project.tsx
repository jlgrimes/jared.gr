import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Shared utilities
const getLayoutId = (title: string) => `project-${title.replace(/\s+/g, '-')}`;

const parseDescription = (description: string) => {
  const year = description.match(/\d{4}/)?.[0] ?? '';
  const company = description.replace(/\s*-\s*\d{4}/, '');
  return { year, company };
};

// iOS-like spring: smooth and responsive, no bounce
const transition = {
  type: 'spring',
  duration: 0.4,
  bounce: 0,
} as const;

interface ProjectProps {
  title: string;
  description: string;
  content: string;
  image: string;
  isExpanded: boolean;
  onToggle: () => void;
  hasExpandedCard: boolean;
}

export const Project = ({
  title,
  description,
  image,
  isExpanded,
  onToggle,
  hasExpandedCard,
}: ProjectProps) => {
  const { year, company } = parseDescription(description);
  const layoutId = getLayoutId(title);
  const subtitle = `${company} · ${year}`;

  // Always render the same structure to prevent layout shifts
  // When expanded, remove layoutIds (ExpandedProject takes over) and hide visually
  return (
    <motion.div
      layoutId={isExpanded ? undefined : `${layoutId}-card`}
      layout={false}
      onClick={isExpanded ? undefined : onToggle}
      transition={transition}
      className={cn(
        'relative overflow-hidden',
        isExpanded ? 'invisible' : 'cursor-pointer group',
        !isExpanded && hasExpandedCard && 'opacity-40'
      )}
    >
      <motion.div
        layoutId={isExpanded ? undefined : `${layoutId}-image`}
        layout={false}
        transition={transition}
        className='aspect-square md:aspect-auto'
      >
        <Image
          src={`/assets/${image}`}
          alt={title}
          width={800}
          height={600}
          className='w-full h-full md:h-auto object-cover'
        />
      </motion.div>

      {/* Hover Overlay */}
      <div
        className='absolute inset-0 bg-black/0 group-hover:bg-black/60 
                   transition-all duration-200 flex items-center justify-center'
      >
        <div className='opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 text-white text-center px-4'>
          <h3 className='text-xl font-semibold'>{title}</h3>
          <p className='text-sm text-white/80 mt-1'>{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Expanded card overlay component
interface ExpandedProjectProps {
  title: string;
  description: string;
  content: string;
  image: string;
  onClose: () => void;
}

export const ExpandedProject = ({
  title,
  description,
  content,
  image,
  onClose,
}: ExpandedProjectProps) => {
  const { year, company } = parseDescription(description);
  const layoutId = getLayoutId(title);
  const subtitle = `${company} · ${year}`;

  return (
    <motion.div
      className='fixed inset-0 z-50 flex items-start justify-center pt-24 px-6'
      initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
      animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`${layoutId}-card`}
        className='bg-white dark:bg-gray-900 shadow-2xl cursor-pointer overflow-hidden w-full max-w-xl'
        transition={transition}
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <motion.div layoutId={`${layoutId}-image`} transition={transition}>
          <Image
            src={`/assets/${image}`}
            alt={title}
            width={800}
            height={600}
            className='w-full h-auto object-cover'
          />
        </motion.div>

        {/* Content - all fades in together after card animation */}
        <motion.div
          className='p-6'
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ delay: 0.2, duration: 0.25 }}
        >
          <h3 className='text-xl font-semibold text-foreground'>{title}</h3>
          <p className='text-sm text-muted-foreground mt-1'>{subtitle}</p>
          <p className='mt-4 text-sm leading-relaxed'>{content}</p>
          <button
            onClick={onClose}
            className='mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
