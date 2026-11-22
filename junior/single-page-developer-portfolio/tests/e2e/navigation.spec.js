import { test, expect } from "@playwright/test";

// Nomes acessíveis dos seis cards
const PROJECTS = [
  "Design portfolio",
  "E-learning landing page",
  "Todo web app",
  "Entertainment web app",
  "Memory Game",
  "Art gallery showcase",
];
// Mobile e desktop, onde os links dos cards têm comportamento diferente
const VIEWPORTS = [
  { label: "mobile", width: 375, height: 812 },
  { label: "desktop", width: 1440, height: 900 },
];

// Os dois CTAs "Contact me" rolam até o formulário
test.describe("CTAs levam ao formulário", () => {
  for (const region of ["Hero", "Projects"]) {
    test(`CTA "Contact me" da região ${region}`, async ({ page }) => {
      await page.goto("/");
      await page
        .getByRole("region", { name: region, exact: true })
        .getByRole("link", { name: "Contact me" })
        .click();
      await expect(page.getByRole("form", { name: "Contact form" })).toBeInViewport();
    });
  }
});

// Por teclado, cada link do card precisa receber foco e ficar visível
test.describe("links dos cards acessíveis por teclado", () => {
  for (const { label, width, height } of VIEWPORTS) {
    test.describe(`${label} ${width}×${height}`, () => {
      test.use({ viewport: { width, height } });

      for (const project of PROJECTS) {
        for (const linkName of ["View project", "View code"]) {
          test(`${project}: "${linkName}" recebe foco e fica visível`, async ({ page }) => {
            await page.goto("/");
            const link = page
              .getByRole("article", { name: project, exact: true })
              .getByRole("link", { name: linkName });
            // Avança com Tab até o link receber foco (limite evita laço infinito)
            for (let i = 0; i < 100; i += 1) {
              if (await link.evaluate((el) => el === document.activeElement)) break;
              await page.keyboard.press("Tab");
            }
            await expect(link).toBeFocused();
            await expect(link).toBeVisible();
            await expect(link).toBeInViewport();
          });
        }
      }
    });
  }
});
