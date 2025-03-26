import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isInputFocused: boolean;
  setIsInputFocused: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  className?: string;
}

export const ChatInput = ({
  input,
  setInput,
  isInputFocused,
  setIsInputFocused,
  onSubmit,
  inputRef,
  className = "",
}: ChatInputProps) => {
  return (
    <form onSubmit={onSubmit} className={`flex gap-2 ${className}`}>
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
  );
};
