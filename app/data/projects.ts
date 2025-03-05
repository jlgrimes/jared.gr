export interface ProjectDetails {
  name: string;
  description: string;
  features: string[];
  technologies: string[];
  purpose: string;
}

export const projectDetails: Record<string, ProjectDetails> = {
  'training-court': {
    name: 'training-court',
    description:
      'A platform to consolidate tournaments and practice rounds for the Pokemon Trading Card Game',
    features: [
      'Import and visualize PTCG Live battle logs in a beautiful format',
      'Track tournament participation and game records',
      'User account persistence for game history',
      'Future analytics capabilities for practice analysis',
    ],
    technologies: ['TypeScript', 'React', 'Next.js'],
    purpose:
      'Make Pokemon TCG practice and tournament tracking as easy-to-use and accessible as possible, with the player at the forefront of design',
  },
  // Add other projects here...
};
