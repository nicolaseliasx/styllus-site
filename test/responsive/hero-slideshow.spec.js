import { test, expect } from "@playwright/test";

const INTERVAL = 2000;

async function openHero(page, { reducedMotion = "no-preference" } = {}) {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const photos = page.locator(".hero-photo img");
  await expect
    .poll(() => photos.evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)))
    .toBe(true);
  return { active: page.locator(".hero-photo img.is-active") };
}

test("foto do topo troca sozinha a cada 2s com fade", async ({ page }) => {
  const { active } = await openHero(page);
  await expect(active).toHaveCount(1);
  await expect(active).toHaveAttribute("src", /overview-05/);
  const fade = await active.evaluate((image) => getComputedStyle(image).transitionDuration);
  expect(parseFloat(fade)).toBeGreaterThanOrEqual(0.6);
  await page.clock.runFor(INTERVAL + 50);
  await expect(active).toHaveAttribute("src", /overview-03/);
  await page.clock.runFor(INTERVAL);
  await expect(active).toHaveAttribute("src", /overview-01/);
  await page.clock.runFor(INTERVAL);
  await expect(active).toHaveAttribute("src", /overview-05/);
});

test("fotos extras do topo não disputam prioridade com a primeira", async ({ page }) => {
  await page.goto("/");
  const photos = page.locator(".hero-photo img");
  await expect(photos.first()).toHaveAttribute("fetchpriority", "high");
  for (let i = 1; i < 3; i++) {
    await expect(photos.nth(i)).toHaveAttribute("fetchpriority", "low");
    await expect(photos.nth(i)).toHaveAttribute("aria-hidden", "true");
  }
});

test("para de trocar quando o topo sai da tela", async ({ page }) => {
  const { active } = await openHero(page);
  await page.locator("#estrutura").evaluate((element) => element.scrollIntoView({ behavior: "instant" }));
  await page.clock.runFor(INTERVAL * 3);
  await expect(active).toHaveAttribute("src", /overview-05/);
});

test("com movimento reduzido a foto do topo ainda troca a cada 2s, só com fade de opacidade", async ({ page }) => {
  const { active } = await openHero(page, { reducedMotion: "reduce" });
  await expect(active).toHaveAttribute("src", /overview-05/);
  await page.clock.runFor(INTERVAL + 50);
  await expect(active).toHaveAttribute("src", /overview-03/);
  await page.clock.runFor(INTERVAL);
  await expect(active).toHaveAttribute("src", /overview-01/);
  const fade = await active.evaluate((image) => getComputedStyle(image).transitionProperty);
  expect(fade).toBe("opacity");
});
