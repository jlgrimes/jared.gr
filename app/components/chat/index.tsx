"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatMessages } from "./components/ChatMessages";
import { Hero } from "./components/Hero";
import { ChatInput } from "./components/ChatInput";
import { useChat } from "./hooks/useChat";

const Chat = () => {
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [input, setInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { messages, isLoading, sendMessage } = useChat({
    onMessagesUpdate: () => {
      inputRef.current?.focus();
    },
  });

  useEffect(() => {
    if (isChatStarted) {
      inputRef.current?.focus();
    }
  }, [isChatStarted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!isChatStarted) {
      setIsChatStarted(true);
    }

    await sendMessage(input);
    setInput("");
    setIsInputFocused(false);
  };

  return (
    <div className="flex flex-col h-full">
      <AnimatePresence mode="wait">
        {!isChatStarted ? (
          <Hero
            key="hero"
            input={input}
            setInput={setInput}
            isInputFocused={isInputFocused}
            setIsInputFocused={setIsInputFocused}
            onSubmit={handleSubmit}
            inputRef={inputRef}
          />
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <ChatMessages messages={messages} />
            <div className="p-4 border-t">
              <ChatInput
                input={input}
                setInput={setInput}
                isInputFocused={isInputFocused}
                setIsInputFocused={setIsInputFocused}
                onSubmit={handleSubmit}
                inputRef={inputRef}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
