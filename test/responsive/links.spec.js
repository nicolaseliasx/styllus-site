import { test, expect } from "@playwright/test";

test("/links expõe atalhos, WhatsApp contextual e mapa fechado", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/links/");
  await expect(page.getByText("Desde 2005 em Palhoça")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Agendar aula experimental/ }),
  ).toHaveAttribute("href", /api\.whatsapp\.com\/send\?phone=5548991885129/);
  await expect(
    page.getByRole("link", { name: /Ver planos e valores/ }),
  ).toHaveAttribute("href", "../#planos");
  const toggle = page.locator("#map-toggle");
  const map = page.locator("#map-container");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(map).toBeHidden();
  await expect(map.locator("iframe")).not.toHaveAttribute(
    "src",
    /google\.com\/maps/,
  );
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(map).toBeVisible();
  await expect(map.locator("iframe")).toHaveAttribute(
    "src",
    /google\.com\/maps/,
  );
  await toggle.click();
  await expect(map).toBeHidden();
  const targets = await page
    .locator("a[href], button")
    .evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    );
  expect(
    targets.every(({ width, height }) => width >= 44 && height >= 44),
  ).toBe(true);
});
