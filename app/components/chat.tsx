import { useState } from 'react';
import { useExternalData } from '../hooks/useExternalData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { externalData, isLoading: isLoadingExternalData } =
    useExternalData(input);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isLoadingExternalData) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          messages,
          externalData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        ...data.response,
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-1 overflow-y-auto p-4'>
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
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className='p-4 border-t'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder='Type your message...'
            className='flex-1 p-2 border rounded-lg'
            disabled={isLoading || isLoadingExternalData}
          />
          <button
            type='submit'
            disabled={isLoading || isLoadingExternalData}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50'
          >
            {isLoading || isLoadingExternalData ? 'Loading...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
