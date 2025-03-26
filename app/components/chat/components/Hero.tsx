import { motion } from "framer-motion";
import { ChatInput } from "./ChatInput";

interface HeroProps {
  input: string;
  setInput: (value: string) => void;
  isInputFocused: boolean;
  setIsInputFocused: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const Hero = ({
  input,
  setInput,
  isInputFocused,
  setIsInputFocused,
  onSubmit,
  inputRef,
}: HeroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-bold text-center"
      >
        Hi, I'm Jared 👋
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-2xl"
      >
        <ChatInput
          input={input}
          setInput={setInput}
          isInputFocused={isInputFocused}
          setIsInputFocused={setIsInputFocused}
          onSubmit={onSubmit}
          inputRef={inputRef}
        />
      </motion.div>
    </motion.div>
  );
};
