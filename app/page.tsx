'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          }),
        });

        const data = await response.json();
        setMessages(data.response);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialMessage();
  }, []);

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
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, ...data.response]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col items-center mb-8'>
          <div className='relative w-16 h-16 mb-4'>
            <Image
              src='/profile.jpg'
              alt='Profile picture'
              fill
              className='rounded-full object-cover'
              priority
            />
          </div>
          <h1 className='text-2xl font-mono mb-1'>Jared Grimes</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400 font-mono'>
            Ask me anything
          </p>
        </div>

        <div className='max-w-2xl mx-auto'>
          <div className='border border-gray-200 dark:border-gray-800 rounded-lg h-[60vh] overflow-y-auto mb-4 p-4'>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <p className='text-sm font-mono'>{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className='text-left'>
                <div className='inline-block p-3 rounded-lg bg-gray-100 dark:bg-gray-800'>
                  <p className='text-sm font-mono'>Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className='flex gap-2'>
            <input
              type='text'
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Ask me anything...'
              className='flex-1 p-2 text-sm border border-gray-300 dark:border-gray-700 rounded font-mono bg-transparent'
              disabled={isLoading}
            />
            <button
              type='submit'
              disabled={isLoading}
              className='px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-mono disabled:opacity-50'
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
