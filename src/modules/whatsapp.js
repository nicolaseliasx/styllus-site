import { whatsappUrl } from "../config/site.js";

export function initWhatsApp(root = document) {
  root.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = whatsappUrl(link.dataset.whatsappMessage || "general");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}
