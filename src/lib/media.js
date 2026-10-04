import { youtubeId, soundcloudUrl, httpsUrl } from './content-policy.js';
export { youtubeId } from './content-policy.js';

export function mediaEmbedUrl(type, url) {
  if (type === 'youtube') {
    const id = youtubeId(url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` : '';
  }
  if (type === 'soundcloud' && soundcloudUrl(url)) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&visual=true`;
  }
  return '';
}
export function allowedEmbed(value) {
  const url = httpsUrl(value);
  if (!url) return false;
  return (url.hostname === 'www.youtube-nocookie.com' && /^\/embed\/[\w-]{11}$/.test(url.pathname))
    || (url.hostname === 'w.soundcloud.com' && url.pathname === '/player/' && Boolean(soundcloudUrl(url.searchParams.get('url'))));
}
