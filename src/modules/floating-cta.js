export function initFloatingCta(root = document) {
  const button = root.querySelector(".whatsapp-float");
  const hero = root.querySelector("[data-hero-cta]");
  const guard = root.querySelector("[data-float-guard]");
  if (!button || !hero) return;
  if (!("IntersectionObserver" in window)) {
    button.classList.add("is-visible");
    return;
  }
  let heroVisible = true;
  let mapVisible = false;
  const update = () => {
    const visible = !heroVisible && !mapVisible;
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
  if (guard)
    new IntersectionObserver(
      ([entry]) => {
        mapVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0.2 },
    ).observe(guard);
}
