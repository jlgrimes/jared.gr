import { NextResponse } from 'next/server';
import { getGitHubProjects } from '@/app/data/github';
import { externalKnowledge } from '@/app/data/external-knowledge';

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
    if (githubProjects) {
      // Sort projects by last updated
      const sortedProjects = [...githubProjects].sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
      });

      // Group Pokemon TCG related projects
      const ptcgProjects = sortedProjects.filter(
        p =>
          p.name.toLowerCase().includes('ptcg') ||
          p.name.toLowerCase().includes('pokemon') ||
          p.name.toLowerCase().includes('tcg') ||
          p.name.toLowerCase().includes('deck') ||
          p.name.toLowerCase().includes('sim')
      );

      // Group other projects
      const otherProjects = sortedProjects.filter(
        p => !ptcgProjects.includes(p)
      );

      // Format projects with activity context
      const projectsContext = [...ptcgProjects, ...otherProjects].map(p => ({
        name: p.name,
        activity: getProjectContext(p.updatedAt),
        description: p.description,
        url: p.url,
      }));

      githubProjectsText = `
Project Activity Context:
${projectsContext
  .map(
    p => `${p.name}: ${p.activity}${p.description ? ` - ${p.description}` : ''}`
  )
  .join('\n')}

Side Projects Summary:
I've been working on various side projects, with a focus on Pokemon TCG related tools and simulators. My Pokemon TCG projects include ${ptcgProjects
        .map(p => p.name)
        .join(
          ', '
        )}. I've also built other interesting projects like ${otherProjects
        .map(p => p.name)
        .join(', ')}.`;
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
