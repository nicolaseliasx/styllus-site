// Cross-fades the hero photos while the hero is on screen. The first photo is
// the LCP image; the others load with low priority and join once decoded.
// Keeps running with reduced motion: it is only an opacity fade, no movement.
const INTERVAL = 2000;

export function initHeroSlideshow(root = document) {
  const frame = root.querySelector("[data-hero-slideshow]");
  if (!frame) return;
  const photos = [...frame.querySelectorAll("img")];
  if (photos.length < 2) return;
  let index = Math.max(0, photos.findIndex((photo) => photo.classList.contains("is-active")));
  let visible = true;
  let timer = 0;
  const ready = (photo) => photo.complete && photo.naturalWidth > 0;
  const advance = () => {
    // Skip photos that have not finished loading instead of fading to a blank frame.
    for (let step = 1; step < photos.length; step++) {
      const next = (index + step) % photos.length;
      if (!ready(photos[next])) continue;
      photos[index].classList.remove("is-active");
      photos[next].classList.add("is-active");
      index = next;
      return;
    }
  };
  const schedule = () => {
    clearInterval(timer);
    timer = 0;
    if (visible && !document.hidden) timer = setInterval(advance, INTERVAL);
  };
  document.addEventListener("visibilitychange", schedule);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        schedule();
      },
      { threshold: 0.25 },
    ).observe(frame);
  }
  schedule();
}
