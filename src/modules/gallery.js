import full01 from "../../assets/overview/web/overview-01-2560.webp";
import full02 from "../../assets/overview/web/overview-02-2560.webp";
import full03 from "../../assets/overview/web/overview-03-2560.webp";
import full04 from "../../assets/overview/web/overview-04-2560.webp";
import full05 from "../../assets/overview/web/overview-05-2560.webp";

// Autoplay advances while the gallery is on screen; any manual navigation stops it.
const AUTOPLAY_INTERVAL = 5000;

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
  const autoplayToggle = gallery.querySelector("[data-gallery-autoplay]");
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
  const show = (nextIndex, { announce = true } = {}) => {
    index = (nextIndex + photos.length) % photos.length;
    photos.forEach((photo, i) => {
      const active = i === index;
      photo.classList.toggle("is-active", active);
      photo.setAttribute("aria-hidden", String(!active));
    });
    if (caption) caption.textContent = photos[index].dataset.caption || photos[index].alt;
    if (current) current.textContent = String(index + 1).padStart(2, "0");
    if (announcement && announce)
      announcement.textContent = `Foto ${index + 1} de ${photos.length}: ${photos[index].alt}`;
    if (dialog?.open) updateDialog();
  };
  const autoplay = initAutoplay();
  const navigate = (step) => {
    autoplay.stop();
    show(index + step);
  };
  previous?.addEventListener("click", () => navigate(-1));
  next?.addEventListener("click", () => navigate(1));
  open?.addEventListener("click", () => {
    if (!dialog || !dialogImage) return;
    previousFocus = document.activeElement;
    updateDialog();
    dialog.showModal();
    autoplay.schedule();
    dialog.querySelector(".gallery-lightbox-close")?.focus();
  });
  dialogPrev?.addEventListener("click", () => navigate(-1));
  dialogNext?.addEventListener("click", () => navigate(1));
  dialog
    ?.querySelector(".gallery-lightbox-close")
    ?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") navigate(-1);
    if (event.key === "ArrowRight") navigate(1);
  });
  dialog?.addEventListener("close", () => {
    previousFocus?.focus();
    autoplay.schedule();
  });
  show(index);

  function initAutoplay() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let paused = false;
    let hovering = false;
    let visible = false;
    let timer = 0;
    const enabled = Boolean(autoplayToggle) && !reduceMotion && photos.length > 1;
    const canRun = () =>
      enabled && !paused && !hovering && visible && !document.hidden && !dialog?.open;
    const schedule = () => {
      clearTimeout(timer);
      timer = 0;
      if (!canRun()) return;
      timer = setTimeout(() => {
        show(index + 1, { announce: false });
        schedule();
      }, AUTOPLAY_INTERVAL);
    };
    const setPaused = (value) => {
      paused = value;
      autoplayToggle?.classList.toggle("is-paused", paused);
      autoplayToggle?.setAttribute(
        "aria-label",
        paused ? "Retomar troca de fotos" : "Pausar troca de fotos",
      );
      schedule();
    };
    if (!enabled) return { stop() {}, schedule() {} };
    autoplayToggle.hidden = false;
    autoplayToggle.addEventListener("click", () => setPaused(!paused));
    gallery.addEventListener("mouseenter", () => {
      hovering = true;
      schedule();
    });
    gallery.addEventListener("mouseleave", () => {
      hovering = false;
      schedule();
    });
    document.addEventListener("visibilitychange", schedule);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          schedule();
        },
        { threshold: 0.5 },
      ).observe(gallery);
    } else {
      visible = true;
      schedule();
    }
    return { stop: () => setPaused(true), schedule };
  }
}
