import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Static export for Cloudflare Pages
  output: 'export',

  // Required for Cloudflare Pages static hosting
  trailingSlash: true,

  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },

  // Page extensions
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // This repo lives in a nested folder; pin the tracing root to avoid
  // Next.js guessing the workspace root from sibling lockfiles.
  outputFileTracingRoot: path.join(__dirname),

  // Strict mode
  reactStrictMode: true,
}

export default nextConfig
