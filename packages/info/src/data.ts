import type { Info } from './types';

// All site content lives here. Wrappers render this — they add no facts of their own.

export const info: Info = {
  profile: {
    name: 'Jared Grimes',
    title: 'Technical Staff',
    email: 'hi@jared.gr',
    avatar: '/assets/propic.jpg',
  },

  hero: {
    greeting: "Hi, I'm Jared",
    bio: 'Interfaces are my thing. Currently building the future of human-AI interaction at Wispr.',
  },

  socials: [
    { id: 'github', name: 'GitHub', url: 'https://github.com/jlgrimes' },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/jaredlgrimes',
    },
    { id: 'x', name: 'X', url: 'https://x.com/jgrimesey' },
  ],

  skills: [
    { category: 'Languages', items: 'TypeScript, JavaScript, Rust, Python' },
    { category: 'Frameworks', items: 'React, Next.js, Node.js' },
    { category: 'UI', items: 'Fluent UI, Tailwind CSS' },
    { category: 'Tools', items: 'Git, Azure DevOps, Figma' },
  ],

  projects: [
    {
      title: 'Conch',
      company: 'Freelance',
      year: 2026,
      stack: 'Rust, OpenClaw',
      team: '',
      content:
        'Built Conch, a biologically-inspired memory engine for AI agents. Replaces flat markdown files with intelligent, self-managing storage featuring semantic search, memory decay, automatic deduplication, and graph-based context recall — all local with no API keys required.',
      image: 'conch.png',
      url: 'conch.so',
      infoUrl: 'https://github.com/jlgrimes/conch',
    },
    {
      title: 'Gen',
      company: 'Freelance',
      year: 2026,
      stack: 'Rust, React, Typescript',
      team: '',
      content:
        'Built Gen, a simplified music notation system that works like Markdown for sheet music. Write notes as letters, add rhythm markers and chords with intuitive syntax, and export to guitar tablature — all in the browser.',
      image: 'gen.png',
      url: 'gen.band',
      infoUrl: 'https://docs.gen.band',
    },
    {
      title: 'qrtz ai',
      company: 'Freelance',
      year: 2025,
      stack: 'TypeScript, Node.js',
      team: '',
      content:
        'Created qrtz, a new semantic back-end language for LLMs to communicate intent through tool calls. Enables cleaner, more structured AI-to-system interactions.',
      image: 'qrtz.png',
      url: 'neuron.qrtz.ai',
      infoUrl: '',
    },
    {
      title: 'AI Inbox',
      company: 'Microsoft Office AI',
      year: 2025,
      stack: 'React, TypeScript, Fluent UI',
      team: 'Office AI',
      content:
        'Built the "All Conversations" page in M365 Copilot, serving as the central hub for users to view and manage their Copilot interactions. Integrated with Scheduled Prompts to surface automated prompt results alongside regular conversations.',
      image: '',
      url: '',
      infoUrl: '',
    },
    {
      title: 'Copilot Scheduled Prompts',
      company: 'Microsoft Office AI',
      year: 2025,
      stack: 'React, TypeScript, Fluent UI',
      team: 'Office AI',
      content:
        'Owned the development of the Scheduled Prompts feature in M365 Copilot, allowing users to schedule prompts to be executed at a specific time. Collaborated primarily with product to ensure high shipment quality of the feature.',
      image: 'scheduled-prompts.png',
      url: '',
      infoUrl:
        'https://support.microsoft.com/en-us/topic/schedule-copilot-prompts-29dfd5fb-211a-4515-88a6-730b8074e489#:~:text=You%20can%20schedule%20Copilot%20prompts%20to%20run,To%20open%20Copilot%20and%20submit%20a%20prompt',
    },
    {
      title: 'Copilot Actions',
      company: 'Microsoft Office AI',
      year: 2024,
      stack: 'React, Typescript, Design',
      team: 'Office AI',
      content:
        'Developed the majority of the front-end UI for Copilot Actions and owned stylistic implementation app-wide - rapidly incorporating design feedback. Collaborated with localization teams, design, and product to support 20+ languages for the linguistically complex, mad-lib-style AI input for the Copilot Actions Create flow.',
      image: 'actions-web.webp',
      url: '',
      infoUrl:
        'https://www.microsoft.com/en-us/microsoft-365/blog/2024/11/19/introducing-copilot-actions-new-agents-and-tools-to-empower-it-teams/',
    },
    {
      title: 'Training Court',
      company: 'Freelance',
      year: 2024,
      stack: 'Next.js, TypeScript, Supabase',
      team: '',
      content:
        'Built Training Court, an app to track your Pokémon TCG tournaments and practice games, accruing 45K+ monthly active users and millions of games logged. Helps players log matches, analyze performance, and improve their competitive gameplay.',
      image: 'training-court.png',
      url: 'trainingcourt.app',
      infoUrl: '',
    },
    {
      title: 'Stream Copilot',
      company: 'Microsoft Office Media Group',
      year: 2023,
      stack: 'React, Typescript, Feedback',
      team: 'Office Media Group',
      content:
        'Led front-end development and integration of O365 Copilot into Microsoft Stream, giving users the ability to interact with videos with natural language. Implemented lazy loading the front-end, the interactive prompt menu UI, and the end-to-end user feedback collection system.',
      image: 'stream-copilot.png',
      url: '',
      infoUrl:
        'https://techcommunity.microsoft.com/blog/streamblog/introducing-copilot-in-microsoft-stream/3929109',
    },
    {
      title: 'Pokestats Live',
      company: 'Freelance',
      year: 2022,
      endYear: 2023,
      stack: 'Next.js, TypeScript, Supabase',
      team: '',
      content:
        'Sole developer for pokestats.live, a community-powered live tournament analytics tool for competitors of the Pokémon Trading Card Game, accruing 3M+ total impressions and 10K+ weekly active users',
      image: 'pokestats-live.png',
      url: '',
      infoUrl: '',
    },
    {
      title: 'Stream Transcripts',
      company: 'Microsoft Office Media Group',
      year: 2021,
      endYear: 2022,
      stack: 'React, Typescript',
      team: 'Office Media Group',
      content:
        "Front-end developer for Microsoft Stream's transcripts feature, a tool to help users transcribe and search through their Stream videos. Owned rollout of Transcript Edit Batching and various optimizations for accessibility.",
      image: 'transcripts.webp',
      url: '',
      infoUrl:
        'https://support.microsoft.com/en-us/office/view-edit-and-manage-video-transcripts-and-captions-3cb9acb6-05b2-4f59-a50d-7df61123aa20',
    },
    {
      title: 'MI Symptoms',
      company: 'University of Michigan + Michigan Government',
      year: 2020,
      stack: 'React, JavaScript, Firebase',
      team: '',
      content:
        'Lead developer for MI Symptoms - a free online tool to help organizations screen their members for COVID-19 symptoms, accruing 1M+ survey submissions in the State of Michigan.',
      image: 'mi-symptoms.jpg',
      url: '',
      infoUrl:
        'https://www.michigan.gov/coronavirus/news/2020/05/29/mi-symptoms-web-application-helps-michiganders-track-symptoms-informs-reopening-strategy',
    },
    {
      title: 'Amazon Business Intelligence',
      company: 'Amazon',
      year: 2020,
      endYear: 2021,
      stack: 'React, JavaScript, AWS',
      team: 'Business Intelligence',
      content:
        'Introduced suite of front-end best practices to engineers, decreasing code review turnaround time by 50%, and increasing front-end code reusability, maintainability, and scalability. Created 2020 VP-level award-winning Turismo new features notification framework to 10,000+ users, increasing new feature discoverability by 93.5%.',
      image: 'amazon.webp',
      url: '',
      infoUrl: '',
    },
    {
      title: 'Gran Turismo',
      company: 'Amazon',
      year: 2020,
      stack: 'React, Storybook',
      team: 'Business Intelligence',
      content:
        'Created the Gran Turismo design library, serving as the shared component system across the entire Business Intelligence apps suite for 10,000+ users.',
      image: 'amazon.webp',
      url: '',
      infoUrl: '',
    },
  ],

  testimonials: [
    {
      role: 'Senior Designer',
      company: 'Microsoft',
      content:
        "Jared's love for UI craftsmanship, paired with his curiosity and enthusiasm, is infectious. His energy elevates team culture and makes collaboration better.",
    },
    {
      role: 'Senior Software Engineer',
      company: 'Microsoft',
      content:
        "Jared's implementation of front-end best practices significantly improved our development workflow. His contributions to code reusability and maintainability were outstanding.",
    },
    {
      role: 'Senior UX Designer',
      company: 'Amazon',
      content:
        "Jared's ability to understand complex systems fast and contribute immediately made a huge impact. In just one sprint, he helped unblock the team and improve how we worked.",
    },
    {
      role: 'Product Manager',
      company: 'Recidiviz (from MI Symptoms)',
      content:
        'Jared brought unmatched enthusiasm and energy to every demo. He handled constant pivots, tight deadlines, and still led a large dev team through a state-wide initiative — all while balancing a separate workload. His ability to grow fast, adapt quickly, and motivate teams was exceptional.',
    },
  ],
};
