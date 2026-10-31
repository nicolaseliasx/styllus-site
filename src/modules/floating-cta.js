export function initFloatingCta(root = document) {
  const button = root.querySelector(".whatsapp-float");
  const hero = root.querySelector("[data-hero-cta]");
  const guards = root.querySelectorAll("[data-float-guard]");
  if (!button || !hero) return;
  if (!("IntersectionObserver" in window)) {
    button.classList.add("is-visible");
    return;
  }
  let heroVisible = true;
  const visibleGuards = new Set();
  const update = () => {
    const visible = !heroVisible && visibleGuards.size === 0;
    button.classList.toggle("is-visible", visible);
    button.toggleAttribute("inert", !visible);
  };
  button.setAttribute("inert", "");
  new IntersectionObserver(
    ([entry]) => {
      heroVisible = entry.isIntersecting || entry.boundingClientRect.top > 0;
      update();
    },
    { threshold: 0.15 },
  ).observe(hero);
  const guardObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleGuards.add(entry.target);
        else visibleGuards.delete(entry.target);
      }
      update();
    },
    { threshold: 0.05 },
  );
  guards.forEach((guard) => guardObserver.observe(guard));
}
