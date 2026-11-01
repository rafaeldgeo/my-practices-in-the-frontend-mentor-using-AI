// Estados de interação do design (design/layout/layout_interaction/): medidor de força,
// ticks de campo válido, erro dos termos, olho e "Submitting". Roda nos três tamanhos.
const { test, expect } = require('@playwright/test');

const campos = (page) => ({
  callsign: page.getByLabel(/Callsign$/),
  email: page.getByLabel(/Email$/),
  password: page.getByLabel(/Password$/),
  confirm: page.getByLabel(/Confirm password$/),
  terms: page.getByRole('checkbox', { name: /I accept the Terms/ }),
  enviar: page.getByRole('button', { name: /Initialize account|Transmitting_/ }),
});

// Cor de fundo dos 4 segmentos do medidor (para saber quantos estão acesos)
const coresDoMedidor = (page) =>
  page.locator('.strength__segment').evaluateAll((segmentos) => segmentos.map((s) => getComputedStyle(s).backgroundColor));

test.describe('medidor de força', () => {
  for (const [senha, nivel, rotulo] of [['abcdefghi', 1, 'Weak'], ['abcdefghi1', 2, 'Fair'], ['Abcdefghi1x', 3, 'Good'], ['Abcdefghi1!xyz', 4, 'Strong']]) {
    test(`${rotulo}: acende ${nivel} segmento(s) com a cor do nível`, async ({ page }) => {
      await page.goto('/');
      await campos(page).password.fill(senha);
      await expect(page.locator('#password-strength')).toHaveText(rotulo);
      // O CSS faz uma transição de cor de 120ms: espera estabilizar antes de ler
      await expect.poll(async () => new Set((await coresDoMedidor(page)).slice(0, nivel)).size).toBe(1);
      const cores = await coresDoMedidor(page);
      const apagado = cores[3 - (nivel === 4 ? 3 : 0)]; // referência: segmento apagado (ou o 1º se tudo aceso)
      if (nivel < 4) {
        expect(cores[nivel]).not.toBe(cores[0]); // o segmento seguinte continua apagado
      } else {
        expect(new Set(cores).size).toBe(1); // Strong: os quatro acesos na mesma cor
      }
      expect(apagado).toBeTruthy();
    });
  }
});

test('ticks de campo válido (callsign, email, senha e confirmação) só depois de sair do campo', async ({ page }) => {
  const f = campos(page);
  await page.goto('/');
  await f.callsign.fill('NeonRaider_99');
  await expect(page.locator('.field--valid')).toHaveCount(0); // ainda não checado
  await f.callsign.blur();
  await f.email.fill('operator@neoncore.gg');
  await f.email.blur();
  await f.password.fill('Neon#Raider2099!');
  await f.password.blur();
  await f.confirm.fill('Neon#Raider2099!');
  await f.confirm.blur();
  await expect(page.locator('.field--valid')).toHaveCount(4);
  await expect(page.locator('.readout__count')).toHaveText('4/5 ready');

  // Voltou a ficar inválido: o tick some
  await f.confirm.fill('outra');
  await expect(page.locator('.field--valid')).toHaveCount(3);
});

test('erro dos termos: borda e mensagem, readout "Required" e 4/5 com o resto válido', async ({ page }) => {
  const f = campos(page);
  await page.goto('/');
  await f.callsign.fill('NeonRaider_99'); await f.callsign.blur();
  await f.email.fill('operator@neoncore.gg'); await f.email.blur();
  await f.password.fill('Neon#Raider2099!'); await f.password.blur();
  await f.confirm.fill('Neon#Raider2099!'); await f.confirm.blur();
  await f.terms.check();
  await f.terms.uncheck();
  await expect(page.locator('.checkbox--error')).toHaveCount(1);
  await expect(page.locator('#terms-error')).toHaveText('Accept the terms to continue');
  await expect(f.terms).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('.readout__count')).toHaveText('4/5 ready');
  await expect(page.locator('.readout__row[data-field="terms"] .readout__status')).toHaveText('Required');
});

test('senha visível mostra o texto, ícone cortado e o tick lime', async ({ page }) => {
  const f = campos(page);
  await page.goto('/');
  await f.password.fill('Tr4nsm1t!Nexus');
  const olho = page.getByRole('button', { name: 'Show password', exact: true });
  await olho.click(); // o clique tira o foco do campo: ele passa a estar checado e válido
  await expect(f.password).toHaveAttribute('type', 'text');
  await expect(f.password).toHaveValue('Tr4nsm1t!Nexus');
  await expect(page.locator('.field--valid')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Hide password', exact: true }).locator('img')).toHaveAttribute('src', /icon-eye-off\.svg/);
  await expect(page.locator('.readout__row[data-field="password"] .readout__status')).toHaveText('OK');
});

test('enviando: campos somente leitura (não disabled) e os dados chegam ao servidor', async ({ page }) => {
  const f = campos(page);
  await page.goto('/');
  await f.callsign.fill('Vortex_07');
  await f.email.fill('vortex@example.com');
  await f.password.fill('Abcdef12!');
  await f.terms.check();
  await f.confirm.fill('Outra#Senha99'); // confirmação diferente: o servidor devolve 422 com o formulário

  // Estado durante o envio, lido dentro da página (a navegação o apaga logo em seguida)
  const durante = await f.enviar.evaluate((botao) => {
    botao.form.addEventListener('submit', (e) => e.preventDefault()); // só observa: não navega
    botao.form.requestSubmit();
    const inputs = [...botao.form.querySelectorAll('.field__input')];
    return {
      readonly: inputs.map((i) => i.readOnly),
      disabled: inputs.map((i) => i.disabled),
      busy: botao.getAttribute('aria-busy'),
      ocupado: botao.form.hasAttribute('aria-busy'),
      texto: botao.textContent.trim(),
    };
  });
  expect(durante.readonly).toEqual([true, true, true, true]);
  expect(durante.disabled).toEqual([false, false, false, false]); // disabled não seria enviado no POST
  expect(durante).toMatchObject({ busy: 'true', ocupado: true, texto: 'Transmitting_' });
  await expect(page.locator('.field__reveal').first()).toHaveCSS('pointer-events', 'none');

  // Envio real, numa página nova (a mesma aba restauraria os valores do formulário):
  // nada se perde. O servidor viu a senha (o rótulo de força é calculado dela) e o email.
  const outra = await page.context().newPage();
  const g = campos(outra);
  await outra.goto('/');
  await g.callsign.fill('Vortex_07');
  await g.email.fill('vortex@example.com');
  await g.password.fill('Abcdef12!');
  await g.terms.check();
  await g.confirm.fill('Outra#Senha99'); // sair deste campo direto para o botão não pode perder o clique
  const [resposta] = await Promise.all([outra.waitForResponse((r) => r.request().method() === 'POST'), g.enviar.click()]);
  expect(resposta.status()).toBe(422);
  await expect(g.email).toHaveValue('vortex@example.com');
  await expect(outra.locator('#password-strength')).toHaveText('Strong'); // calculado no servidor a partir da senha enviada (9 caracteres, 4 critérios)
  await expect(outra.locator('#confirm-error')).toHaveText("Passwords don't match");
});
