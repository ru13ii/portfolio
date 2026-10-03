import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const defaultSite = owner ? `https://${owner}.github.io` : 'http://localhost:4321';
const defaultBase = owner && repository && repository !== `${owner}.github.io`
  ? `/${repository}/`
  : '/';

export default defineConfig({
  site: process.env.SITE_URL || defaultSite,
  base: process.env.SITE_BASE || defaultBase,
  vite: { plugins: [tailwindcss()] },
});
