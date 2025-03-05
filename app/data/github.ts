import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface GitHubProject {
  name: string;
  description: string | null;
  language: string | null;
  stars: number | undefined;
  url: string;
  githubUrl: string;
  topics: string[];
  updatedAt: string | null;
}

export async function getGitHubProjects(): Promise<GitHubProject[]> {
  try {
    const { data: repos } = await octokit.repos.listForUser({
      username: 'jlgrimes',
      sort: 'updated',
      per_page: 100,
    });

    return repos
      .filter(repo => (repo.size ?? 0) > 0) // Filter out empty repositories
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language || null,
        stars: repo.stargazers_count,
        url: repo.homepage || repo.html_url,
        githubUrl: repo.html_url,
        topics: repo.topics || [],
        updatedAt: repo.updated_at || null,
      }));
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
}
