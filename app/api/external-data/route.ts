import { NextResponse } from 'next/server';
import { getGitHubProjects } from '@/app/data/github';
import { externalKnowledge } from '@/app/data/external-knowledge';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const message = searchParams.get('message') || '';

    // Fetch GitHub projects and get relevant knowledge in parallel
    const [githubProjects] = await Promise.all([getGitHubProjects()]);

    // Format GitHub projects if available
    let githubProjectsText = '';
    if (githubProjects) {
      // Group Pokemon TCG related projects
      const ptcgProjects = githubProjects.filter(
        p =>
          p.name.toLowerCase().includes('ptcg') ||
          p.name.toLowerCase().includes('pokemon') ||
          p.name.toLowerCase().includes('tcg') ||
          p.name.toLowerCase().includes('deck') ||
          p.name.toLowerCase().includes('sim')
      );

      // Group other projects
      const otherProjects = githubProjects.filter(
        p => !ptcgProjects.includes(p)
      );

      githubProjectsText = `\nSide Projects (from GitHub):\nI've been working on a bunch of fun side projects! Most of them are Pokemon TCG related - I've built several simulators and tools like ${ptcgProjects
        .map(p => p.name)
        .join(', ')}. I've also built some other cool stuff like ${otherProjects
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
