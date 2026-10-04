import initialContent from '../data/content.json';

const content = structuredClone(initialContent);
let syncedContent = structuredClone(initialContent);
const workList = document.getElementById('editor-work-list');
const newsList = document.getElementById('editor-news-list');
const status = document.getElementById('editor-status');
const saveButton = document.getElementById('save-github');
let dirty = false;

function showStatus(message, isError = false) {
  status.textContent = message;
  status.style.color = isError ? '#a33b4b' : '#4d5260';
}

function markDirty() {
  dirty = true;
  showStatus('未保存の変更があります。');
}

document.querySelectorAll('[data-site-field]').forEach((input) => {
  const field = input.dataset.siteField;
  input.value = content.site[field] ?? '';
  input.addEventListener('input', () => {
    content.site[field] = input.value;
    markDirty();
  });
});

function field(labelText, fieldName, value, index, options = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = `field${options.wide ? ' field--wide' : ''}`;
  const label = document.createElement('label');
  const id = `work-${index}-${fieldName}`;
  label.htmlFor = id;
  label.textContent = labelText;
  wrapper.append(label);

  let input;
  if (options.choices) {
    input = document.createElement('select');
    options.choices.forEach((choice) => {
      const option = document.createElement('option');
      option.value = choice;
      option.textContent = choice;
      input.append(option);
    });
  } else if (options.multiline) {
    input = document.createElement('textarea');
    input.rows = 3;
  } else {
    input = document.createElement('input');
    if (options.type) input.type = options.type;
  }
  input.id = id;
  input.value = value ?? '';
  input.dataset.workIndex = String(index);
  input.dataset.workField = fieldName;
  wrapper.append(input);
  return wrapper;
}

function renderWorks() {
  workList.replaceChildren();
  content.works.forEach((work, index) => {
    const item = document.createElement('div');
    item.className = 'editor-work';
    const head = document.createElement('div');
    head.className = 'editor-work__head';
    const heading = document.createElement('h3');
    heading.textContent = `${index + 1}. ${work.title || '新しい作品'}`;
    const actions = document.createElement('div');
    actions.className = 'editor-work__actions';
    [
      ['up', '↑'],
      ['down', '↓'],
      ['remove', '削除'],
    ].forEach(([action, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.action = action;
      button.dataset.index = String(index);
      button.textContent = label;
      button.setAttribute('aria-label', `${work.title || '作品'}を${action === 'up' ? '上へ移動' : action === 'down' ? '下へ移動' : '削除'}`);
      if (action === 'up' && index === 0) button.disabled = true;
      if (action === 'down' && index === content.works.length - 1) button.disabled = true;
      actions.append(button);
    });
    head.append(heading, actions);
    item.append(head);

    const fields = document.createElement('div');
    fields.className = 'editor-fields';
    fields.append(
      field('曲名', 'title', work.title, index),
      field('制作年', 'year', work.year, index),
      field('ジャンル', 'genre', work.genre, index, { choices: content.genres }),
      field('担当（作詞・作曲など）', 'role', work.role, index),
      field('作品種別・起用先', 'usage', work.usage, index, { wide: true }),
      field('歌声合成音源・ボーカル', 'vocal', work.vocal, index),
      field('再生先の種類', 'mediaType', work.mediaType, index, { choices: ['youtube', 'soundcloud'] }),
      field('作品の説明', 'description', work.description, index, { multiline: true, wide: true }),
      field('再生先 URL', 'mediaUrl', work.mediaUrl, index, { type: 'url', wide: true }),
      field('SoundCloudの曲 URL（任意）', 'soundcloudUrl', work.soundcloudUrl, index, { type: 'url', wide: true }),
      field('サムネイル画像 URL', 'coverUrl', work.coverUrl, index, { type: 'url', wide: true }),
    );
    item.append(fields);

    const featureLabel = document.createElement('label');
    featureLabel.className = 'editor-check';
    featureLabel.style.marginTop = '20px';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = Boolean(work.featured);
    checkbox.dataset.featuredIndex = String(index);
    featureLabel.append(checkbox, document.createTextNode('トップページの代表曲にする'));
    item.append(featureLabel);
    workList.append(item);
  });
}

function renderUpdates() {
  newsList.replaceChildren();
  content.updates.forEach((update, index) => {
    const item = document.createElement('div');
    item.className = 'editor-news';
    const head = document.createElement('div');
    head.className = 'editor-news__head';
    const heading = document.createElement('h3');
    heading.textContent = `${index + 1}. ${update.text || '新しいお知らせ'}`;
    const remove = document.createElement('button');
    remove.className = 'editor-secondary';
    remove.type = 'button';
    remove.textContent = '削除';
    remove.dataset.removeUpdate = String(index);
    head.append(heading, remove);
    const fields = document.createElement('div');
    fields.className = 'editor-fields';
    [
      ['日付（YYYY.MM.DD）', 'date', update.date],
      ['内容', 'text', update.text],
      ['リンク URL（任意）', 'url', update.url],
    ].forEach(([labelText, key, value]) => {
      const wrapper = document.createElement('div');
      wrapper.className = `field${key === 'url' ? ' field--wide' : ''}`;
      const label = document.createElement('label');
      const id = `update-${index}-${key}`;
      label.htmlFor = id;
      label.textContent = labelText;
      const input = document.createElement('input');
      input.id = id;
      input.value = value ?? '';
      input.dataset.updateIndex = String(index);
      input.dataset.updateField = key;
      if (key === 'url') input.type = 'url';
      wrapper.append(label, input);
      fields.append(wrapper);
    });
    item.append(head, fields);
    newsList.append(item);
  });
}

newsList.addEventListener('input', (event) => {
  const input = event.target.closest('[data-update-field]');
  if (!input) return;
  const index = Number(input.dataset.updateIndex);
  content.updates[index][input.dataset.updateField] = input.value;
  if (input.dataset.updateField === 'text') {
    input.closest('.editor-news').querySelector('h3').textContent = `${index + 1}. ${input.value || '新しいお知らせ'}`;
  }
  markDirty();
});

newsList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-remove-update]');
  if (!button) return;
  content.updates.splice(Number(button.dataset.removeUpdate), 1);
  renderUpdates();
  markDirty();
});

