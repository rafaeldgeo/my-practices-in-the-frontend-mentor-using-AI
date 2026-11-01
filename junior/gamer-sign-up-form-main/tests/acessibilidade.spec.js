// axe-core (WCAG 2.x A/AA) em cada tela, nos três tamanhos.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const analisar = async (page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  // Mensagem legível quando falhar: regra, impacto e primeiros elementos
  const resumo = violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
  expect(resumo).toEqual([]);
};

test('formulário vazio', async ({ page }) => {
  await page.goto('/');
  await analisar(page);
});

test('formulário com erros do servidor (422)', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/Callsign$/).fill('a');
  await page.getByLabel(/Email$/).fill('x');
  await Promise.all([page.waitForResponse((r) => r.request().method() === 'POST'), page.getByRole('button', { name: 'Initialize account' }).click()]);
  await expect(page.locator('#form-status')).toHaveText('5 fields need attention');
  await analisar(page);
});

test('formulário com erros em tempo real e senha visível', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel(/Callsign$/).fill('a');
  await page.getByLabel(/Callsign$/).blur();
  await page.getByLabel(/Password$/).fill('abc');
  await page.getByRole('button', { name: 'Show password', exact: true }).click();
  await analisar(page);
});

test('tela de sucesso', async ({ page }) => {
  await page.goto('/sucesso?callsign=Vortex_07');
  await analisar(page);
});

test('tela de erro do servidor', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/';
    form.innerHTML = '<input name="callsign" value="a">';
    document.body.append(form);
    form.submit();
  });
  await expect(page.getByRole('heading', { name: /Transmission rejected/ })).toBeVisible();
  await analisar(page);
});
