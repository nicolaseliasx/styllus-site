import { test, expect } from "@playwright/test";

test("galeria carrega as cinco fotos ampliadas a partir do build", async ({ page }) => {
  const fullPhotoRequests = [];
  page.on("request", (request) => {
    if (/overview-\d\d-2560/.test(request.url())) fullPhotoRequests.push(request.url());
  });
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
  const gallery = page.locator("[data-overview-gallery]");
  const dialog = page.locator("[data-gallery-lightbox]");
  const image = dialog.locator("img");
  await expect(image).not.toHaveAttribute("src", /.+/);
  expect(fullPhotoRequests).toEqual([]);
  await gallery.locator(".gallery-open").click();
  for (let index = 1; index <= 5; index++) {
    await expect(image).toHaveAttribute("src", new RegExp(`overview-0${index}-2560`));
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
    const response = await page.request.get(await image.evaluate((element) => element.src));
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
    await dialog.locator("[data-gallery-next]").click();
  }
  await expect(image).toHaveAttribute("src", /overview-01-2560/);
  await page.keyboard.press("ArrowLeft");
  await expect(image).toHaveAttribute("src", /overview-05-2560/);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(gallery.locator(".gallery-open")).toBeFocused();
});

test("rotas e imagens respeitam a base de publicação", async ({ page }) => {
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  for (const route of ["./", "./links/"]) {
    await page.goto(route);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].filter((image) => !image.closest("dialog")).map((image) => image.decode()));
    });
    const photos = await page.locator("img").evaluateAll((images) =>
      images.filter((image) => !image.closest("dialog")).map((image) => image.naturalWidth),
    );
    expect(photos.every((width) => width > 0)).toBe(true);
    await expect(page.locator("[data-whatsapp-message=plans]").first()).toHaveAttribute("href", /phone=5548991885129/);
    await expect(page.locator("body")).not.toContainText(/89,90|109,90|R\$/);
  }
  await page.getByRole("link", { name: /Conhecer o site/ }).click();
  await expect(page.locator("[data-hero-cta]")).toBeVisible();
  expect(failures).toEqual([]);
});
