// Inspect only generated public artifacts, never credentials or browser storage.
import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { FORM_ENDPOINT, GITHUB_CONTENT_URL } from '../src/lib/content-policy.js';
const files = await readdir('dist', { recursive: true });
const pages = files.filter((path) => path.endsWith('.html'));
assert.equal(pages.length, 5, 'Expected all five static pages');
for (const path of files) {
  assert.ok(!/(^|\/)(\.env[^/]*|\.git|node_modules|src)(\/|$)|\.(map|pem|key)$/i.test(path), `Private/build-only artifact: ${path}`);
}
for (const path of pages) {
  const html = await readFile(`dist/${path}`, 'utf8');
  const tag = [...html.matchAll(/<meta http-equiv="content-security-policy" content="([^"]+)"/g)].find((match) => match[1].includes('default-src'));
  assert.ok(tag, `CSP missing: ${path}`);
  const policy = tag[1];
  for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'none'", "script-src-attr 'none'", "style-src-attr 'none'", `form-action ${FORM_ENDPOINT}`, `connect-src ${GITHUB_CONTENT_URL} ${FORM_ENDPOINT}`]) assert.ok(policy.includes(directive), `${path}: ${directive}`);
  assert.ok(!/unsafe-inline|unsafe-eval/.test(policy));
  assert.ok(!/\s(?:on\w+|style)\s*=/i.test(html), `Inline handler/style: ${path}`);
  for (const script of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    assert.ok(tag.index < script.index, `Script appears before CSP: ${path}`);
    if (!/\bsrc=/.test(script[1])) {
      const hash=createHash('sha256').update(script[2]).digest('base64');
      assert.ok(policy.includes(`'sha256-${hash}'`), `Unhashed inline script: ${path}`);
    }
  }
}
console.log(`Public artifact security checks passed (${pages.length} pages, ${files.length} entries).`);
