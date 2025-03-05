import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      className='flex gap-2'
    >
      <motion.div
        animate={{
          width: isInputFocused ? 'calc(100% - 4rem)' : '100%',
        }}
        className='relative'
      >
        <Input
          ref={inputRef}
          type='text'
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            if (input === '') {
              setIsInputFocused(false);
            }
          }}
          placeholder='Ask me anything...'
          className='w-full font-mono'
          disabled={isLoading}
        />
      </motion.div>
      <motion.div
        animate={{
          opacity: isInputFocused ? 1 : 0,
          width: isInputFocused ? '4rem' : '0',
        }}
        className='overflow-hidden'
      >
        <Button
          type='submit'
          disabled={!input.trim() || isLoading}
          className='w-full font-mono'
        >
          Send
        </Button>
      </motion.div>
    </motion.form>
  );
};
