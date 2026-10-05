// One policy shared by the build and editor: hand-edited JSON must pass it too.
export const FORM_ENDPOINT = 'https://formspree.io/f/meaoyqdr';
export const GITHUB_CONTENT_URL = 'https://api.github.com/repos/ru13ii/portfolio/contents/src/data/content.json';

export function httpsUrl(value) {
  if (typeof value !== 'string' || /[\s\u0000-\u001f\u007f\\]/u.test(value)) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.port ? url : null;
  } catch { return null; }
}
export function providerUrl(value, hosts) {
  const url = httpsUrl(value);
  return url && hosts.includes(url.hostname) ? url : null;
}
export function youtubeId(value) {
  const url = providerUrl(value, ['youtu.be', 'youtube.com', 'www.youtube.com', 'm.youtube.com']);
  if (!url) return '';
  const id = url.hostname === 'youtu.be' ? url.pathname.slice(1)
    : url.pathname === '/watch' ? url.searchParams.get('v')
    : /^\/(?:shorts|embed|live)\/([^/]+)\/?$/.exec(url.pathname)?.[1];
  return /^[\w-]{11}$/.test(id || '') ? id : '';
}
export function soundcloudUrl(value) {
  return providerUrl(value, ['soundcloud.com', 'www.soundcloud.com']);
}

export function validateContent(data) {
  const fail = (message) => { throw new Error(message); };
  const object = (value) => value && typeof value === 'object' && !Array.isArray(value);
  const text = (value, label, required = false) => {
    if (typeof value !== 'string' || value.length > 20000 || (required && !value.trim())) fail(`${label}: 文字列を確認してください。`);
  };
  const link = (value, label, check = httpsUrl) => {
    text(value, label);
    if (value && !check(value)) fail(`${label}: 許可されたhttps URLを入力してください。`);
  };
  try {
    if (!object(data) || !object(data.site)) fail('サイト情報の形式が正しくありません。');
    const siteFields = ['name', 'nameJa', 'role', 'heroText', 'featuredLead', 'aboutTitle', 'aboutText', 'homeContactTitle', 'homeContactText', 'worksIntro', 'aboutIntro', 'contactIntro', 'contactText'];
    for (const key of siteFields) text(data.site[key], key, key === 'name');
    // Optional for compatibility with content saved before the career feature.
    if (data.site.careerText !== undefined) text(data.site.careerText, '経歴文');
    link(data.site.youtubeUrl, 'YouTube', (v) => providerUrl(v, ['youtube.com', 'www.youtube.com', 'm.youtube.com']));
    link(data.site.soundcloudUrl, 'SoundCloud', soundcloudUrl);
    link(data.site.xUrl, 'X', (v) => providerUrl(v, ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com']));
    if (data.site.formEndpoint !== '' && data.site.formEndpoint !== FORM_ENDPOINT) fail('フォーム送信先は承認済みのFormspree URL、または空欄にしてください。');
    if (!Array.isArray(data.genres) || !data.genres.length || data.genres.length > 30) fail('ジャンル一覧を確認してください。');
    for (const genre of data.genres) text(genre, 'ジャンル', true);
    if (new Set(data.genres).size !== data.genres.length) fail('ジャンルが重複しています。');
    if (!Array.isArray(data.updates) || data.updates.length > 1000) fail('お知らせ一覧を確認してください。');
    for (const update of data.updates) {
      if (!object(update)) fail('お知らせの形式が正しくありません。');
      text(update.date, '日付');
      if (!/^\d{4}\.\d{2}\.\d{2}$/.test(update.date)) fail('日付はYYYY.MM.DD形式で入力してください。');
      text(update.text, 'お知らせ', true);
      link(update.url, 'お知らせのリンク');
    }
    if (!Array.isArray(data.works) || !data.works.length || data.works.length > 1000) fail('作品を1〜1000件登録してください。');
    const ids = new Set();
    for (const work of data.works) {
      if (!object(work)) fail('作品の形式が正しくありません。');
      for (const key of ['id', 'title', 'year', 'genre', 'role', 'usage', 'vocal', 'description']) text(work[key], key, ['id', 'title'].includes(key));
      if (!/^[a-zA-Z0-9_-]+$/.test(work.id) || ids.has(work.id)) fail('作品IDが不正、または重複しています。');
      ids.add(work.id);
      if (!data.genres.includes(work.genre)) fail(`${work.title}: ジャンルを選び直してください。`);
      if (!['youtube', 'soundcloud'].includes(work.mediaType) || typeof work.featured !== 'boolean') fail(`${work.title}: 再生先・代表曲の形式を確認してください。`);
      link(work.mediaUrl, '再生先', work.mediaType === 'youtube' ? youtubeId : soundcloudUrl);
      link(work.soundcloudUrl, 'SoundCloud', soundcloudUrl);
      link(work.coverUrl, 'サムネイル');
    }
    return '';
  } catch (error) { return error.message; }
}
export function assertContent(data) {
  const error = validateContent(data);
  if (error) throw new Error(`content.json: ${error}`);
  return data;
}
