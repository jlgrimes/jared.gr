import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  isInputFocused: boolean;
  setIsInputFocused: (focused: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
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
  const [rows, setRows] = useState(1);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      setRows(Math.min(Math.ceil(inputRef.current.scrollHeight / 24), 5));
    }
  }, [input]);

  return (
    <form onSubmit={onSubmit} className="p-4 border-t">
      <div className="relative">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder="Type a message..."
          className="w-full p-4 pr-12 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          rows={rows}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 bottom-2 p-2 text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};
