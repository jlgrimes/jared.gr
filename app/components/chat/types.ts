export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: Message[];
  suggestions: string[];
  githubProjects?: string;
}

export interface ChatProps {
  className?: string;
}
