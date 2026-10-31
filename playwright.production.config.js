import { defineConfig } from "@playwright/test";

const builds = [
  { name: "root", base: "/", port: 4175 },
  { name: "subpath", base: "/styllus/", port: 4176 },
];

export default defineConfig({
  testDir: "./test/production",
  reporter: "line",
  use: { reducedMotion: "reduce", viewport: { width: 390, height: 844 } },
  projects: builds.map(({ name, base, port }) => ({
    name,
    use: { baseURL: `http://127.0.0.1:${port}${base}` },
  })),
  webServer: builds.map(({ name, base, port }) => ({
    command: `npm run build -- --base=${base} --outDir=dist/production-${name} && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort --base=${base} --outDir=dist/production-${name}`,
    url: `http://127.0.0.1:${port}${base}`,
    reuseExistingServer: false,
  })),
});
