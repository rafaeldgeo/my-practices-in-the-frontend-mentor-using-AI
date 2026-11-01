// O servidor é a autoridade: funciona sem JavaScript e responde a POSTs que não vieram do
// formulário (JS burlado ou envio direto). Roda nos três tamanhos.
const { test, expect } = require('@playwright/test');

const ehPost = (resposta) => resposta.request().method() === 'POST';
const VALIDO = { callsign: 'Vortex_07', email: 'vortex@example.com', password: 'Abcdef12!', confirm: 'Abcdef12!', terms: 'on' };

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('cadastro válido funciona e o foco vai para o título (autofocus)', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/Callsign$/).fill('Vortex_07');
    await page.getByLabel(/Email$/).fill('vortex@example.com');
    await page.getByLabel(/Password$/).fill('Abcdef12!');
    await page.getByLabel(/Confirm password$/).fill('Abcdef12!');
    await page.getByRole('checkbox', { name: /I accept the Terms/ }).check();

    const [resposta] = await Promise.all([page.waitForResponse(ehPost), page.getByRole('button', { name: 'Initialize account' }).click()]);
    expect(resposta.status()).toBe(303);
    await expect(page).toHaveURL(/\/sucesso\?callsign=Vortex_07$/);
    await expect(page.getByRole('heading', { name: /Handshake complete/ })).toBeFocused();
    await expect(page.locator('.readout__count')).toHaveText('Provisioned');
  });

  test('dados inválidos voltam com valores, mensagens, readout e foco, sem JS', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/Callsign$/).fill('Vortex_07');
    await page.getByLabel(/Email$/).fill('x');
    await page.getByLabel(/Password$/).fill('abc');
    await page.getByLabel(/Confirm password$/).fill('abc');

    const [resposta] = await Promise.all([page.waitForResponse(ehPost), page.getByRole('button', { name: 'Initialize account' }).click()]);
    expect(resposta.status()).toBe(422);

    await expect(page.getByLabel(/Callsign$/)).toHaveValue('Vortex_07'); // valor preservado
    await expect(page.getByLabel(/Password$/)).toHaveValue(''); // senha nunca volta
    await expect(page.locator('#email-error')).toHaveText('Enter a valid email, like you@example.com');
    await expect(page.locator('#password-error')).toHaveText('Use at least 8 characters');
    await expect(page.locator('#terms-error')).toHaveText('Accept the terms to continue');
    await expect(page.locator('#form-status')).toHaveText('3 fields need attention');
    await expect(page.getByLabel(/Email$/)).toBeFocused(); // primeiro inválido, só com HTML autofocus
    await expect(page.locator('#password-strength')).toHaveText('Weak');
    await expect(page.locator('.readout__count')).toHaveText('2/5 ready');
    await expect(page.locator('.readout__callsign')).toHaveText('Vortex_07');
  });

  test('olho e medidor não existem sem JS, mas o formulário segue utilizável', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/Password$/).fill('Abcdef12!');
    await page.getByRole('button', { name: 'Show password', exact: true }).click(); // não faz nada
    await expect(page.getByLabel(/Password$/)).toHaveAttribute('type', 'password');
    await expect(page.locator('#password-strength')).toHaveText('');
  });
});

test.describe('POST direto (simula JS burlado ou ferramenta)', () => {
  test('corpo incompleto: 400 com a tela de erro e lista de mensagens', async ({ request }) => {
    const resposta = await request.post('/', { form: { callsign: 'a' } });
    expect(resposta.status()).toBe(400);
    const html = await resposta.text();
    expect(html).toContain('Transmission rejected');
    expect(html).toContain('Use at least 3 characters');
    expect(html).toContain('Enter your email');
    expect(html).toContain('href="/"'); // link de volta
  });

  test('corpo vazio, campo repetido (array) e JSON: 400', async ({ request }) => {
    expect((await request.post('/', { form: {} })).status()).toBe(400);
    expect((await request.post('/', { data: 'callsign=a&callsign=b&email=x&password=1&confirm=2', headers: { 'content-type': 'application/x-www-form-urlencoded' } })).status()).toBe(400);
    expect((await request.post('/', { data: { callsign: 'a' } })).status()).toBe(400);
  });

  test('quatro campos de texto inválidos: 422 com o formulário (não a tela de erro)', async ({ request }) => {
    const resposta = await request.post('/', { form: { callsign: 'a', email: 'x', password: '1', confirm: '2' } });
    expect(resposta.status()).toBe(422);
    const html = await resposta.text();
    expect(html).toContain('New operator');
    expect(html).not.toContain('Transmission rejected');
    expect(html).toContain('value="a"');
    expect(html).not.toMatch(/name="password"[^>]*value=/); // senha nunca devolvida
  });

  test('o que vem do usuário sai escapado, nas duas telas', async ({ request }) => {
    const xss = '<script>alert(1)</script>';
    const formulario = await (await request.post('/', { form: { callsign: xss, email: xss, password: '1', confirm: '2' } })).text();
    expect(formulario).not.toContain(xss);
    expect(formulario).toContain('&lt;script&gt;');
    const erro = await (await request.post('/', { form: { callsign: xss } })).text();
    expect(erro).not.toContain(xss);
  });

  test('POST válido: 303 para /sucesso com o callsign', async ({ request }) => {
    const resposta = await request.post('/', { form: VALIDO, maxRedirects: 0 });
    expect(resposta.status()).toBe(303);
    expect(resposta.headers().location).toBe('/sucesso?callsign=Vortex_07');
  });

  test('/sucesso sem callsign válido volta para o formulário', async ({ request }) => {
    for (const url of ['/sucesso', '/sucesso?callsign=<b>', '/sucesso?callsign=a', '/sucesso?callsign[]=abc']) {
      const resposta = await request.get(url, { maxRedirects: 0 });
      expect(resposta.status(), url).toBe(302);
      expect(resposta.headers().location).toBe('/');
    }
  });

  test('a tela de erro é exibida no navegador com foco no título e link de volta', async ({ page }) => {
    await page.goto('/');
    // Envia um corpo incompleto pelo próprio navegador (um <form> só com o callsign)
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/';
      form.innerHTML = '<input name="callsign" value="a">';
      document.body.append(form);
      form.submit();
    });
    await expect(page.getByRole('heading', { name: /Transmission rejected/ })).toBeFocused();
    await expect(page.locator('.error-screen__item').first()).toHaveText('Use at least 3 characters');
    await page.getByRole('link', { name: 'Back to form' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'New operator' })).toBeVisible();
  });
});
