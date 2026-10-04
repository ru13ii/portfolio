// Inspect only generated public artifacts, never credentials or browser storage.
import { readdir, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { checkHtml } from './html-policy.mjs';
const files = await readdir('dist', { recursive: true });
const pages = files.filter((path) => path.endsWith('.html'));
assert.equal(pages.length, 5, 'Expected all five static pages');
for (const path of files) {
  assert.ok(!/(^|\/)(\.env[^/]*|\.git|node_modules|src)(\/|$)|\.(map|pem|key)$/i.test(path), `Private/build-only artifact: ${path}`);
}
for (const path of pages) checkHtml(await readFile(`dist/${path}`, 'utf8'), path);
console.log(`Public artifact security checks passed (${pages.length} pages, ${files.length} entries).`);
