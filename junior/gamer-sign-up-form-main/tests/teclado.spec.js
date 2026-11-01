// Acessibilidade além do axe: teclado, foco visível, nomes/descrições (o que o leitor de tela lê),
// landmarks e títulos, contraste calculado de verdade, movimento reduzido e reflow.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const campos = (page) => ({
  callsign: page.getByLabel(/Callsign$/),
  email: page.getByLabel(/Email$/),
  password: page.getByLabel(/Password$/),
  confirm: page.getByLabel(/Confirm password$/),
  terms: page.getByRole('checkbox', { name: /I accept the Terms/ }),
  enviar: page.getByRole('button', { name: /Initialize account|Transmitting_/ }),
});

const NOMES_TAB = ['Callsign', 'Email', 'Password', 'Show password', 'Confirm password', 'Show confirm password', 'I accept the Terms and Privacy Policy.', 'Terms', 'Privacy Policy', 'Initialize account', 'Log in', 'Frontend Mentor', 'Rafael Dias de Almeida'];

test.describe('teclado', () => {
  test('ordem de Tab lógica, foco visível em todas as paradas e Shift+Tab volta', async ({ page }) => {
    await page.goto('/');
    await page.locator('h1').click(); // ponto de partida: o foco do clique cai antes do primeiro campo
    const paradas = [];
    for (let i = 0; i < NOMES_TAB.length; i++) {
      await page.keyboard.press('Tab');
      paradas.push(await page.evaluate(() => {
        const e = document.activeElement;
        const cs = getComputedStyle(e);
        const nome = e.getAttribute('aria-label') || e.labels?.[0]?.textContent.replace(/^\s*>\s*/, '').trim() || e.textContent.trim();
        return { nome, focusVisible: e.matches(':focus-visible'), contorno: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}` };
      }));
    }
    expect(paradas.map((p) => p.nome)).toEqual(NOMES_TAB);
    for (const p of paradas) {
      expect(p.focusVisible, p.nome).toBe(true);
      expect(p.contorno, p.nome).toBe('solid 2px rgb(191, 245, 56)'); // lime, 2px: 14:1 sobre o painel
    }
    // Sem armadilha de teclado: Shift+Tab percorre de volta
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('link', { name: 'Frontend Mentor' })).toBeFocused();
  });

  test('tudo opera só com o teclado: digitar, Espaço no checkbox, Enter no olho e Enter envia', async ({ page }) => {
    const f = campos(page);
    await page.goto('/');
    await f.callsign.focus();
    await page.keyboard.type('Vortex_07');
    await page.keyboard.press('Tab');
    await page.keyboard.type('vortex@example.com');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Abcdef12!');
    await page.keyboard.press('Tab'); // olho da senha
    await page.keyboard.press('Enter');
    await expect(f.password).toHaveAttribute('type', 'text');
    await page.keyboard.press('Space'); // Espaço também ativa o botão
    await expect(f.password).toHaveAttribute('type', 'password');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Abcdef12!');
    await page.keyboard.press('Tab'); // olho da confirmação
    await page.keyboard.press('Tab'); // checkbox
    await page.keyboard.press('Space');
    await expect(f.terms).toBeChecked();

    // Enter dentro de um campo envia o formulário (POST nativo)
    await f.callsign.focus();
    const [resposta] = await Promise.all([page.waitForResponse((r) => r.request().method() === 'POST'), page.keyboard.press('Enter')]);
    expect(resposta.status()).toBe(303);
    await expect(page.getByRole('heading', { name: /Handshake complete/ })).toBeFocused();
  });

  test('tela de erro: foco no título e link de volta acessível por teclado', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.method = 'POST'; form.action = '/';
      form.innerHTML = '<input name="callsign" value="a">';
      document.body.append(form); form.submit();
    });
    await expect(page.getByRole('heading', { name: /Transmission rejected/ })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Back to form' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'New operator' })).toBeVisible();
  });
});

test.describe('leitor de tela: nomes, descrições e anúncios', () => {
  test('campos têm nome e descrição (dica ou erro) ligados por aria-describedby', async ({ page }) => {
    const f = campos(page);
    await page.goto('/');
    await expect(f.callsign).toHaveAccessibleName('Callsign');
    await expect(f.callsign).toHaveAccessibleDescription('3–20 characters: letters, numbers, _ or -');
    await expect(f.password).toHaveAccessibleDescription(/At least 8 characters/);

    await f.callsign.fill('a');
    await f.callsign.blur();
    await expect(f.callsign).toHaveAccessibleDescription('Use at least 3 characters'); // o erro substitui a dica
    await expect(f.callsign).toHaveAttribute('aria-invalid', 'true');
    await f.callsign.pressSequentially('bc');
    await expect(f.callsign).toHaveAccessibleDescription('3–20 characters: letters, numbers, _ or -'); // a dica volta
    await expect(f.callsign).not.toHaveAttribute('aria-invalid', 'true');

    await f.terms.check();
    await f.terms.uncheck();
    await expect(f.terms).toHaveAccessibleDescription('Accept the terms to continue');
  });

  test('botões do olho: nome constante e estado em aria-pressed', async ({ page }) => {
    await page.goto('/');
    for (const nome of ['Show password', 'Show confirm password']) {
      const botao = page.getByRole('button', { name: nome, exact: true });
      await expect(botao).toHaveAttribute('aria-pressed', 'false');
      await botao.click();
      await expect(botao).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByRole('button', { name: nome, exact: true })).toHaveCount(1); // o nome não mudou
    }
  });

  test('regiões aria-live: status dos erros e medidor de força anunciam só quando mudam', async ({ page }) => {
    const f = campos(page);
    await page.goto('/');
    await expect(page.locator('#form-status')).toHaveAttribute('aria-live', 'polite');
    await expect(page.locator('#password-strength')).toHaveAttribute('aria-live', 'polite');

    // O texto do medidor não é reescrito a cada tecla: observa mutações enquanto digita 9 teclas
    await f.password.focus();
    await page.evaluate(() => {
      window.__mutacoes = 0;
      new MutationObserver((l) => { window.__mutacoes += l.length; }).observe(document.querySelector('#password-strength'), { childList: true, characterData: true, subtree: true });
    });
    await page.keyboard.type('abcdefghi'); // 9 teclas, mas só o 1º caractere muda o nível (vazio -> Weak)
    expect(await page.evaluate(() => window.__mutacoes)).toBe(1);

    // Status de erros: muda de número, não a cada tecla
    await f.callsign.fill('a');
    await f.callsign.blur();
    await expect(page.locator('#form-status')).toHaveText('1 field needs attention');
  });

  test('landmarks, idioma, títulos e hierarquia de cabeçalhos em todas as telas', async ({ page }) => {
    const telas = [
      ['/', 'Frontend Mentor | Gamer sign-up form', ['Join the nexus', 'Operator ID', 'New operator']],
      ['/sucesso?callsign=Vortex_07', 'Handshake complete | NEONCORE', ['Join the nexus', 'Operator ID', 'Handshake complete']],
    ];
    for (const [url, titulo, cabecalhos] of telas) {
      await page.goto(url);
      await expect(page).toHaveTitle(titulo);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.getByRole('main')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toHaveCount(1); // rodapé de atribuição
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const textos = await page.getByRole('heading').allInnerTexts();
      // innerText vem em maiúsculas (text-transform): compara sem diferenciar caixa
      expect(textos.map((t) => t.replace(/^\/\/\s*/, '').trim().toLowerCase())).toEqual(cabecalhos.map((c) => c.toLowerCase()));
    }
    // Tela de erro do servidor
    await page.goto('/');
    await page.evaluate(() => {
      const form = document.createElement('form');
      form.method = 'POST'; form.action = '/';
      form.innerHTML = '<input name="callsign" value="a">';
      document.body.append(form); form.submit();
    });
    await expect(page).toHaveTitle('Transmission rejected | NEONCORE');
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });

  test('imagens decorativas escondidas do leitor de tela; só o logo tem nome', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('img:not([aria-hidden="true"])').evaluateAll((l) => l.map((i) => i.alt))).toEqual(['NEONCORE']);
  });
});

test.describe('contraste, movimento e reflow', () => {
  test('contraste de texto WCAG AA verificado de verdade (axe sem "incompletos")', async ({ page }) => {
    // O axe não consegue calcular o fundo por causa do ::before decorativo do padrão de hexágonos
    // (marca como "incompleto"). Escondê-lo deixa o axe medir o fundo real do painel.
    for (const url of ['/', '/sucesso?callsign=Vortex_07']) {
      await page.goto(url);
      await page.addStyleTag({ content: '.stage::before { display: none !important; }' });
      const { violations, incomplete } = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
      expect(violations.map((v) => v.id), url).toEqual([]);
      expect(incomplete.map((v) => v.id), url).toEqual([]);
    }
  });

  test('contraste com erros e senha visível (estados em vermelho)', async ({ page }) => {
    const f = campos(page);
    await page.goto('/');
    await f.callsign.fill('a'); await f.callsign.blur();
    await f.email.fill('x'); await f.email.blur();
    await f.password.fill('abc'); await f.password.blur();
    await f.confirm.fill('zzz'); await f.confirm.blur();
    await f.terms.check(); await f.terms.uncheck();
    await page.addStyleTag({ content: '.stage::before { display: none !important; }' });
    const { violations, incomplete } = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
    expect(violations.map((v) => v.id)).toEqual([]);
    expect(incomplete.map((v) => v.id)).toEqual([]);
  });

  test('prefers-reduced-motion remove as transições', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const duracoes = await page.evaluate(() => ['.button', '.field__input', '.strength__segment'].map((s) => getComputedStyle(document.querySelector(s)).transitionDuration));
    for (const d of duracoes) expect(parseFloat(d)).toBeLessThan(0.001);
  });

  test('reflow: sem rolagem horizontal em 320px, também com texto ampliado a 200%', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    for (const url of ['/', '/sucesso?callsign=Vortex_07_ABCDEFGH']) {
      for (const tamanho of ['100%', '200%']) {
        await page.goto(url);
        await page.evaluate((t) => { document.documentElement.style.fontSize = t; }, tamanho);
        const [scroll, largura] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
        expect(scroll, `${url} a ${tamanho}`).toBeLessThanOrEqual(largura);
      }
    }
  });
});
