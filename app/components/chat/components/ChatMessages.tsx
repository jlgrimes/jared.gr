import { motion, AnimatePresence } from "framer-motion";
import { Message } from "../types";
import React from "react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Debug log to see the message content
  console.log(
    "Messages:",
    messages.map((m) => ({ role: m.role, content: m.content }))
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`inline-block max-w-[85%] p-4 rounded-xl ${
                message.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
