import { useState } from "react";
import { Message } from "../types";

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: `Hi, I'm Jared 👋 I'm a software engineer at Microsoft working on Copilot Actions. Feel free to ask me anything about my experience, projects, or tech in general!`,
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);

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

    try {
      const data = await fetchChatResponse(message, [...messages, userMessage]);
      setMessages((prev) => [...prev, ...data.response]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return {
    messages,
    sendMessage,
  };
};
