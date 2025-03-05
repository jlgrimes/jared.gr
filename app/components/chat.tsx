'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  response: Message[];
  suggestions: string[];
  githubProjects?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [hasShownFollowUpSuggestions, setHasShownFollowUpSuggestions] =
    useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchInitialMessage = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message:
              'Give me a very brief introduction in exactly 4 parts, each on a new line: 1) Start with "Hi, I\'m Jared 👋", 2) My current work, 3) My notable projects, 4) Where to find me online. Keep each part under 2 sentences and use first person language.',
            messages: [],
          }),
        });

        const data: ChatResponse = await response.json();
        setMessages(data.response);
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMessage();
  }, []);

  // Separate effect to handle focus after initial message loads
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          messages: [...messages, userMessage],
          isFirstFollowUp: !hasShownFollowUpSuggestions,
        }),
      });

      const data: ChatResponse = await response.json();
      setMessages(prev => [...prev, ...data.response]);
      if (!hasShownFollowUpSuggestions) {
        setSuggestions(data.suggestions);
        setHasShownFollowUpSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: suggestion }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: suggestion,
          messages: [...messages, { role: 'user', content: suggestion }],
          isFirstFollowUp: !hasShownFollowUpSuggestions,
        }),
      });

      const data: ChatResponse = await response.json();
      setMessages(prev => [...prev, ...data.response]);
      if (!hasShownFollowUpSuggestions) {
        setSuggestions(data.suggestions);
        setHasShownFollowUpSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex-1 flex flex-col min-h-0'>
      <div
        ref={chatContainerRef}
        className='flex-1 overflow-y-auto  rounded-lg mb-4 p-4'
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
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                <p className='text-sm font-mono'>{message.content}</p>
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
            <div className='inline-block p-3 rounded-lg bg-gray-100 dark:bg-gray-800'>
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
                  onClick={() => handleSuggestionClick(suggestion)}
                  className='w-full text-left p-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer font-mono'
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        onSubmit={handleSubmit}
        className='flex gap-2'
      >
        <Input
          ref={inputRef}
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
          placeholder='Ask me anything...'
          disabled={isLoading}
          className='font-mono'
        />
        <Button
          type='submit'
          disabled={isLoading}
          variant='outline'
          className='font-mono cursor-pointer'
        >
          Ask
        </Button>
      </motion.form>
    </div>
  );
}
