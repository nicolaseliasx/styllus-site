import { initWhatsApp } from "./modules/whatsapp.js";

initWhatsApp();
const toggle = document.querySelector("#map-toggle");
const container = document.querySelector("#map-container");
const iframe = container?.querySelector("iframe");
if (toggle && container && iframe) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    container.hidden = open;
    iframe.tabIndex = open ? -1 : 0;
    if (!open && !iframe.getAttribute("src"))
      iframe.src = iframe.dataset.mapSrc;
    toggle
      .querySelector("span")
      ?.replaceChildren(document.createTextNode(open ? "+" : "×"));
    if (!open)
      container.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "nearest",
      });
  });
}
