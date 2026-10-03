export function youtubeId(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1);
    if (parsed.hostname.endsWith('youtube.com')) return parsed.searchParams.get('v') || '';
  } catch {
    return '';
  }
  return '';
}

export function mediaEmbedUrl(type, url) {
  if (type === 'youtube') {
    const id = youtubeId(url);
    return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1` : '';
  }
  if (type === 'soundcloud' && /^https:\/\//.test(url || '')) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&visual=true`;
  }
  return '';
}
