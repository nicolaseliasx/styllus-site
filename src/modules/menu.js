export function initMenu(root = document) {
  const toggle = root.querySelector("[data-menu-toggle]");
  const nav = root.querySelector("[data-nav]");
  if (!toggle || !nav) return;
  const links = [...nav.querySelectorAll("a")];
  const close = (restore = false) => {
    nav.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
    if (restore) toggle.focus();
  };
  toggle.addEventListener("click", () => {
    if (toggle.getAttribute("aria-expanded") === "true") {
      close();
      return;
    }
    nav.classList.add("is-open");
    toggle.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    document.body.classList.add("menu-open");
    window.setTimeout(() => links[0]?.focus(), 120);
  });
  links.forEach((link) => link.addEventListener("click", () => close()));
  document.addEventListener("keydown", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (event.key === "Escape") close(true);
    if (event.key !== "Tab") return;
    const focusable = [toggle, ...links];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) close();
  });
}
