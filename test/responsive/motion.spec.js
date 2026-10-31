import { test, expect } from "@playwright/test";

test("movimento reduzido deixa conteúdo visível sem autoplay", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".site-header .brand img")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("[data-hero-cta]")).toBeVisible();
  await expect(page.locator(".gallery-track img.is-active")).toHaveCount(1);
});

test("conteúdo permanece acessível após navegação", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  await page.locator(".differences").scrollIntoViewIfNeeded();
  await expect(page.locator(".difference-list")).toBeVisible();
});

test.describe("movimento padrão", () => {
  test.use({ contextOptions: { reducedMotion: "no-preference" } });

  test("hero e seção revelada terminam visíveis", async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/");
    await page.waitForTimeout(1100);
    await expect(page.locator(".hero-copy")).toBeVisible();
    await page.locator(".differences").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await expect(page.locator(".difference-list article").first()).toHaveCSS(
      "opacity",
      "1",
    );
  });
});
