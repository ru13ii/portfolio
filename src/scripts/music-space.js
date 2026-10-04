// Ambient notes run by default on capable desktop devices; mobile stays static.
const capable = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const room = document.querySelector('.music-room');

// Only suspend notes when their scene or tab cannot be seen. No interaction particles.
let observer;
function configureMotion() {
  observer?.disconnect();
  if (!room || !capable.matches) return;
  observer = new IntersectionObserver(([entry]) => room.classList.toggle('is-offscreen', !entry.isIntersecting), { threshold: 0 });
  observer.observe(room);
}
capable.addEventListener('change', configureMotion);
document.addEventListener('visibilitychange', () => {
  document.documentElement.classList.toggle('page-asleep', document.hidden);
});
configureMotion();
