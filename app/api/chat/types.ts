export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  messages?: Message[];
  externalData?: {
    githubProjects: string;
    relevantKnowledge: string;
  };
  isFirstFollowUp?: boolean;
}
