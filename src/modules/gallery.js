export function initGallery(root = document) {
  const gallery = root.querySelector("[data-overview-gallery]");
  const dialog = root.querySelector("[data-gallery-lightbox]");
  if (!gallery) return;
  const photos = [...gallery.querySelectorAll("img")];
  const current = gallery.querySelector("[data-gallery-current]");
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
  const source = (photo) => photo.dataset.full || photo.currentSrc || photo.src;
  const show = (nextIndex) => {
    index = (nextIndex + photos.length) % photos.length;
    photos.forEach((photo, i) => {
      const active = i === index;
      photo.classList.toggle("is-active", active);
      photo.setAttribute("aria-hidden", String(!active));
    });
    if (current) current.textContent = String(index + 1).padStart(2, "0");
    if (announcement)
      announcement.textContent = `Foto ${index + 1} de ${photos.length}: ${photos[index].alt}`;
    if (dialogImage) {
      dialogImage.src = source(photos[index]);
      dialogImage.alt = photos[index].alt;
    }
  };
  previous?.addEventListener("click", () => show(index - 1));
  next?.addEventListener("click", () => show(index + 1));
  open?.addEventListener("click", () => {
    if (!dialog || !dialogImage) return;
    previousFocus = document.activeElement;
    show(index);
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
