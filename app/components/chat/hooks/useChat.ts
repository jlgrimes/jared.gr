import { useState } from "react";
import { Message } from "../types";

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchChatResponse = async (message: string, messages: Message[]) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          messages,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const sendMessage = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await fetchChatResponse(message, [...messages, userMessage]);
      setMessages((prev) => [...prev, ...data.response]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
};
