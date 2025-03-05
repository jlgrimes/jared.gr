import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { LinkPreview } from './LinkPreview';
import React from 'react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatMessages = ({
  messages,
  isLoading,
  containerRef,
}: ChatMessagesProps) => {
  // Debug log to see the message content
  console.log(
    'Messages:',
    messages.map(m => ({ role: m.role, content: m.content }))
  );

  return (
    <div
      ref={containerRef}
      className='flex-1 overflow-y-auto rounded-xl mb-4 p-4'
    >
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`inline-block max-w-[85%] p-3 rounded-xl ${
                message.role === 'user'
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <div className='text-sm font-mono prose dark:prose-invert max-w-none'>
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) => (
                      <LinkPreview href={href || ''}>{children}</LinkPreview>
                    ),
                    p: ({ children }) => {
                      // If the only child is a LinkPreview, return it directly
                      if (
                        React.Children.count(children) === 1 &&
                        React.isValidElement(children)
                      ) {
                        return children;
                      }
                      return <p>{children}</p>;
                    },
                    // Handle block elements
                    div: ({ children }) => <div>{children}</div>,
                    // Prevent nesting of block elements in paragraphs
                    blockquote: ({ children }) => (
                      <blockquote>{children}</blockquote>
                    ),
                    pre: ({ children }) => <pre>{children}</pre>,
                    ul: ({ children }) => <ul>{children}</ul>,
                    ol: ({ children }) => <ol>{children}</ol>,
                    li: ({ children }) => <li>{children}</li>,
                    table: ({ children }) => <table>{children}</table>,
                    thead: ({ children }) => <thead>{children}</thead>,
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => <tr>{children}</tr>,
                    th: ({ children }) => <th>{children}</th>,
                    td: ({ children }) => <td>{children}</td>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='text-left'
        >
          <div className='inline-block p-3 rounded-xl bg-gray-100 dark:bg-gray-800'>
            <div className='flex items-center gap-3'>
              <span className='text-xl'>🤔</span>
              <div className='flex gap-0.5'>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className='w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-400'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
