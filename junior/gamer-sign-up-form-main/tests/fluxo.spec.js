// Fluxos do formulário (JS ligado) nos três tamanhos: feliz, erro de validação e UI em tempo real.
const { test, expect } = require('@playwright/test');

const ehPost = (resposta) => resposta.request().method() === 'POST';

// Campos pelo texto do label. O label começa com o prompt decorativo "> " (Callsign, Email...),
// então a busca é pelo FIM do texto. Maiúscula/minúscula distingue "Password" de "Confirm
// password" e dos botões de olho ("Show password", aria-label em minúscula).
const campos = (page) => ({
  callsign: page.getByLabel(/Callsign$/),
  email: page.getByLabel(/Email$/),
  password: page.getByLabel(/Password$/),
  confirm: page.getByLabel(/Confirm password$/),
  terms: page.getByRole('checkbox', { name: /I accept the Terms/ }),
  enviar: page.getByRole('button', { name: /Initialize account|Transmitting_/ }),
});

test.describe('fluxo feliz', () => {
  test('cadastro válido redireciona para /sucesso e recarregar não reenvia', async ({ page }) => {
    const f = campos(page);
    await page.goto('/');
    await f.callsign.fill('Vortex_07');
    await f.email.fill('vortex@example.com');
    await f.password.fill('Abcdef12!');
    await f.confirm.fill('Abcdef12!');
    await f.terms.check();

    // POST nativo -> 303 -> GET /sucesso
    const [resposta] = await Promise.all([page.waitForResponse(ehPost), f.enviar.click()]);
    expect(resposta.status()).toBe(303);
    await expect(page).toHaveURL(/\/sucesso\?callsign=Vortex_07$/);

    // Título com foco, texto e readout provisionado
    const titulo = page.getByRole('heading', { name: /Handshake complete/ });
    await expect(titulo).toBeFocused();
    await expect(page.getByText('Operator Vortex_07 provisioned. Your account is ready.')).toBeVisible();
    await expect(page.locator('.readout__count')).toHaveText('Provisioned');
    await expect(page.locator('.readout__callsign')).toHaveText('Vortex_07');
    await expect(page.locator('.readout__status')).toHaveText(['Locked', 'Locked', 'Locked', 'Locked', 'Locked']);

    // Recarregar repete só o GET: nenhum POST e continua em /sucesso
    const metodos = [];
    page.on('request', (r) => metodos.push(r.method()));
    await page.reload();
    expect(metodos).not.toContain('POST');
    await expect(page).toHaveURL(/\/sucesso\?callsign=Vortex_07$/);
    await expect(titulo).toBeVisible();
  });
});

test.describe('erro de validação (servidor)', () => {
  test('dados inválidos voltam no formulário com valores, mensagens e readout', async ({ page }) => {
    const f = campos(page);
    await page.goto('/');
    await f.callsign.fill('a');
    await f.email.fill('vortex@example.com');
    await f.password.fill('1234');
    await f.confirm.fill('12345');
    // Não marca os termos

    const [resposta] = await Promise.all([page.waitForResponse(ehPost), f.enviar.click()]);
    expect(resposta.status()).toBe(422);
    await expect(page).toHaveURL(/\/$/); // renderiza no próprio POST: a URL continua /

    // Valores preservados; senha e confirmação NUNCA voltam
    await expect(f.callsign).toHaveValue('a');
    await expect(f.email).toHaveValue('vortex@example.com');
    await expect(f.password).toHaveValue('');
    await expect(f.confirm).toHaveValue('');
    await expect(f.terms).not.toBeChecked();

    // Mensagens exatas, aria-invalid e ligação por aria-describedby
    await expect(page.locator('#callsign-error')).toHaveText('Use at least 3 characters');
    await expect(page.locator('#password-error')).toHaveText('Use at least 8 characters');
    await expect(page.locator('#confirm-error')).toHaveText("Passwords don't match");
    await expect(page.locator('#terms-error')).toHaveText('Accept the terms to continue');
    for (const campo of [f.callsign, f.password, f.confirm, f.terms]) {
      await expect(campo).toHaveAttribute('aria-invalid', 'true');
    }
    await expect(f.email).not.toHaveAttribute('aria-invalid', 'true');
    await expect(f.callsign).toHaveAttribute('aria-describedby', 'callsign-error');

    // Região aria-live e foco no primeiro campo inválido
    await expect(page.locator('#form-status')).toHaveText('4 fields need attention');
    await expect(f.callsign).toBeFocused();

    // Readout calculado no servidor
    await expect(page.locator('.readout__count')).toHaveText('1/5 ready');
    await expect(page.locator('.readout__callsign')).toHaveText('Unassigned');
    await expect(page.locator('.readout__status')).toHaveText(['Too short', 'OK', 'Too short', 'Mismatch', 'Required']);

    // Força da senha devolvida pelo servidor (senha de 4 caracteres = Weak)
    await expect(page.locator('#password-strength')).toHaveText('Weak');
  });
});

