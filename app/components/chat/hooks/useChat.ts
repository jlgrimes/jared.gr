import { useState, useEffect } from 'react';
import { Message } from '../types';

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
      const data = await fetchChatResponse(
        'Give me a very brief introduction in exactly 4 parts, each on a new line: 1) Start with "Hi, I\'m Jared 👋", 2) My current work, 3) My notable projects, 4) Where to find me online. Keep each part under 2 sentences and use first person language.',
        [],
        false
      );
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
