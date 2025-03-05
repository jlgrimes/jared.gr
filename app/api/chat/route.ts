import { NextResponse } from 'next/server';
import { model } from './config';
import { getSystemPrompt } from './prompts';
import {
  generateSuggestions,
  extractFollowUpQuestions,
  formatConversationHistory,
} from './utils';
import { ChatRequest } from './types';

const isPlaceholderSuggestion = (suggestion: string) => {
  return (
    suggestion.includes('[Question') ||
    suggestion === '[Question 1]' ||
    suggestion === '[Question 2]' ||
    suggestion === '[Question 3]'
  );
};

export async function POST(req: Request) {
  try {
    const {
      message,
      messages = [],
      externalData = { githubProjects: '', relevantKnowledge: '' },
      isFirstFollowUp = false,
    }: ChatRequest = await req.json();

    // Generate initial response
    const initialResponse = await model.generateContent(
      `${getSystemPrompt()}

${externalData.githubProjects}

${externalData.relevantKnowledge}

User message: ${message}

Previous conversation:
${formatConversationHistory(messages)}

Respond as Jared's AI assistant. If asked about side projects, always provide a detailed example of one project, explaining what it does and why it's interesting.

${
  isFirstFollowUp
    ? `After your response, on a new line, add:
---
Follow-up questions:
1. [Question 1]
2. [Question 2]
3. [Question 3]`
    : ''
}`
    );

    const response = await initialResponse.response;
    const text = response.text();

    // Check if this is the initial greeting message
    const isInitialGreeting = text.includes("Hi, I'm Jared 👋");

    // Extract follow-up questions from the response
    const followUpQuestions = extractFollowUpQuestions(text);

    // Only include suggestions if they're not placeholders
    const validSuggestions = isInitialGreeting
      ? generateSuggestions()
      : isFirstFollowUp
      ? followUpQuestions.filter(q => !isPlaceholderSuggestion(q))
      : [];

    // Return the response
    return NextResponse.json({
      response: [
        {
          role: 'assistant',
          content: text.split('---')[0].trim(),
        },
      ],
      suggestions: validSuggestions.length > 0 ? validSuggestions : [],
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
