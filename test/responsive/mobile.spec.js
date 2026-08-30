import { test, expect } from "@playwright/test";

for (const viewport of [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  test(`${viewport.width}px mantém conversão, toque e sem overflow`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    await expect(page.locator("[data-hero-cta]")).toBeVisible();
    const lockup = await page.locator(".hero-lockup").boundingBox();
    expect(lockup.width).toBeGreaterThanOrEqual(120);
    const cta = await page.locator("[data-hero-cta]").boundingBox();
    expect(cta.height).toBeGreaterThanOrEqual(44);
    expect(cta.y + cta.height).toBeLessThanOrEqual(viewport.height);
    const undersizedTargets = await page
      .locator("a[href], button")
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const style = getComputedStyle(element);
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              Number(style.opacity) > 0.1
            );
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              label: element.getAttribute("aria-label") || element.textContent,
              width: rect.width,
              height: rect.height,
            };
          })
          .filter(({ width, height }) => width < 44 || height < 44),
      );
    expect(undersizedTargets).toEqual([]);
  });
}

test("tablet e desktop permanecem sem overflow horizontal", async ({
  page,
}) => {
  for (const viewport of [
    { width: 768, height: 1024 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  }
});

test("menu móvel controla foco e Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator("[data-menu-toggle]");
  await toggle.focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("[data-nav] a").first()).not.toBeFocused();
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("[data-nav] a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("CTA flutuante aparece depois do hero e some sobre o mapa", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const floating = page.locator(".whatsapp-float");
  await expect(floating).not.toHaveClass(/is-visible/);
  await expect(floating).toHaveAttribute("inert", "");
  await page.locator(".plans").scrollIntoViewIfNeeded();
  await expect(floating).toHaveClass(/is-visible/);
  await expect(floating).not.toHaveAttribute("inert", "");
  await page.locator(".about-map").scrollIntoViewIfNeeded();
  await expect(floating).not.toHaveClass(/is-visible/);
  await page.locator(".site-footer").scrollIntoViewIfNeeded();
  await expect(floating).toHaveClass(/is-visible/);
});
