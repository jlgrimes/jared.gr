import { NextResponse } from 'next/server';
import { model } from './config';
import { getSystemPrompt } from './prompts';
import {
  generateSuggestions,
  extractFollowUpQuestions,
  formatConversationHistory,
} from './utils';
import { ChatRequest } from './types';
import { INITIAL_GREETING_PROMPT } from './constants';
import { getGitHubProjects } from '@/app/data/github';

const isPlaceholderSuggestion = (suggestion: string) => {
  return (
    suggestion.includes('[Question') ||
    suggestion === '[Question 1]' ||
    suggestion === '[Question 2]' ||
    suggestion === '[Question 3]'
  );
};

const isProjectRelatedQuestion = (message: string) => {
  const projectKeywords = [
    'project',
    'built',
    'working on',
    'develop',
    'create',
    'made',
    'portfolio',
    'github',
    'repo',
    'code',
    'programming',
    'side project',
    'hobby',
    'pokemon',
    'tcg',
    'simulator',
  ];
  return projectKeywords.some(keyword =>
    message.toLowerCase().includes(keyword.toLowerCase())
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

    // Only fetch GitHub data for project-related questions that aren't the initial greeting
    let githubData = externalData.githubProjects;
    let projectUrls = '';

    if (
      message !== INITIAL_GREETING_PROMPT &&
      isProjectRelatedQuestion(message) &&
      !githubData
    ) {
      const response = await fetch(
        `${req.headers.get(
          'origin'
        )}/api/external-data?message=${encodeURIComponent(message)}`
      );
      const data = await response.json();
      githubData = data.githubProjects;

      // Get project URLs for the prompt
      const projects = await getGitHubProjects();
      projectUrls = projects.map(p => `${p.name}: ${p.url}`).join('\n');
    }

    // Generate initial response
    const initialResponse = await model.generateContent(
      `${getSystemPrompt()}

${githubData}

${projectUrls ? `\nProject GitHub URLs:\n${projectUrls}\n` : ''}

${externalData.relevantKnowledge}

User message: ${message}

Previous conversation:
${formatConversationHistory(messages)}

Respond as Jared's AI assistant. When mentioning GitHub projects, always format the project name as a markdown link using the project's GitHub URL. For example, instead of writing "training-court", write "[training-court](https://github.com/username/training-court)". This makes it easy for users to click through to the actual repository.

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

    // Debug log to see the response content
    console.log('Response text:', text);

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

    // Process the response text to ensure markdown links are preserved
    const processedText = text.split('---')[0].trim().replace(/\n/g, '  \n'); // Add two spaces before newlines to preserve line breaks

    // Return the response
    return NextResponse.json({
      response: [
        {
          role: 'assistant',
          content: processedText,
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
