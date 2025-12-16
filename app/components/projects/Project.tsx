import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  content,
  image,
  isExpanded,
  onToggle,
  hasExpandedCard,
}: ProjectProps) => {
  // Extract year from description (e.g., "Microsoft Office AI - 2025")
  const year = description.match(/\d{4}/)?.[0] ?? '';
  const company = description.replace(/\s*-\s*\d{4}/, '');

  return (
    <motion.div
      layout
      onClick={onToggle}
      className={cn(
        'relative cursor-pointer break-inside-avoid overflow-hidden group',
        'transition-opacity duration-300',
        hasExpandedCard && !isExpanded && 'opacity-40'
      )}
    >
      {/* Image */}
      <motion.div layout className='relative'>
        <Image
          src={`/assets/${image}`}
          alt={title}
          width={800}
          height={600}
          className='w-full h-auto object-cover'
        />

        {/* Hover Overlay (hidden when expanded) */}
        {!isExpanded && (
          <div
            className='absolute inset-0 bg-black/0 group-hover:bg-black/60 
                       transition-all duration-300 flex items-center justify-center'
          >
            <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center px-4'>
              <h3 className='text-xl font-semibold'>{title}</h3>
              <p className='text-sm text-white/80 mt-1'>{year}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className='bg-white dark:bg-black overflow-hidden'
          >
            <div className='p-6'>
              <h3 className='text-xl font-semibold'>{title}</h3>
              <p className='text-sm text-muted-foreground mt-1'>
                {company} &middot; {year}
              </p>
              <p className='mt-4 text-sm leading-relaxed'>{content}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
