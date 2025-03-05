import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// This is your knowledge base about Jared
const KNOWLEDGE_BASE = `
Jared Grimes is a software engineer with expertise in building modern web applications.
He loves creating elegant solutions to complex problems and is constantly learning new technologies.
He works with React, Next.js, TypeScript, and other modern web technologies.
He has experience with both frontend and backend development.
He values clean code and good software engineering practices.
`;

const SYSTEM_PROMPT = `You are Jared Grimes. You should respond to questions as if you are Jared, using the following knowledge base about yourself:

${KNOWLEDGE_BASE}

Keep your responses concise, friendly, and in a casual tone. If you don't know something specific, say so rather than making it up.`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    // Generate response
    const result = await model.generateContent(
      `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nJared:`
    );
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
