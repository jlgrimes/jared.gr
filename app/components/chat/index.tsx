"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessages } from "./components/ChatMessages";
import { Hero } from "./components/Hero";
import { useChat } from "./hooks/useChat";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatProps {
  className?: string;
}

export default function Chat({ className = "" }: ChatProps) {
  const [input, setInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(true);
  const [isChatStarted, setIsChatStarted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useChat();

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input after messages are updated
  useEffect(() => {
    if (messages.length > 0) {
      inputRef.current?.focus();
      setIsInputFocused(true);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    await sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${className}`}>
      {!isChatStarted ? (
        <Hero
          input={input}
          setInput={setInput}
          isInputFocused={isInputFocused}
          setIsInputFocused={setIsInputFocused}
          onSubmit={handleSubmit}
          inputRef={inputRef}
        />
      ) : (
        <ChatMessages messages={messages} containerRef={chatContainerRef} />
      )}

      {isChatStarted && (
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <motion.div
              animate={{
                width: isInputFocused ? "calc(100% - 4rem)" : "100%",
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="relative"
            >
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                  if (input === "") {
                    setIsInputFocused(false);
                  }
                }}
                placeholder="Ask me anything..."
                className="w-full"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: isInputFocused ? 1 : 0,
                width: isInputFocused ? "auto" : 0,
              }}
              transition={{
                type: isInputFocused ? "spring" : "tween",
                stiffness: 400,
                damping: 15,
                mass: 0.6,
                duration: 0.15,
              }}
              className="overflow-hidden"
            >
              <Button
                type="submit"
                disabled={!input.trim()}
                variant="outline"
                className="cursor-pointer whitespace-nowrap"
              >
                Ask
              </Button>
            </motion.div>
          </form>
        </div>
      )}
    </div>
  );
}
