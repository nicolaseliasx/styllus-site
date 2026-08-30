import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

const luminance = (hex) => {
  const channels = [1, 3, 5].map((offset) =>
    parseInt(hex.slice(offset, offset + 2), 16),
  );
  const [red, green, blue] = channels.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrast = (foreground, background) => {
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
};

test("preserva os assets oficiais e seus hashes", async () => {
  const originals = new Map([
    [
      "assets/1.PNG",
      "3b9524f6d4b1cc3f4b0cd2089c8687a0de2021cd5d90fff30b4ed7195898d53b",
    ],
    [
      "assets/2.png",
      "b49cbe6ee185beae7fc0173d182ebfd5f42a06e9faf7fb48512e3d88dd02db2e",
    ],
  ]);
  await Promise.all(
    [
      ...originals.keys(),
      "assets/styllus-lockup.webp",
      "assets/styllus-mark.webp",
      "assets/styllus-mark-header.webp",
    ].map((asset) => stat(new URL(`../${asset}`, import.meta.url))),
  );
  for (const [asset, expected] of originals)
    assert.equal(
      createHash("sha256")
        .update(await readFile(new URL(`../${asset}`, import.meta.url)))
        .digest("hex"),
      expected,
    );
});

test("registra produto e comunica oferta, horários e diferenciais confirmados", async () => {
  const markup = await read("index.html");
  const product = await read("PRODUCT.md");
  for (const value of [
    "Desde 2005",
    "89,90",
    "109,90",
    "06h",
    "23h",
    "09h",
    "12h",
    "climatizada",
    "experimental",
    "Santana Fitness",
    "Profissionais presentes",
  ])
    assert.match(`${markup}\n${product}`, new RegExp(value, "i"));
  for (const forbidden of [
    "Ela está de volta",
    "preços imperdíveis",
    "promoção irresistível",
  ])
    assert.doesNotMatch(markup, new RegExp(forbidden, "i"));
  assert.match(markup, /href="#planos"/);
  assert.match(markup, /href="#estrutura"/);
  assert.match(markup, /href="#horarios"/);
  assert.match(markup, /href="#localizacao"/);
  assert.match(
    product,
    /R\. Princesa Isabel, 600 — Pte\. do Imaruim, Palhoça — SC, 88130-635/,
  );
  assert.match(
    markup,
    /title="Mapa da Styllus Fitness Center em R\. Princesa Isabel, 600, Palhoça, SC"/,
  );
});

test("WhatsApp usa configuração contextual e nenhuma rota usa wa.me ou setInterval", async () => {
  const [markup, linksMarkup, main, links] = await Promise.all([
    read("index.html"),
    read("links/index.html"),
    read("src/main.js"),
    read("src/links.js"),
  ]);
  assert.match(markup, /data-whatsapp-message="trial"/);
  assert.match(markup, /data-whatsapp-message="annual"/);
  assert.match(markup, /data-whatsapp-message="monthly"/);
  assert.doesNotMatch(`${markup}\n${main}\n${links}`, /wa\.me|setInterval/);
  assert.doesNotMatch(
    `${markup}\n${linksMarkup}`,
    /data-whatsapp[^>]*href="#"/,
  );
  assert.match(main, /modules\/whatsapp/);
  assert.match(links, /modules\/whatsapp/);
});

test("mantém contraste AA, safe areas e alvos mínimos nos componentes", async () => {
  const [shared, components, responsive, links] = await Promise.all([
    read("src/styles/shared.css"),
    read("src/styles/components.css"),
    read("src/styles/responsive.css"),
    read("src/links.css"),
  ]);
  assert.ok(contrast("#f4f7fb", "#0066d6") >= 4.5);
  assert.match(shared, /--blue-action:\s*#0066d6/);
  assert.match(shared, /\.button-small\s*{[^}]*min-height:\s*44px/s);
  assert.match(components, /safe-area-inset-top/);
  assert.match(responsive, /visibility:\s*hidden/);
  assert.match(links, /safe-area-inset-(top|right|bottom|left)/);
  assert.doesNotMatch(responsive, /0\.001ms|0\.01ms/);
});

test("fotos usam variantes responsivas e há uma única galeria completa", async () => {
  const markup = await read("index.html");
  const photos = Array.from(
    { length: 5 },
    (_, i) => `assets/overview/web/overview-0${i + 1}.webp`,
  );
  await Promise.all(
    photos.flatMap((photo) =>
      ["800", "2560"].map((size) =>
        stat(
          new URL(
            `../${photo.replace(".webp", `-${size}.webp`)}`,
            import.meta.url,
          ),
        ),
      ),
    ),
  );
  assert.equal((markup.match(/data-overview-gallery/g) || []).length, 1);
  assert.equal(
    (markup.match(/data-full="[^"]*overview-\d\d-2560\.webp/g) || []).length,
    5,
  );
  assert.match(markup, /fetchpriority="high"/);
  assert.match(markup, /data-gallery-previous/);
  assert.match(markup, /data-gallery-next/);
});
