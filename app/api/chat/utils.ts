import { Message } from "./types";

export const generateSuggestions = () => {
  return [
    "What are you currently working on at Microsoft?",
    "What side projects are you working on?",
    "How much experience do you have as a software engineer?",
  ];
};

export const extractFollowUpQuestions = (text: string) => {
  return (
    text
      .match(/---\nFollow-up questions:\n1\. (.*?)\n2\. (.*?)\n3\. (.*?)$/m)
      ?.slice(1) || []
  );
};

export const formatConversationHistory = (messages: Message[]): string => {
  return messages
    .map(
      (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
    )
    .join("\n\n");
};
