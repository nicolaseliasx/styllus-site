import { test, expect } from "@playwright/test";
import { siteConfig } from "../../src/config/site.js";

for (const javaScriptEnabled of [true, false]) {
  test.describe(`contato com JavaScript ${javaScriptEnabled ? "ativo" : "desativado"}`, () => {
    test.use({ javaScriptEnabled, reducedMotion: "reduce" });

    for (const route of ["/", "/links/"]) {
      test(`${route} oferece consulta e aula com URLs completas`, async ({ page }) => {
        await page.goto(route);
        const contacts = await page.locator("[data-whatsapp]").evaluateAll((links) =>
          links.map((link) => ({
            key: link.dataset.whatsappMessage,
            href: link.href,
            target: link.target,
            rel: link.rel,
          })),
        );
        expect(contacts.some(({ key }) => key === "plans")).toBe(true);
        expect(contacts.some(({ key }) => key === "trial")).toBe(true);
        for (const contact of contacts) {
          const url = new URL(contact.href);
          expect(url.origin + url.pathname).toBe(siteConfig.whatsappBase);
          expect(url.searchParams.get("phone")).toBe("5548991885129");
          expect(url.searchParams.get("text")).toBe(siteConfig.messages[contact.key]);
          expect(contact.target).toBe("_blank");
          expect(contact.rel.split(" ")).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
        }
        await expect(page.locator("body")).not.toContainText(/89,90|109,90|12x|R\$/);
      });
    }
  });
}
