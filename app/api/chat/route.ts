import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { resumeData } from '@/app/data/resume';
import { getGitHubProjects } from '@/app/data/github';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// This is your knowledge base about Jared
const KNOWLEDGE_BASE = `
Background:
- Software engineer with a focus on web development
- Experience with React, Next.js, TypeScript, and modern web technologies
- Works on building web applications and developer tools
- Keeps up with web development technologies and practices
- Born on August 12th, 2000

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
- Phone: ${resumeData.contact.phone}

Interests and Knowledge:
- Deep knowledge of Pokemon games, mechanics, and competitive play
- Extensive understanding of music theory and composition
- Fascination with technological history and random tech facts
- Strong opinions about code architecture and best practices
- Enjoys sharing interesting technical trivia and connections
- Often makes unexpected connections between different topics
- Deep understanding of advanced mathematics and mathematical concepts
- Expert knowledge of Pokemon Trading Card Game (TCG) mechanics and strategy
- Appreciates the mathematical beauty in game design and card mechanics
- Can explain complex mathematical concepts through game analogies
- Understands probability and statistics in card games and game theory
- Makes connections between mathematical principles and game mechanics

Communication Style:
- Delivers factual information directly
- Focuses on what is rather than what should be
- Uses casual language but stays neutral
- Prefers "I" statements for personal experience
- Speaks naturally with proper punctuation
- Occasionally uses exclamations for emphasis
- Friendly and approachable tone
- Makes connections that directly relate to the current topic
- Shares relevant technical facts that support the main point
- Provides detailed, specific explanations
- Has strong technical opinions backed by experience
- Explains the "why" behind decisions and preferences
- When going on tangents, always ties them back to the original topic
- Uses analogies and examples that directly illustrate the point
- Avoids random trivia or unrelated facts
- Keeps all connections and examples focused on the current discussion
- Never asks questions or seeks follow-ups from the user
- Responds to questions without asking for clarification
- Makes assumptions when needed rather than asking for details
- Provides complete information without prompting for more`;

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
21. Provides complete information without prompting for more`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { message, messages = [] } = await req.json();

    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    // Generate context-aware suggestions based on the conversation
    const generateSuggestions = (latestResponse: string) => {
      // Check if this is the initial greeting message
      const isInitialGreeting = latestResponse.includes("Hi, I'm Jared 👋");

      // For the initial greeting, always use default suggestions
      if (isInitialGreeting) {
        return [
          'What are you currently working on at Microsoft?',
          'What side projects are you working on?',
          'How much experience do you have as a software engineer?',
        ];
      }

      // Use the latest response to determine relevant follow-up questions
      if (
        latestResponse.includes('Microsoft') ||
        latestResponse.includes('Copilot')
      ) {
        return [
          "What's your favorite part about working on Copilot?",
          "What's the most challenging aspect of your role?",
          "What's the most exciting project you've worked on?",
        ];
      }

      if (
        latestResponse.includes('projects') ||
        latestResponse.includes('GitHub')
      ) {
        return [
          'Tell me more about your MI Symptoms project',
          'What technologies do you use most often?',
          "What's your favorite programming language?",
        ];
      }

      if (
        latestResponse.includes('experience') ||
        latestResponse.includes('background')
      ) {
        return [
          'What was your first programming job?',
          'How did you get started in software engineering?',
          "What's your favorite part about being a software engineer?",
        ];
      }

      // Default suggestions for new conversations
      return [
        'What are you currently working on at Microsoft?',
        'What side projects are you working on?',
        'How much experience do you have as a software engineer?',
      ];
    };

    // Start loading GitHub data in parallel
    const githubPromise = getGitHubProjects();

    // Try to get GitHub data if it's available
    let githubProjects = '';
    try {
      const projects = await githubPromise;
      if (projects) {
        // Group Pokemon TCG related projects
        const ptcgProjects = projects.filter(
          p =>
            p.name.toLowerCase().includes('ptcg') ||
            p.name.toLowerCase().includes('pokemon') ||
            p.name.toLowerCase().includes('tcg') ||
            p.name.toLowerCase().includes('deck') ||
            p.name.toLowerCase().includes('sim')
        );

        // Group other projects
        const otherProjects = projects.filter(p => !ptcgProjects.includes(p));

        githubProjects = `\nSide Projects (from GitHub):\nI've been working on a bunch of fun side projects! Most of them are Pokemon TCG related - I've built several simulators and tools like ${ptcgProjects
          .map(p => p.name)
          .join(
            ', '
          )}. I've also built some other cool stuff like ${otherProjects
          .map(p => p.name)
          .join(', ')}.`;
      }
    } catch (error) {
      console.error('Error loading GitHub projects:', error);
    }

    // Generate initial response without waiting for GitHub data
    const initialResponse = await model.generateContent(
      `${SYSTEM_PROMPT}

${githubProjects}

User message: ${message}

Previous conversation:
${messages.map((m: Message) => `${m.role}: ${m.content}`).join('\n')}

Respond as Jared's AI assistant. If asked about side projects, always provide a detailed example of one project, explaining what it does and why it's interesting.`
    );

    const response = await initialResponse.response;
    const text = response.text();

    // Return the response with GitHub data if available
    return NextResponse.json({
      response: [{ role: 'assistant', content: text }],
      suggestions: generateSuggestions(text),
      githubProjects,
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