document.getElementById('add-update').addEventListener('click', () => {
  content.updates.unshift({ date: new Date().toISOString().slice(0, 10).replaceAll('-', '.'), text: '', url: '' });
  renderUpdates();
  markDirty();
});

workList.addEventListener('input', (event) => {
  const input = event.target.closest('[data-work-field]');
  if (!input) return;
  const index = Number(input.dataset.workIndex);
  content.works[index][input.dataset.workField] = input.value;
  if (input.dataset.workField === 'title') {
    input.closest('.editor-work').querySelector('h3').textContent = `${index + 1}. ${input.value || '新しい作品'}`;
  }
  markDirty();
});

workList.addEventListener('change', (event) => {
  const input = event.target;
  if (input.matches('[data-work-field]')) {
    content.works[Number(input.dataset.workIndex)][input.dataset.workField] = input.value;
    markDirty();
  }
  if (input.matches('[data-featured-index]')) {
    const index = Number(input.dataset.featuredIndex);
    content.works.forEach((work, workIndex) => { work.featured = input.checked && workIndex === index; });
    if (!input.checked && content.works[0]) content.works[0].featured = true;
    renderWorks();
    markDirty();
  }
});

workList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const index = Number(button.dataset.index);
  if (button.dataset.action === 'remove') content.works.splice(index, 1);
  if (button.dataset.action === 'up' && index > 0) [content.works[index - 1], content.works[index]] = [content.works[index], content.works[index - 1]];
  if (button.dataset.action === 'down' && index < content.works.length - 1) [content.works[index + 1], content.works[index]] = [content.works[index], content.works[index + 1]];
  if (content.works.length && !content.works.some((work) => work.featured)) content.works[0].featured = true;
  renderWorks();
  markDirty();
});

document.getElementById('add-work').addEventListener('click', () => {
  content.works.push({
    id: `work-${crypto.randomUUID().slice(0, 8)}`,
    title: '', year: '', genre: content.genres[0], role: '', usage: 'オリジナル楽曲',
    vocal: '', description: '', mediaType: 'soundcloud', mediaUrl: '', soundcloudUrl: '', coverUrl: '', featured: content.works.length === 0,
  });
  renderWorks();
  markDirty();
  workList.lastElementChild?.scrollIntoView({ behavior: 'auto', block: 'center' });
});

