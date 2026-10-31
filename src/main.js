import "./styles.css";
import { initWhatsApp } from "./modules/whatsapp.js";
import { initMenu } from "./modules/menu.js";
import { initGallery } from "./modules/gallery.js";
import { initMotion } from "./modules/motion.js";

initWhatsApp();
initMenu();
initGallery();
initMotion();

// The header fades in over the first pixels of scroll instead of switching at once.
const header = document.querySelector("[data-header]");
const HEADER_FADE_DISTANCE = 120;
let headerFrame = 0;
const updateHeader = () => {
  headerFrame = 0;
  if (!header) return;
  const progress = Math.min(Math.max(window.scrollY / HEADER_FADE_DISTANCE, 0), 1);
  header.style.setProperty("--header-progress", progress.toFixed(3));
  header.classList.toggle("is-scrolled", progress === 1);
};
updateHeader();
window.addEventListener(
  "scroll",
  () => {
    if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
  },
  { passive: true },
);
