import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
        <form onSubmit={onSubmit} className="flex gap-2">
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
      </motion.div>
    </motion.div>
  );
};
