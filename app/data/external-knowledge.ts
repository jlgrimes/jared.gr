interface ExternalReference {
  topic: string;
  url: string;
  description: string;
}

export const externalKnowledge: ExternalReference[] = [
  {
    topic: 'copilot actions',
    url: 'https://www.microsoft.com/en-us/microsoft-365/blog/2024/11/19/introducing-copilot-actions-new-agents-and-tools-to-empower-it-teams/',
    description:
      'Copilot Actions in Microsoft 365 Copilot help automate everyday repetitive tasks with simple, fill-in-the-blank prompts that you can set and forget. For example, you can automatically receive a summary of your most important action items at the end of each workday, create an action to gather inputs from your team for a weekly newsletter, or automate customer meeting prep with a recurring action that summarizes your last few interactions ahead of your next sync.',
  },
];
