import { useState, useEffect } from 'react';
import { Message } from '../types';
import { INITIAL_GREETING_PROMPT } from '@/app/api/chat/constants';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hasShownFollowUpSuggestions, setHasShownFollowUpSuggestions] =
    useState(false);

  const fetchChatResponse = async (
    message: string,
    messages: Message[],
    isFirstFollowUp: boolean
  ) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          messages,
          isFirstFollowUp,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);

    try {
      const data = await fetchChatResponse(
        message,
        [...messages, userMessage],
        !hasShownFollowUpSuggestions
      );
      setMessages(prev => [...prev, ...data.response]);

      if (!hasShownFollowUpSuggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setHasShownFollowUpSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInitialMessage = async () => {
    setIsLoading(true);
    try {
      const data = await fetchChatResponse(INITIAL_GREETING_PROMPT, [], false);
      setMessages(data.response);
      setSuggestions(data.suggestions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialMessage();
  }, []);

  return {
    messages,
    isLoading,
    suggestions,
    sendMessage,
  };
};
