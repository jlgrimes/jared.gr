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

const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
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

  // Don't render if expanded - the ExpandedProject takes over with shared layoutId
  if (isExpanded) {
    return (
      <div className='break-inside-avoid overflow-hidden invisible'>
        <Image
          src={`/assets/${image}`}
          alt={title}
          width={800}
          height={600}
          className='w-full h-auto object-cover'
        />
      </div>
    );
  }

  return (
    <motion.div
      layoutId={`${layoutId}-card`}
      onClick={onToggle}
      transition={springTransition}
      className={cn(
        'relative cursor-pointer break-inside-avoid overflow-hidden group',
        'transition-opacity duration-200',
        hasExpandedCard && 'opacity-40'
      )}
    >
      <motion.div layoutId={`${layoutId}-image`} transition={springTransition}>
        <Image
          src={`/assets/${image}`}
          alt={title}
          width={800}
          height={600}
          className='w-full h-auto object-cover'
        />
      </motion.div>

      {/* Hover Overlay */}
      <div
        className='absolute inset-0 bg-black/0 group-hover:bg-black/60 
                   transition-all duration-200 flex items-center justify-center'
      >
        <div className='opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 text-white text-center px-4'>
          <motion.h3
            layoutId={`${layoutId}-title`}
            className='text-xl font-semibold'
            transition={springTransition}
          >
            {title}
          </motion.h3>
          <motion.p
            layoutId={`${layoutId}-subtitle`}
            className='text-sm text-white/80 mt-1'
            transition={springTransition}
          >
            {subtitle}
          </motion.p>
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
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`${layoutId}-card`}
        className='bg-white dark:bg-gray-900 shadow-2xl cursor-pointer overflow-hidden w-full max-w-xl'
        transition={springTransition}
        onClick={e => e.stopPropagation()}
      >
        {/* Image */}
        <motion.div
          layoutId={`${layoutId}-image`}
          transition={springTransition}
        >
          <Image
            src={`/assets/${image}`}
            alt={title}
            width={800}
            height={600}
            className='w-full h-auto object-cover'
          />
        </motion.div>

        {/* Content */}
        <div className='p-6'>
          {/* Title and subtitle use layoutId - no opacity animation */}
          <motion.h3
            layoutId={`${layoutId}-title`}
            className='text-xl font-semibold text-foreground'
            transition={springTransition}
          >
            {title}
          </motion.h3>
          <motion.p
            layoutId={`${layoutId}-subtitle`}
            className='text-sm text-muted-foreground mt-1'
            transition={springTransition}
          >
            {subtitle}
          </motion.p>

          {/* Description and button fade in separately */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.15 }}
            className='mt-4 text-sm leading-relaxed'
          >
            {content}
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25, duration: 0.15 }}
            onClick={onClose}
            className='mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