test.describe('UI em tempo real (JS)', () => {
  test('validação ao sair do campo, correção a cada tecla e região aria-live', async ({ page }) => {
    const f = campos(page);
    await page.goto('/');
    await f.callsign.fill('a');
    await expect(page.locator('#callsign-error')).toHaveCount(0); // ainda não checado
    await f.callsign.blur();
    await expect(page.locator('#callsign-error')).toHaveText('Use at least 3 characters');
    await expect(f.callsign).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#form-status')).toHaveText('1 field needs attention');

    await f.callsign.pressSequentially('bc'); // depois de checado, cada tecla revalida
    await expect(page.locator('#callsign-error')).toHaveCount(0);
    await expect(f.callsign).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#callsign-hint')).toBeVisible();
    await expect(page.locator('#form-status')).toHaveText('');
  });

  test('medidor de força, mostrar/ocultar senha e readout', async ({ page }) => {
    const f = campos(page);
    await page.goto('/');
    await expect(page.locator('.readout__count')).toHaveText('0/5 ready');
    await expect(page.locator('.readout__callsign')).toHaveText('Unassigned');

    const forca = page.locator('#password-strength');
    await f.password.fill('abc');
    await expect(forca).toHaveText('Weak');
    await f.password.fill('Abcdefg1');
    await expect(forca).toHaveText('Good');
    await f.password.fill('Abcdefg1!xyz');
    await expect(forca).toHaveText('Strong');
    await expect(page.locator('.strength')).toHaveAttribute('data-level', '4');

    const olho = page.getByRole('button', { name: 'Show password', exact: true });
    await olho.click();
    await expect(f.password).toHaveAttribute('type', 'text');
    await expect(page.getByRole('button', { name: 'Hide password', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Hide password', exact: true }).click();
    await expect(f.password).toHaveAttribute('type', 'password');
    await expect(f.password).toHaveValue('Abcdefg1!xyz'); // o valor não muda

    // Readout acompanha os campos
    await f.callsign.fill('Vortex_07');
    await f.callsign.blur();
    await expect(page.locator('.readout__callsign')).toHaveText('Vortex_07');
    await f.email.fill('x');
    await f.email.blur();
    await expect(page.locator('.readout__row[data-field="email"] .readout__status')).toHaveText('Malformed');
    await f.confirm.fill('outra');
    await f.confirm.blur();
    await expect(page.locator('.readout__row[data-field="confirm"] .readout__status')).toHaveText('Mismatch');
    await expect(page.locator('.readout__count')).toHaveText('2/5 ready');
  });

  test('"Transmitting_" no envio, com um único POST nativo', async ({ page }) => {
    const f = campos(page);
    const posts = [];
    page.on('request', (r) => r.method() === 'POST' && posts.push(r.url()));
    // Atrasa a resposta do POST para dar tempo de observar o estado de loading
    await page.route('**/', async (route) => {
      if (route.request().method() === 'POST') await new Promise((r) => setTimeout(r, 400));
      await route.continue();
    });

    await page.goto('/');
    await f.callsign.fill('Vortex_07');
    await f.email.fill('vortex@example.com');
    await f.password.fill('Abcdef12!');
    await f.confirm.fill('Abcdef12!');
    await f.terms.check();

    // O estado de loading dura só até a navegação: lê-se DENTRO da página, logo após o clique
    // (esperar por fora corre contra a página nova). O segundo clique é o duplo clique.
    const estado = await f.enviar.evaluate((botao) => {
      let segundoCancelado = false;
      botao.form.addEventListener('submit', (e) => { segundoCancelado = e.defaultPrevented; });
      botao.click();
      const durante = { busy: botao.getAttribute('aria-busy'), texto: botao.textContent.trim() };
      botao.click();
      return { ...durante, segundoCancelado };
    });
    expect(estado).toEqual({ busy: 'true', texto: 'Transmitting_', segundoCancelado: true });
    await expect(page).toHaveURL(/\/sucesso/);
    expect(posts).toHaveLength(1);
  });
});
