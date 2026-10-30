import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initMotion(root = document) {
  gsap.registerPlugin(ScrollTrigger);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const hero = root.querySelector(".hero-copy");
  if (hero)
    gsap.from(hero, { opacity: 0, y: 20, duration: 1, ease: "power3.out" });
  root
    .querySelectorAll(
      ".section-heading,.plan,.difference-list article,.location-grid",
    )
    .forEach((element) =>
      gsap.from(element, {
        scrollTrigger: { trigger: element, start: "top 90%", once: true },
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: "power2.out",
      }),
    );
}
