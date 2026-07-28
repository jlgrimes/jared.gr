import path from 'path';
import type { NextConfig } from 'next';
// Relative import (not '@jared/info') so Next's config loader can transpile it —
// node_modules imports in next.config are require()d untranspiled at runtime.
import { generateRedirects } from '../../packages/info/src/redirects';

const nextConfig: NextConfig = {
  // Monorepo root (a stray lockfile in a parent dir makes Next guess wrong otherwise)
  turbopack: {
    root: path.join(__dirname, '../..'),
  },
  transpilePackages: ['@jared/info', '@wrapper/windows'],
  async redirects() {
    return generateRedirects();
  },
};

export default nextConfig;
