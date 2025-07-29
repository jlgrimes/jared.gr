export interface RedirectGroup {
  name: string;
  description: string;
  icon: string;
  paths: string[];
  destination: string;
}

export const redirectGroups: RedirectGroup[] = [
  {
    name: 'Discord',
    description: 'Connect with me on Discord',
    icon: '🎮',
    paths: ['/discord'],
    destination: 'http://discordapp.com/users/265515383773986817',
  },
  {
    name: 'LinkedIn',
    description: 'Professional network',
    icon: '💼',
    paths: ['/linkedin', '/in'],
    destination: 'https://linkedin.com/in/jaredlgrimes',
  },
  {
    name: 'YouTube',
    description: 'Video content and tutorials',
    icon: '📺',
    paths: ['/youtube'],
    destination: 'https://youtube.com/@jgrimesey',
  },
  {
    name: 'X (Twitter)',
    description: 'Latest updates and thoughts',
    icon: '🐦',
    paths: ['/x', '/twitter'],
    destination: 'https://x.com/jgrimesey',
  },
  {
    name: 'Instagram',
    description: 'Visual content and stories',
    icon: '📸',
    paths: ['/instagram', '/insta'],
    destination: 'https://instagram.com/jaredgrimesey',
  },
  {
    name: 'GitHub',
    description: 'Code repositories and projects',
    icon: '💻',
    paths: ['/github', '/gh'],
    destination: 'https://github.com/jlgrimes',
  },
  {
    name: 'Limitless TCG',
    description: 'Pokémon TCG player profile',
    icon: '🎴',
    paths: ['/limitless'],
    destination: 'https://limitlesstcg.com/players/450',
  },
];

// Generate individual redirects for Next.js config
export const generateRedirects = () => {
  return redirectGroups.flatMap(group =>
    group.paths.map(path => ({
      source: path,
      destination: group.destination,
      permanent: true,
    }))
  );
};
