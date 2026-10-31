import { test, expect } from "@playwright/test";

const INTERVAL = 5000;

async function openAtGallery(page, { reducedMotion = "no-preference" } = {}) {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const gallery = page.locator("[data-overview-gallery]");
  return {
    gallery,
    caption: page.locator("[data-gallery-caption]"),
    toggle: gallery.locator("[data-gallery-autoplay]"),
    scrollIn: () =>
      gallery.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" })),
  };
}

test("fotos trocam sozinhas com fade enquanto a galeria está na tela", async ({ page }) => {
  const { gallery, caption, scrollIn } = await openAtGallery(page);
  // Fora da tela, não troca.
  await page.clock.runFor(INTERVAL * 2);
  await expect(caption).toHaveText("Área de musculação");
  await scrollIn();
  await page.clock.runFor(INTERVAL + 100);
  await expect(caption).toHaveText("Equipamentos Santana Fitness");
  await expect(gallery.locator("img.is-active")).toHaveAttribute("data-photo", "overview-02");
  const fade = await gallery.locator("img").first().evaluate((image) => getComputedStyle(image).transitionDuration);
  expect(parseFloat(fade)).toBeGreaterThanOrEqual(0.6);
  // A troca automática não fica anunciando cada foto para leitor de tela.
  await expect(gallery.locator("[data-gallery-announcement]")).not.toContainText("Foto 2");
});

test("botão pausa e retoma a troca automática", async ({ page }) => {
  const { caption, toggle, scrollIn } = await openAtGallery(page);
  await scrollIn();
  await expect(toggle).toHaveAccessibleName("Pausar troca de fotos");
  await toggle.click();
  await expect(toggle).toHaveAccessibleName("Retomar troca de fotos");
  await page.clock.runFor(INTERVAL * 3);
  await expect(caption).toHaveText("Área de musculação");
  await toggle.click();
  await expect(toggle).toHaveAccessibleName("Pausar troca de fotos");
  // Com o mouse ainda sobre a galeria a foto fica parada; ao sair, a troca volta.
  await page.mouse.move(2, 2);
  await page.clock.runFor(INTERVAL + 100);
  await expect(caption).toHaveText("Equipamentos Santana Fitness");
});

test("navegação manual assume o controle e para a troca automática", async ({ page }) => {
  const { gallery, caption, toggle, scrollIn } = await openAtGallery(page);
  await scrollIn();
  await gallery.locator("[data-gallery-next]").click();
  await expect(caption).toHaveText("Equipamentos Santana Fitness");
  await expect(toggle).toHaveAccessibleName("Retomar troca de fotos");
  await page.clock.runFor(INTERVAL * 3);
  await expect(caption).toHaveText("Equipamentos Santana Fitness");
});

test("passar o mouse sobre a galeria segura a foto atual", async ({ page }) => {
  const { gallery, caption, scrollIn } = await openAtGallery(page);
  await scrollIn();
  await gallery.hover();
  await page.clock.runFor(INTERVAL * 2);
  await expect(caption).toHaveText("Área de musculação");
  await page.mouse.move(2, 2);
  await page.clock.runFor(INTERVAL + 100);
  await expect(caption).toHaveText("Equipamentos Santana Fitness");
});

test.describe("com movimento reduzido", () => {
  test("não troca sozinha e esconde o botão de pausa", async ({ page }) => {
    const { caption, toggle, scrollIn } = await openAtGallery(page, { reducedMotion: "reduce" });
    await scrollIn();
    await page.clock.runFor(INTERVAL * 3);
    await expect(caption).toHaveText("Área de musculação");
    await expect(toggle).toBeHidden();
  });
});