function validate() {
  const hostname = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.hostname : '';
    } catch {
      return '';
    }
  };
  if (!content.site.name.trim()) return '活動名義を入力してください。';
  for (const update of content.updates) {
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(update.date)) return 'お知らせの日付はYYYY.MM.DDの形式で入力してください。';
    if (!update.text.trim()) return 'お知らせの内容を入力してください。';
    if (update.url && !hostname(update.url)) return 'お知らせのリンクには正しいhttps://のURLを入力してください。';
  }
  if (!content.works.length) return '作品を1件以上登録してください。';
  for (const work of content.works) {
    if (!work.title.trim()) return 'すべての作品に曲名を入力してください。';
    if (!content.genres.includes(work.genre)) return `${work.title}: ジャンルを選び直してください。`;
    for (const key of ['mediaUrl', 'soundcloudUrl', 'coverUrl']) {
      if (work[key] && !hostname(work[key])) return `${work.title}: 正しいhttps://のURLを入力してください。`;
    }
    if (work.soundcloudUrl) {
      const host = hostname(work.soundcloudUrl);
      if (host !== 'soundcloud.com' && !host.endsWith('.soundcloud.com')) return `${work.title}: SoundCloudのURLを確認してください。`;
    }
    if (work.mediaUrl) {
      const host = hostname(work.mediaUrl);
      const validYouTube = work.mediaType === 'youtube' && (host === 'youtu.be' || host === 'youtube.com' || host.endsWith('.youtube.com'));
      const validSoundCloud = work.mediaType === 'soundcloud' && (host === 'soundcloud.com' || host.endsWith('.soundcloud.com'));
      if (!validYouTube && !validSoundCloud) return `${work.title}: 再生先の種類とURLを合わせてください。`;
    }
  }
  for (const key of ['youtubeUrl', 'soundcloudUrl', 'xUrl', 'formEndpoint']) {
    if (content.site[key] && !hostname(content.site[key])) return `${key}には正しいhttps://のURLを入力してください。`;
  }
  return '';
}

function jsonText() {
  return `${JSON.stringify(content, null, 2)}\n`;
}

document.getElementById('download-json').addEventListener('click', () => {
  const error = validate();
  if (error) return showStatus(error, true);
  const url = URL.createObjectURL(new Blob([jsonText()], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'content.json';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showStatus('JSONを書き出しました。');
});

function toBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}

function fromBase64(text) {
  const binary = atob(text.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

saveButton.addEventListener('click', async () => {
  const error = validate();
  if (error) return showStatus(error, true);
  const owner = document.getElementById('github-owner').value.trim();
  const repo = document.getElementById('github-repo').value.trim();
  const tokenInput = document.getElementById('github-token');
  const token = tokenInput.value.trim();
  if (!/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo) || !token) {
    return showStatus('GitHubユーザー名、リポジトリ名、トークンを入力してください。', true);
  }
  saveButton.disabled = true;
  showStatus('GitHub上のファイルを確認しています…');
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/src/data/content.json`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
  try {
    const currentResponse = await fetch(url, { headers });
    if (!currentResponse.ok) throw new Error(`保存先を確認できませんでした（${currentResponse.status}）。リポジトリ名と権限を確認してください。`);
    const current = await currentResponse.json();
    if (!current.sha) throw new Error('保存先のJSONが見つかりませんでした。');
    if (current.content) {
      const remoteContent = JSON.parse(fromBase64(current.content));
      if (JSON.stringify(remoteContent) !== JSON.stringify(syncedContent)) {
        throw new Error('GitHub上の内容が更新されています。ページを再読み込みしてから編集し直してください。');
      }
    }
    showStatus('GitHubに保存しています…');
    const saveResponse = await fetch(url, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update RuBii portfolio content',
        content: toBase64(jsonText()),
        sha: current.sha,
      }),
    });
    if (!saveResponse.ok) throw new Error(`保存できませんでした（${saveResponse.status}）。トークンの権限や変更の競合を確認してください。`);
    syncedContent = structuredClone(content);
    dirty = false;
    showStatus('保存しました。公開サイトへの反映には数分かかる場合があります。');
    tokenInput.value = '';
  } catch (cause) {
    showStatus(cause instanceof Error ? cause.message : '保存できませんでした。', true);
  } finally {
    saveButton.disabled = false;
  }
});

window.addEventListener('beforeunload', (event) => {
  if (!dirty) return;
  event.preventDefault();
  event.returnValue = '';
});

renderWorks();
renderUpdates();
