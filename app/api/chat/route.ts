import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { resumeData } from '@/app/data/resume';
import { knowledgeData } from '@/app/data/knowledge';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// This is your knowledge base about Jared
const KNOWLEDGE_BASE = `
Background:
${knowledgeData.background.map((item: string) => `- ${item}`).join('\n')}

Technical Experience:
${resumeData.experience
  .map(
    exp => `
- ${exp.title} at ${exp.company} (${exp.period})
  ${exp.achievements.map(achievement => `  * ${achievement}`).join('\n')}
`
  )
  .join('\n')}

Projects:
${resumeData.projects
  .map(
    project => `
- ${project.name} (${project.role})
  * ${project.description}
  * Technologies: ${project.technologies.join(', ')}
`
  )
  .join('\n')}

Education:
- ${resumeData.education.degree} from ${resumeData.education.school} (${
  resumeData.education.period
})
- Minors in ${resumeData.education.minors.join(' and ')}

Skills:
${resumeData.skills.join(', ')}

Contact:
- LinkedIn: ${resumeData.contact.linkedin}
- GitHub: ${resumeData.contact.github}
- Email: ${resumeData.contact.email}

Interests and Knowledge:
${knowledgeData.interests.map((item: string) => `- ${item}`).join('\n')}

Communication Style:
${knowledgeData.communicationStyle
  .map((item: string) => `- ${item}`)
  .join('\n')}`;

const SYSTEM_PROMPT = `You are Jared Grimes. Respond to questions as if you're having a casual conversation. Here's how to act:

Current Context:
- Current date: ${new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})}
- Current time: ${new Date().toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
})}
- Current year: ${new Date().getFullYear()}
- Birth date: August 12th, 2000

${KNOWLEDGE_BASE}

Guidelines for responses:
1. Focus on facts and direct information
2. Have strong technical opinions backed by experience
3. Use casual language but stay neutral
4. If you don't know something, just say so
5. Use contractions (I'm, don't, etc.)
6. Keep responses short and to the point
7. Don't use bullet points or formal formatting
8. Don't apologize or be overly polite
9. Don't use phrases like "I'd be happy to" or "I'm excited to"
10. Use proper punctuation and mixed case
11. Use exclamations occasionally for emphasis
12. Keep it friendly and conversational
13. Keep it flowing and natural like spoken conversation
14. Stay focused on the user's question
15. Share relevant technical facts that support the main point
16. Provide detailed explanations for your opinions
17. Keep responses focused and coherent
18. Never asks questions or seeks follow-ups from the user
19. Responds to questions without asking for clarification
20. Makes assumptions when needed rather than asking for details
21. Provides complete information without prompting for more
22. Use information from external sources when available, but don't explicitly cite them
23. NEVER make assumptions or claims about topics not covered in your knowledge base or external sources - if you don't have information about something, say "I don't have information about that"`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const {
      message,
      messages = [],
      externalData = { githubProjects: '', relevantKnowledge: '' },
    } = await req.json();

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    // Generate context-aware suggestions based on the conversation
    const generateSuggestions = () => {
      return [
        'What are you currently working on at Microsoft?',
        'What side projects are you working on?',
        'How much experience do you have as a software engineer?',
      ];
    };

    // Generate initial response
    const initialResponse = await model.generateContent(
      `${SYSTEM_PROMPT}

${externalData.githubProjects}

${externalData.relevantKnowledge}

User message: ${message}

Previous conversation:
${messages.map((m: Message) => `${m.role}: ${m.content}`).join('\n')}

Respond as Jared's AI assistant. If asked about side projects, always provide a detailed example of one project, explaining what it does and why it's interesting.

After your response, on a new line, add:
---
Follow-up questions:
1. [Question 1]
2. [Question 2]
3. [Question 3]`
    );

    const response = await initialResponse.response;
    const text = response.text();

    // Check if this is the initial greeting message
    const isInitialGreeting = text.includes("Hi, I'm Jared 👋");

    // Extract follow-up questions from the response
    const followUpQuestions =
      text
        .match(/---\nFollow-up questions:\n1\. (.*?)\n2\. (.*?)\n3\. (.*?)$/m)
        ?.slice(1) || [];

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
        : followUpQuestions,
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
