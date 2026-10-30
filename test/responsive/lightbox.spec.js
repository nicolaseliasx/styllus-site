import { test, expect } from "@playwright/test";

for (const viewport of [{ width: 390, height: 844 }, { width: 1366, height: 768 }]) {
  test(`${viewport.width}px usa controle de expansão discreto no canto da foto`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const gallery = page.locator("[data-overview-gallery]");
    const expand = gallery.getByRole("button", { name: "Ampliar foto da estrutura" });
    await expect(expand).toHaveText("");
    await expect(expand.locator("svg")).toHaveCount(1);
    const frame = await gallery.boundingBox();
    const button = await expand.boundingBox();
    expect(button.width).toBeGreaterThanOrEqual(44);
    expect(button.height).toBeGreaterThanOrEqual(44);
    expect(button.y - frame.y).toBeGreaterThanOrEqual(0);
    expect(button.y - frame.y).toBeLessThanOrEqual(24);
    expect(frame.x + frame.width - button.x - button.width).toBeLessThanOrEqual(24);
    await expand.click();
    await expect(page.locator("[data-gallery-lightbox]")).toBeVisible();
  });
}

test("galeria manual abre lightbox, navega e fecha com Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  const gallery = page.locator("[data-overview-gallery]");
  const openButton = gallery.locator(".gallery-open");
  await expect(gallery.locator("img").nth(1)).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  await openButton.click();
  const lightbox = page.locator("[data-gallery-lightbox]");
  await expect(lightbox).toBeVisible();
  await expect(lightbox.locator("img")).toHaveAttribute(
    "src",
    /overview-01-2560\.webp/,
  );
  await lightbox.locator("[data-gallery-next]").click();
  await expect(lightbox.locator("img")).toHaveAttribute(
    "src",
    /overview-02-2560\.webp/,
  );
  await expect(gallery.locator("[data-gallery-announcement]")).toContainText(
    "Foto 2 de 5",
  );
  await expect(gallery.locator("img").nth(1)).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await page.keyboard.press("Escape");
  await expect(lightbox).not.toBeVisible();
  await expect(openButton).toBeFocused();
});
