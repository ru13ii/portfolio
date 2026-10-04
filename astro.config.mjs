import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const isVercel = process.env.VERCEL === '1';
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
// Vercel publishes at the domain root; Pages uses the repository subdirectory.
const defaultSite = isVercel && vercelDomain
  ? `https://${vercelDomain}`
  : !isVercel && owner ? `https://${owner}.github.io` : 'http://localhost:4321';
const defaultBase = !isVercel && owner && repository && repository !== `${owner}.github.io`
  ? `/${repository}/` : '/';

export default defineConfig({
  site: process.env.SITE_URL || defaultSite,
  base: process.env.SITE_BASE || defaultBase,
  output: 'static',
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
});
