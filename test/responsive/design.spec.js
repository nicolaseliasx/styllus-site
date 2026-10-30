import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce", viewport: { width: 390, height: 650 } });

// Read the cascade in the browser, including inherited colors and alpha.
async function contrastOf(locator) {
  return locator.evaluate((element) => {
    const rgba = (value) => {
      const channels = value.match(/[\d.]+/g).map(Number);
      return [...channels.slice(0, 3), channels[3] ?? 1];
    };
    const blend = (front, back) => front.slice(0, 3).map((channel, i) =>
      channel * front[3] + back[i] * (1 - front[3]),
    );
    const layers = [];
    for (let node = element; node; node = node.parentElement)
      layers.unshift(rgba(getComputedStyle(node).backgroundColor));
    const background = layers.reduce((back, front) => blend(front, back), [255, 255, 255]);
    const foreground = blend(rgba(getComputedStyle(element).color), background);
    const luminance = (rgb) => rgb.map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    }).reduce((sum, channel, i) => sum + channel * [0.2126, 0.7152, 0.0722][i], 0);
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  });
}

test("WhatsApp flutuante tem contraste legível após herdar o tema da home", async ({ page }) => {
  await page.goto("/");
  await page.locator(".site-footer").evaluate((element) => element.scrollIntoView({ block: "end", behavior: "instant" }));
  const floating = page.locator(".whatsapp-float");
  await expect(floating).toHaveClass(/is-visible/);
  expect(await contrastOf(floating)).toBeGreaterThanOrEqual(4.5);
});

test("título e descrição da estrutura têm um único intervalo no celular", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const title = await page.locator("#structure-title").boundingBox();
  const description = await page.locator(".split-heading > p").boundingBox();
  expect(description.y - title.y - title.height).toBeLessThanOrEqual(32);
});

test("home e links compartilham acabamento e contraste das ações", async ({ page }) => {
  const treatments = [];
  for (const route of ["/", "/links/"]) {
    await page.goto(route);
    const action = page.locator("[data-whatsapp-message=trial]").first();
    expect(await contrastOf(action)).toBeGreaterThanOrEqual(4.5);
    treatments.push(await action.evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.backgroundColor, style.color, style.borderRadius, style.fontFamily,
        style.fontSize, style.letterSpacing, style.textTransform, style.boxShadow];
    }));
  }
  expect(treatments[1]).toEqual(treatments[0]);
});

test("a legenda visível acompanha a navegação manual das fotos", async ({ page }) => {
  await page.goto("/");
  const gallery = page.locator("[data-overview-gallery]");
  const caption = page.locator("[data-gallery-caption]");
  await expect(caption).toHaveText("Área de musculação");
  await gallery.locator("[data-gallery-next]").click();
  await expect(caption).toHaveText("Equipamentos Santana Fitness");
  await gallery.locator("[data-gallery-previous]").click();
  await expect(caption).toHaveText("Área de musculação");
});
