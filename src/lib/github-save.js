import { GITHUB_CONTENT_URL, assertContent } from './content-policy.js';

export function trustedEditorLocation(href, topLevel) {
  if (!topLevel) return false;
  try {
    const url = new URL(href);
    const production = url.origin === 'https://ru13ii.github.io' && /^\/portfolio\/edit\/?$/.test(url.pathname);
    const local = ['http:', 'https:'].includes(url.protocol) && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) && /^\/(?:portfolio\/)?edit\/?$/.test(url.pathname);
    return !url.username && !url.password && (production || local);
  } catch { return false; }
}
function encode(text) {
  return btoa(Array.from(new TextEncoder().encode(text), (byte) => String.fromCharCode(byte)).join(''));
}
function decode(text) {
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(text.replace(/\s/g, '')), (char) => char.charCodeAt(0)));
}
// Credentials are sent only to this repository's Contents API. Redirects fail closed.
export async function saveContent(token, content, syncedContent, request = fetch) {
  assertContent(content);
  const headers = { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' };
  const options = { headers, credentials: 'omit', redirect: 'error', cache: 'no-store', referrerPolicy: 'no-referrer' };
  const response = await request(`${GITHUB_CONTENT_URL}?ref=main`, options);
  if (!response.ok) throw new Error(`保存先を確認できませんでした（${response.status}）。トークンの権限・期限を確認してください。`);
  const current = await response.json();
  if (!current.sha || current.encoding !== 'base64' || !current.content) throw new Error('保存先のJSONを検証できませんでした。');
  const remote = JSON.parse(decode(current.content));
  if (JSON.stringify(remote) !== JSON.stringify(syncedContent)) throw new Error('GitHub上の内容が更新されています。ページを再読み込みしてから編集し直してください。');
  const saved = await request(GITHUB_CONTENT_URL, {
    ...options, method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Update RuBii portfolio content', content: encode(`${JSON.stringify(content, null, 2)}\n`), sha: current.sha, branch: 'main' }),
  });
  if (!saved.ok) throw new Error(`保存できませんでした（${saved.status}）。トークンの権限や変更の競合を確認してください。`);
}
