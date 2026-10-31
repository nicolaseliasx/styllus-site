import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

for (const viewport of [
  { width: 360, height: 640 },
  { width: 390, height: 650 },
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]) {
  test(`${viewport.width}x${viewport.height} abre com foto em tela cheia, título e ação sobre ela`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator(".hero");
    const photo = hero.locator(".hero-photo img");
    await expect(page.locator(".site-header .brand img")).toHaveAttribute("src", /styllus-lockup/);
    await expect(hero.locator("img")).toHaveCount(1);
    await expect(photo).toHaveAttribute("src", /overview-03/);
    await photo.evaluate((image) => image.decode());
    const image = await photo.boundingBox();
    const box = await hero.boundingBox();
    const title = await page.locator("h1").boundingBox();
    const cta = await page.locator("[data-hero-cta]").boundingBox();
    // A foto cobre o hero inteiro, inclusive atrás do cabeçalho transparente.
    expect(image.y).toBeLessThanOrEqual(0);
    expect(image.width).toBeGreaterThanOrEqual(viewport.width - 1);
    expect(image.y + image.height).toBeGreaterThanOrEqual(box.y + box.height - 1);
    // Título e ação ficam sobre a foto e na primeira tela.
    expect(title.y).toBeGreaterThan(image.y);
    expect(cta.y + cta.height).toBeLessThanOrEqual(Math.min(viewport.height, image.y + image.height));
    expect(cta.height).toBeGreaterThanOrEqual(44);
    await expect(page.locator(".structure")).toHaveCSS("background-color", "rgb(8, 17, 27)");
  });
}

test("cabeçalho é transparente sobre a foto e fica sólido ao rolar", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const header = page.locator(".site-header");
  await expect(header).toHaveCSS("background-color", "rgba(8, 17, 27, 0)");
  await page.locator("#estrutura").scrollIntoViewIfNeeded();
  await expect(header).toHaveClass(/is-scrolled/);
  // Translúcido com desfoque, em vez de um bloco chapado.
  await expect(header).toHaveCSS("background-color", "rgba(8, 17, 27, 0.78)");
  await expect(header).toHaveCSS("backdrop-filter", /blur/);
});

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`${viewport.width}px mantém cabeçalho e logo compactos`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const header = await page.locator(".site-header").boundingBox();
    const logo = await page.locator(".site-header .brand img").boundingBox();
    expect(header.height).toBeLessThanOrEqual(viewport.width <= 960 ? 72 : 84);
    expect(logo.height).toBeLessThanOrEqual(viewport.width <= 960 ? 52 : 60);
    expect(logo.height).toBeGreaterThanOrEqual(44);
  });
}

test("cabeçalho ganha fundo e desfoque gradualmente nos primeiros pixels de rolagem", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const header = page.locator(".site-header");
  const alpha = () =>
    header.evaluate((element) => {
      const channels = getComputedStyle(element).backgroundColor.match(/[\d.]+/g).map(Number);
      return channels[3] ?? 1;
    });
  const scrollTo = async (top) => {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(top);
  };
  expect(await alpha()).toBe(0);
  await scrollTo(60);
  await expect.poll(alpha).toBeGreaterThan(0.3);
  expect(await alpha()).toBeLessThan(0.5);
  await scrollTo(400);
  await expect.poll(alpha).toBeCloseTo(0.78, 2);
});
