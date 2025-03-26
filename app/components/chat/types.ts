export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  response: Message[];
}

export interface ChatRequest {
  message: string;
  messages?: Message[];
}

export interface ChatProps {
  className?: string;
}
