import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'http://discordapp.com/users/265515383773986817',
        permanent: true,
      },
      {
        source: '/linkedin',
        destination: 'https://linkedin.com/in/jaredlgrimes',
        permanent: true,
      },
      {
        source: '/in',
        destination: 'https://linkedin.com/in/jaredlgrimes',
        permanent: true,
      },
      {
        source: '/youtube',
        destination: 'https://youtube.com/@jgrimesey',
        permanent: true,
      },
      {
        source: '/twitter',
        destination: 'https://x.com/jgrimesey',
        permanent: true,
      },
      {
        source: '/x',
        destination: 'https://x.com/jgrimesey',
        permanent: true,
      },
      {
        source: '/insta',
        destination: 'https://instagram.com/jaredgrimesey',
        permanent: true,
      },
      {
        source: '/instagram',
        destination: 'https://instagram.com/jaredgrimesey',
        permanent: true,
      },
      {
        source: '/github',
        destination: 'https://github.com/jlgrimes',
        permanent: true,
      },
      {
        source: '/gh',
        destination: 'https://github.com/jlgrimes',
        permanent: true,
      },
      {
        source: '/limitless',
        destination: 'https://limitlesstcg.com/players/450',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
