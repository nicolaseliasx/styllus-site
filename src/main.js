import "./styles.css";
import { initWhatsApp } from "./modules/whatsapp.js";
import { initMenu } from "./modules/menu.js";
import { initGallery } from "./modules/gallery.js";
import { initFloatingCta } from "./modules/floating-cta.js";
import { initMotion } from "./modules/motion.js";

initWhatsApp();
initMenu();
initGallery();
initFloatingCta();
initMotion();

const header = document.querySelector("[data-header]");
const updateHeader = () =>
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
