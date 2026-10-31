import full01 from "../../assets/overview/web/overview-01-2560.webp";
import full02 from "../../assets/overview/web/overview-02-2560.webp";
import full03 from "../../assets/overview/web/overview-03-2560.webp";
import full04 from "../../assets/overview/web/overview-04-2560.webp";
import full05 from "../../assets/overview/web/overview-05-2560.webp";

const fullPhotos = {
  "overview-01": full01,
  "overview-02": full02,
  "overview-03": full03,
  "overview-04": full04,
  "overview-05": full05,
};

export function initGallery(root = document) {
  const gallery = root.querySelector("[data-overview-gallery]");
  const dialog = root.querySelector("[data-gallery-lightbox]");
  if (!gallery) return;
  const photos = [...gallery.querySelectorAll("img")];
  if (!photos.length) return;
  const current = gallery.querySelector("[data-gallery-current]");
  const caption = root.querySelector("[data-gallery-caption]");
  const announcement = gallery.querySelector("[data-gallery-announcement]");
  const open = gallery.querySelector(".gallery-open");
  const previous = gallery.querySelector("[data-gallery-previous]");
  const next = gallery.querySelector("[data-gallery-next]");
  const dialogImage = dialog?.querySelector("img");
  const dialogPrev = dialog?.querySelector("[data-gallery-previous]");
  const dialogNext = dialog?.querySelector("[data-gallery-next]");
  let index = Math.max(
    0,
    photos.findIndex((photo) => photo.classList.contains("is-active")),
  );
  let previousFocus;
  const updateDialog = () => {
    if (!dialogImage) return;
    const photo = photos[index];
    dialogImage.src = fullPhotos[photo.dataset.photo] || photo.currentSrc || photo.src;
    dialogImage.alt = photo.alt;
  };
  const show = (nextIndex) => {
    index = (nextIndex + photos.length) % photos.length;
    photos.forEach((photo, i) => {
      const active = i === index;
      photo.classList.toggle("is-active", active);
      photo.setAttribute("aria-hidden", String(!active));
    });
    if (caption) caption.textContent = photos[index].dataset.caption || photos[index].alt;
    if (current) current.textContent = String(index + 1).padStart(2, "0");
    if (announcement)
      announcement.textContent = `Foto ${index + 1} de ${photos.length}: ${photos[index].alt}`;
    if (dialog?.open) updateDialog();
  };
  previous?.addEventListener("click", () => show(index - 1));
  next?.addEventListener("click", () => show(index + 1));
  open?.addEventListener("click", () => {
    if (!dialog || !dialogImage) return;
    previousFocus = document.activeElement;
    updateDialog();
    dialog.showModal();
    dialog.querySelector(".gallery-lightbox-close")?.focus();
  });
  dialogPrev?.addEventListener("click", () => show(index - 1));
  dialogNext?.addEventListener("click", () => show(index + 1));
  dialog
    ?.querySelector(".gallery-lightbox-close")
    ?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(index - 1);
    if (event.key === "ArrowRight") show(index + 1);
  });
  dialog?.addEventListener("close", () => previousFocus?.focus());
  show(index);
}
