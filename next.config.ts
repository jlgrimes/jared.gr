import type { NextConfig } from 'next';
import { generateRedirects } from './lib/redirects';

const nextConfig: NextConfig = {
  async redirects() {
    return generateRedirects();
  },
};

export default nextConfig;
