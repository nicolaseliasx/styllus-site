import { test, expect } from "@playwright/test";

const directions = /google\.com\/maps\/dir\/\?api=1&destination=R\.\+Princesa\+Isabel/;

test.use({ reducedMotion: "reduce" });

for (const viewport of [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]) {
  test(`${viewport.width}x${viewport.height} mostra o endereço com rota já na primeira tela`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const link = page.locator("[data-hero-location]");
    await expect(link).toContainText("R. Princesa Isabel, 600");
    await expect(link).toHaveAttribute("href", directions);
    await expect(link).toHaveAttribute("target", "_blank");
    const box = await link.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.y + box.height).toBeLessThanOrEqual(viewport.height);
  });
}

test("localização e horários vêm logo depois da abertura, antes da estrutura", async ({ page }) => {
  await page.goto("/");
  const order = await page.locator("main > section").evaluateAll((sections) => sections.map((s) => s.id));
  expect(order.slice(0, 3)).toEqual(["inicio", "localizacao", "estrutura"]);
  const section = page.locator("#localizacao");
  await expect(section.locator("#horarios")).toContainText("06h — 23h");
  await expect(section.getByRole("link", { name: /Como chegar/ })).toHaveAttribute("href", directions);
  await expect(section.locator(".about-map iframe")).toHaveCount(1);
});

test("menu segue a ordem da página, sem atalho duplicado de WhatsApp", async ({ page }) => {
  await page.goto("/");
  const anchors = await page.locator(".site-nav > a:not(.button)").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  expect(anchors).toEqual(["#localizacao", "#horarios", "#estrutura"]);
  await expect(page.locator(".site-nav [data-whatsapp]")).toHaveCount(1);
});

test("rodapé informa o endereço", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".site-footer")).toContainText("R. Princesa Isabel, 600");
});
