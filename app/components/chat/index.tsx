'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import { ChatMessages } from './components/ChatMessages';
import { ChatSuggestions } from './components/ChatSuggestions';
import { ChatInput } from './components/ChatInput';
import { ChatProps } from './types';

export default function Chat({ className = '' }: ChatProps) {
  const [input, setInput] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, isLoading, suggestions, sendMessage } = useChat();

  // Add effect to blur input when empty
  useEffect(() => {
    if (input === '') {
      setIsInputFocused(false);
      inputRef.current?.blur();
    }
  }, [input]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Separate effect to handle focus after initial message loads
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await sendMessage(suggestion);
  };

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${className}`}>
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        containerRef={chatContainerRef}
      />

      <ChatSuggestions
        suggestions={input.trim() === '' ? suggestions : []}
        isInputFocused={isInputFocused}
        onSuggestionClick={handleSuggestionClick}
      />

      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        isInputFocused={isInputFocused}
        setIsInputFocused={setIsInputFocused}
        onSubmit={handleSubmit}
        inputRef={inputRef}
      />
    </div>
  );
}
