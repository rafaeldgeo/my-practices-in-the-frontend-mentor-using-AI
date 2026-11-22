import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Regras WCAG 2.0/2.1 níveis A e AA, as mesmas de a11y.spec.js
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
// Mesmos viewports de a11y.spec.js
const VIEWPORTS = [
  { label: "mobile", width: 375, height: 812 },
  { label: "desktop", width: 1440, height: 900 },
];
const LIGHT_BG = "rgb(255, 255, 255)";

// Roda o axe na página e devolve as violações encontradas
const scan = async (page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  return violations;
};

for (const { label, width, height } of VIEWPORTS) {
  test.describe(`acessibilidade no tema light em ${label} ${width}×${height}`, () => {
    test.use({ viewport: { width, height } });

    test.beforeEach(async ({ page }) => {
      // Grava o light antes de a página carregar, como se o usuário já o tivesse escolhido
      await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
      await page.goto("/");
      await expect(page.getByRole("form", { name: "Contact form" })).toBeVisible();
      // Sem o tema light aplicado, a varredura passaria olhando o dark
      await expect(page.locator("body")).toHaveCSS("background-color", LIGHT_BG);
    });

    test("estado inicial sem violações", async ({ page }) => {
      expect(await scan(page)).toEqual([]);
    });

    test("com erros sem violações", async ({ page }) => {
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(page.getByText("Can't be empty")).toHaveCount(3);
      expect(await scan(page)).toEqual([]);
    });

    test("com sucesso sem violações", async ({ page }) => {
      await page.getByLabel("Name", { exact: true }).fill("Jane Doe");
      await page.getByLabel("Email", { exact: true }).fill("jane@mail.com");
      await page.getByLabel("Message", { exact: true }).fill("Hello Adam");
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(page.getByRole("status")).toHaveText(
        "Thanks for getting in touch! I'll get back to you soon."
      );
      expect(await scan(page)).toEqual([]);
    });
  });
}
