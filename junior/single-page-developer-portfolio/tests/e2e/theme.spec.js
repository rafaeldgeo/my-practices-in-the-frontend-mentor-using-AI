import { test, expect } from "@playwright/test";

// Contrato do design: nomes do botão, cores do body e do destaque em cada tema
const TO_LIGHT = "Switch to light theme";
const TO_DARK = "Switch to dark theme";
const DARK = { bg: "rgb(21, 21, 21)", text: "rgb(255, 255, 255)", accent: "rgb(78, 225, 160)" };
const LIGHT = { bg: "rgb(255, 255, 255)", text: "rgb(21, 21, 21)", accent: "rgb(8, 122, 74)" };

// Localizadores compartilhados pelos testes
// Botão de tema pelo nome acessível (que diz a ação) e link Twitter só do header
const getToggle = (page, name) => page.getByRole("button", { name });
const getTwitter = (page) => page.getByRole("banner").getByRole("link", { name: "Twitter" });
// O tema aplicado se confere pela cor de fundo e de texto calculadas do body
const expectTheme = async (page, colors) => {
  await expect(page.locator("body")).toHaveCSS("background-color", colors.bg);
  await expect(page.locator("body")).toHaveCSS("color", colors.text);
};

// Primeira visita e preferência do sistema
test.describe("tema inicial", () => {
  test("primeira visita abre no dark com o botão para o light", async ({ page }) => {
    await page.goto("/");
    await expectTheme(page, DARK);
    await expect(getToggle(page, TO_LIGHT)).toBeVisible();
  });

  test("sistema em modo claro continua abrindo no dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expectTheme(page, DARK);
    await expect(getToggle(page, TO_LIGHT)).toBeVisible();
  });

  test("valor gravado inválido abre no dark", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem("theme", "blue"));
    await page.goto("/");
    await expectTheme(page, DARK);
    await expect(getToggle(page, TO_LIGHT)).toBeVisible();
  });
});

// O botão fica no header, logo depois do Twitter, e funciona por teclado
test.describe("botão de tema", () => {
  // Tab a partir do Twitter cai no botão: ele é o próximo item na ordem de leitura
  test("fica no header, logo depois do link Twitter", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner").getByRole("button", { name: TO_LIGHT })).toBeVisible();
    await getTwitter(page).focus();
    await page.keyboard.press("Tab");
    await expect(getToggle(page, TO_LIGHT)).toBeFocused();
  });

  test("é visível dentro do viewport mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(getToggle(page, TO_LIGHT)).toBeInViewport();
  });

  test("mostra indicador de foco ao receber foco por teclado", async ({ page }) => {
    await page.goto("/");
    await getTwitter(page).focus();
    await page.keyboard.press("Tab");
    await expect(getToggle(page, TO_LIGHT)).toBeFocused();
    await expect(getToggle(page, TO_LIGHT)).toHaveCSS("outline-style", "solid");
  });

  // Após alternar, o nome muda mas o foco continua no mesmo botão
  test("Enter e Espaço alternam o tema", async ({ page }) => {
    await page.goto("/");
    await getTwitter(page).focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(getToggle(page, TO_DARK)).toBeFocused();
    await expectTheme(page, LIGHT);
    await page.keyboard.press("Space");
    await expect(getToggle(page, TO_LIGHT)).toBeFocused();
    await expectTheme(page, DARK);
  });
});

// Alternar troca o tema na hora, sem recarregar, e o nome do botão acompanha
test.describe("alternar o tema", () => {
  test("dark para light", async ({ page }) => {
    await page.goto("/");
    await getToggle(page, TO_LIGHT).click();
    await expectTheme(page, LIGHT);
    await expect(getToggle(page, TO_DARK)).toBeVisible();
  });

  test("light para dark volta ao visual original", async ({ page }) => {
    await page.goto("/");
    await getToggle(page, TO_LIGHT).click();
    await getToggle(page, TO_DARK).click();
    await expectTheme(page, DARK);
    await expect(getToggle(page, TO_LIGHT)).toBeVisible();
  });

  // A marca em window some se a página recarregar
  test("não recarrega a página", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      window.__marker = true;
    });
    await getToggle(page, TO_LIGHT).click();
    await expectTheme(page, LIGHT);
    expect(await page.evaluate(() => window.__marker)).toBe(true);
  });
});

// A escolha sobrevive ao recarregamento; cada teste do Playwright começa com armazenamento limpo
test.describe("persistência da escolha", () => {
  test("light persiste ao recarregar", async ({ page }) => {
    await page.goto("/");
    await getToggle(page, TO_LIGHT).click();
    await page.reload();
    await expectTheme(page, LIGHT);
    await expect(getToggle(page, TO_DARK)).toBeVisible();
  });

  test("dark escolhido depois do light persiste ao recarregar", async ({ page }) => {
    await page.goto("/");
    await getToggle(page, TO_LIGHT).click();
    await getToggle(page, TO_DARK).click();
    await page.reload();
    await expectTheme(page, DARK);
    await expect(getToggle(page, TO_LIGHT)).toBeVisible();
  });

  test("o tema gravado é aplicado sem depender dos módulos do tema", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
    // Bloqueia theme.js e theme-toggle.js: só o script inline do <head> pode aplicar o tema
    await page.route("**/js/theme*.js", (route) => route.abort());
    await page.goto("/");
    await expectTheme(page, LIGHT);
  });
});

// Aparência do light: destaque verde escuro no hover e decoração visível
test.describe("aparência do light", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
    await page.goto("/");
  });

  test("hover do ícone social usa o verde do tema light", async ({ page }) => {
    await getTwitter(page).hover();
    await expect(getTwitter(page)).toHaveCSS("color", LIGHT.accent);
  });

  test("anéis e círculo decorativos são invertidos para ficarem visíveis", async ({ page }) => {
    await expect(page.locator(".hero__rings")).toHaveCSS("filter", "invert(1)");
    await expect(page.locator(".hero__circle")).toHaveCSS("filter", "invert(1)");
  });
});

// O dark segue com o verde original no hover
test("hover do ícone social usa o verde do tema dark", async ({ page }) => {
  await page.goto("/");
  await getTwitter(page).hover();
  await expect(getTwitter(page)).toHaveCSS("color", DARK.accent);
});
