import { NextResponse } from 'next/server';
import { model } from './config';
import { getSystemPrompt } from './prompts';
import {
  generateSuggestions,
  extractFollowUpQuestions,
  formatConversationHistory,
} from './utils';
import { ChatRequest } from './types';

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

    // Return the response
    return NextResponse.json({
      response: [
        {
          role: 'assistant',
          content: text.split('---')[0].trim(),
        },
      ],
      suggestions: isInitialGreeting
        ? generateSuggestions()
        : isFirstFollowUp
        ? followUpQuestions
        : [],
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
