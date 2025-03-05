import { motion, AnimatePresence } from 'framer-motion';

interface ChatSuggestionsProps {
  suggestions: string[];
  isInputFocused: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatSuggestions = ({
  suggestions,
  isInputFocused,
  onSuggestionClick,
}: ChatSuggestionsProps) => {
  return (
    <AnimatePresence mode='wait'>
      {suggestions.length > 0 && isInputFocused && (
        <motion.div
          key='suggestions'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className='fixed bottom-[80px] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50'
        >
          <div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden'>
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1, delay: index * 0.05 }}
                onClick={() => onSuggestionClick(suggestion)}
                className='w-full text-left p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer font-mono'
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
