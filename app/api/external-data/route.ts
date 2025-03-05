import { NextResponse } from 'next/server';
import { getGitHubProjects } from '@/app/data/github';
import { externalKnowledge } from '@/app/data/external-knowledge';
import { projectDetails } from '@/app/data/projects';

const getProjectContext = (dateString: string | null) => {
  if (!dateString) return 'inactive';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil(
    Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 7) return 'very active';
  if (diffDays < 30) return 'active';
  if (diffDays < 90) return 'somewhat active';
  if (diffDays < 365) return 'occasionally maintained';
  return 'inactive';
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const message = searchParams.get('message') || '';

    // Always fetch GitHub projects
    const [githubProjects] = await Promise.all([getGitHubProjects()]);

    // Format GitHub projects if available
    let githubProjectsText = '';
    if (githubProjects.length > 0) {
      githubProjectsText = 'Here are some of my projects:\n\n';

      for (const project of githubProjects) {
        const details = projectDetails[project.name];
        const activity = getProjectContext(project.updatedAt);

        githubProjectsText += `${project.name} (${activity}): `;

        if (details) {
          githubProjectsText += `${details.description}. `;
          githubProjectsText += `Key features include ${details.features.join(
            ', '
          )}. `;
          githubProjectsText += `Built with ${details.technologies.join(
            ', '
          )}. `;
          githubProjectsText += `Purpose: ${details.purpose}. `;
        } else {
          githubProjectsText += `${
            project.description || 'No description available'
          }. `;
        }

        if (project.topics.length > 0) {
          githubProjectsText += `Topics: ${project.topics.join(', ')}. `;
        }

        githubProjectsText += `\n\n`;
      }
    }

    // Get relevant knowledge
    const relevantKnowledge = externalKnowledge
      .filter(knowledge =>
        message.toLowerCase().includes(knowledge.topic.toLowerCase())
      )
      .map(
        knowledge =>
          `Topic: ${knowledge.topic}\nDescription: ${knowledge.description}\nReference: ${knowledge.url}`
      )
      .join('\n\n');

    return NextResponse.json({
      githubProjects: githubProjectsText,
      relevantKnowledge: relevantKnowledge
        ? `\nRelevant External Knowledge:\n${relevantKnowledge}`
        : '',
    });
  } catch (error) {
    console.error('Error fetching external data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external data' },
      { status: 500 }
    );
  }
}
