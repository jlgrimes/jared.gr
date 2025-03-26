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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input.trim());
    setInput("");
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
