import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  isInputFocused: boolean;
  setIsInputFocused: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const ChatInput = ({
  input,
  setInput,
  isLoading,
  isInputFocused,
  setIsInputFocused,
  onSubmit,
  inputRef,
}: ChatInputProps) => {
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      onSubmit={onSubmit}
      className="flex gap-2"
    >
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
            setTimeout(() => {
              if (input === "") {
                setIsInputFocused(false);
              }
            }, 100);
          }}
          placeholder="Ask me anything..."
          className="w-full"
          disabled={isLoading}
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
          disabled={!input.trim() || isLoading}
          variant="outline"
          className="cursor-pointer whitespace-nowrap"
        >
          Ask
        </Button>
      </motion.div>
    </motion.form>
  );
};
