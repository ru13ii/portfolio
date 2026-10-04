import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { FORM_ENDPOINT, GITHUB_CONTENT_URL } from './src/lib/content-policy.js';

const [owner, repository] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
// GitHub Pages publishes this repository under /portfolio/; local previews use /.
const defaultSite = owner ? `https://${owner}.github.io` : 'http://localhost:4321';
const defaultBase = owner && repository && repository !== `${owner}.github.io` ? `/${repository}/` : '/';

export default defineConfig({
  site: process.env.SITE_URL || defaultSite,
  base: process.env.SITE_BASE || defaultBase,
  output: 'static',
  markdown: { syntaxHighlight: false },
  devToolbar: { enabled: false },
  // Pages cannot set custom response headers. Astro emits CSP before scripts in
  // static HTML; frame-ancestors must not be placed here (meta cannot enforce it).
  security: {
    csp: {
      directives: [
        "default-src 'self'", "base-uri 'none'", "object-src 'none'",
        `connect-src ${GITHUB_CONTENT_URL} ${FORM_ENDPOINT}`,
        `form-action ${FORM_ENDPOINT}`,
        'frame-src https://www.youtube-nocookie.com https://w.soundcloud.com',
        "img-src 'self' https:", "font-src 'self'", 'upgrade-insecure-requests',
      ],
      scriptDirective: { resources: ["'self'", { resource: "'none'", kind: 'attribute' }] },
      styleDirective: { resources: ["'self'", { resource: "'none'", kind: 'attribute' }] },
    },
  },
  vite: { plugins: [tailwindcss()] },
});
