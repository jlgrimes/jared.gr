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
  const { messages, sendMessage } = useChat();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${className}`}>
      <ChatMessages messages={messages} containerRef={chatContainerRef} />

      <ChatInput
        input={input}
        setInput={setInput}
        isInputFocused={isInputFocused}
        setIsInputFocused={setIsInputFocused}
        onSubmit={handleSubmit}
        inputRef={inputRef}
      />
    </div>
  );
}
