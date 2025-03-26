"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { useChat } from "./hooks/useChat";

interface ChatProps {
  className?: string;
}

export default function Chat({ className = "" }: ChatProps) {
  const [input, setInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useChat();

  // Add effect to blur input when empty
  useEffect(() => {
    if (input === "") {
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

    await sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${className}`}>
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        containerRef={chatContainerRef}
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
