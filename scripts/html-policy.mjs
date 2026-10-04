import { parse } from 'parse5';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { FORM_ENDPOINT, GITHUB_CONTENT_URL } from '../src/lib/content-policy.js';

export function checkHtml(html, path = 'HTML') {
  // Parse as HTML, including mixed-case tags, unusual whitespace and quoted >.
  // This checks generated artifacts; it must never be used as an HTML sanitizer.
  const nodes = [];
  function visit(node) {
    nodes.push(node);
    for (const child of node.childNodes || []) visit(child);
    if (node.content) visit(node.content);
  }
  visit(parse(html, { sourceCodeLocationInfo: true }));
  const attribute = (node, name) => node.attrs?.find((attr) => attr.name === name)?.value;
  const policies = nodes.filter((node) => node.tagName === 'meta' && attribute(node, 'http-equiv')?.toLowerCase() === 'content-security-policy');
  const tag = policies.find((node) => attribute(node, 'content')?.includes('default-src'));
  assert.ok(tag && tag.parentNode.tagName === 'head', `CSP missing from head: ${path}`);
  const policy = attribute(tag, 'content');
  for (const directive of ["default-src 'self'", "object-src 'none'", "base-uri 'none'", "script-src-attr 'none'", "style-src-attr 'none'", `form-action ${FORM_ENDPOINT}`, `connect-src ${GITHUB_CONTENT_URL} ${FORM_ENDPOINT}`]) assert.ok(policy.includes(directive), `${path}: ${directive}`);
  assert.ok(!/unsafe-inline|unsafe-eval/.test(policy));
  for (const node of nodes) {
    assert.ok(!node.attrs?.some((attr) => attr.name.startsWith('on') || attr.name === 'style'), `Inline handler/style: ${path}`);
    if (node.tagName !== 'script') continue;
    assert.ok(tag.sourceCodeLocation.startOffset < node.sourceCodeLocation.startOffset, `Script appears before CSP: ${path}`);
    if (attribute(node, 'src') === undefined) {
      const text = (node.childNodes || []).map((child) => child.value || '').join('');
      const hash = createHash('sha256').update(text).digest('base64');
      assert.ok(policy.includes(`'sha256-${hash}'`), `Unhashed inline script: ${path}`);
    }
  }
  if (path.endsWith('edit/index.html')) {
    assert.ok(policies.some((node) => attribute(node, 'content') === `connect-src ${GITHUB_CONTENT_URL}; img-src 'self'; frame-src 'none'; form-action 'none'`), 'Editor needs its stricter CSP');
  }
}
