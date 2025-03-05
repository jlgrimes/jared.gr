import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface GitHubProject {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  topics: string[];
  updatedAt: string;
}

export async function getGitHubProjects(): Promise<GitHubProject[]> {
  try {
    const { data: repos } = await octokit.repos.listForUser({
      username: 'jlgrimes',
      sort: 'updated',
      per_page: 100,
    });

    return repos.map(repo => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      url: repo.html_url,
      topics: repo.topics || [],
      updatedAt: repo.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
}
