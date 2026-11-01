// Validação em tempo real (só UX). Importante:
//   - NUNCA envia o formulário e não usa fetch/AJAX: o envio é o <form method="POST"> nativo;
//   - não chama preventDefault no submit: o servidor revalida tudo e é a autoridade;
//   - sem este arquivo (JS desligado) o formulário funciona igual.
//
// Quando validar (como no design):
//   - ao SAIR do campo (blur; no checkbox, ao mudar) o campo passa a estar "checado";
//   - depois de checado, a cada tecla (input) o campo é revalidado, para o erro sumir assim
//     que o usuário o corrige. Antes de checado, digitar não mostra erro (seria intrusivo).

import {
  validarCallsign,
  validarEmail,
  validarSenha,
  validarConfirmacao,
  validarTermos,
} from './regras.js';
import { atualizarReadout } from './readout.js';

const form = document.querySelector('form.form');

if (form) {
  const $ = (id) => form.querySelector(`#${id}`);
  const senha = $('password');

  // Cada campo: o elemento, a regra (devolve mensagem ou null) e o evento de "saída".
  // `valido` indica se o campo ganha o tick lime (field--valid) quando está checado e válido.
  // Senha e confirmação também (o servidor só marca callsign e email: a senha nunca volta).
  const campos = {
    callsign: { el: $('callsign'), regra: () => validarCallsign($('callsign').value), valido: true },
    email: { el: $('email'), regra: () => validarEmail($('email').value), valido: true },
    password: { el: senha, regra: () => validarSenha(senha.value), valido: true },
    confirm: { el: $('confirm'), regra: () => validarConfirmacao($('confirm').value, senha.value), valido: true },
    terms: { el: $('terms'), regra: () => validarTermos($('terms').checked), valido: false },
  };

  // Hints que o servidor renderiza quando não há erro (callsign e password). Ao limpar um erro
  // o JS recria o hint com o mesmo texto e o mesmo id, para o aria-describedby voltar a valer.
  const HINTS = {
    callsign: '3–20 characters: letters, numbers, _ or -',
    password: 'At least 8 characters',
  };

  // Estado por campo: já foi checado? qual é o erro atual?
  const estado = Object.fromEntries(
    Object.keys(campos).map((nome) => [nome, { checado: false, erro: null }])
  );

  // Retorno do servidor (422): campos que já chegam com erro contam como checados e guardam a
  // mensagem atual. Assim, corrigir o campo remove o erro a cada tecla, sem esperar um blur.
  Object.keys(campos).forEach((nome) => {
    const existente = $(`${nome}-error`);
    if (existente) {
      estado[nome].checado = true;
      estado[nome].erro = existente.textContent.trim();
    }
  });

  // Região aria-live: "N field(s) need(s) attention", mesmo texto que o servidor escreve.
  // Só é reescrita quando o número muda, para o leitor de tela não repetir o aviso a cada tecla.
  const status = $('form-status');
  const contarErros = () => Object.values(estado).filter(({ erro }) => erro).length;
  let totalAnunciado = contarErros(); // o HTML do servidor já mostra este número

  const atualizarStatus = () => {
    const total = contarErros();
    if (total === totalAnunciado) return;
    totalAnunciado = total;
    status.textContent = total === 0 ? '' : `${total} ${total === 1 ? 'field needs' : 'fields need'} attention`;
  };

  // Troca o conteúdo de apoio do campo: mensagem de erro OU hint, com o mesmo HTML do servidor.
  // O texto entra por textContent (nunca innerHTML): mesmo que viesse do usuário, não vira HTML.
  const renderizarMensagem = (nome, erro) => {
    const { el } = campos[nome];
    const caixa = el.closest('.field, .checkbox');
    $(`${nome}-error`)?.remove();
    $(`${nome}-hint`)?.remove();

    let mensagem = null;
    if (erro) {
      mensagem = document.createElement('p');
      mensagem.className = 'field__error';
      mensagem.id = `${nome}-error`;
      const icone = document.createElement('img');
      icone.src = '/assets/images/icon-alert.svg';
      icone.alt = '';
      icone.width = 16;
      icone.height = 16;
      icone.setAttribute('aria-hidden', 'true');
      mensagem.append(icone, ` ${erro}`);
    } else if (HINTS[nome]) {
      mensagem = document.createElement('p');
      mensagem.className = 'field__hint';
      mensagem.id = `${nome}-hint`;
      mensagem.textContent = HINTS[nome];
    }

    if (mensagem) {
      // Na senha a mensagem fica em .field__meta, ao lado do rótulo de força
      if (nome === 'password') caixa.querySelector('.field__meta').prepend(mensagem);
      else caixa.append(mensagem);
    }

    // aria-describedby: erro ou hint; a senha mantém também o rótulo de força
    const ids = [];
    if (mensagem) ids.push(mensagem.id);
    if (nome === 'password') ids.push('password-strength');
    if (ids.length > 0) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };

  // Aplica o resultado da regra ao DOM: aria-invalid, classes de estado, mensagem e status.
  const aplicar = (nome, erro) => {
    const { el, valido } = campos[nome];
    const anterior = estado[nome].erro;
    estado[nome].erro = erro;

    if (erro) {
      el.setAttribute('aria-invalid', 'true');
    } else {
      el.removeAttribute('aria-invalid');
    }

    const caixa = el.closest('.field, .checkbox');
    const tipo = caixa.classList.contains('checkbox') ? 'checkbox' : 'field';
    caixa.classList.toggle(`${tipo}--error`, Boolean(erro));
    if (valido) {
      // Verde só quando checado, sem erro e com algo digitado
      caixa.classList.toggle('field--valid', !erro && el.value.trim() !== '');
    }

    // Só mexe na mensagem quando ela muda (evita reanunciar o mesmo texto a cada tecla)
    if (erro !== anterior || (!erro && !$(`${nome}-hint`) && HINTS[nome])) {
      renderizarMensagem(nome, erro);
    }
    atualizarStatus();
    atualizarReadout(nome, erro);
  };

  const validar = (nome) => aplicar(nome, campos[nome].regra());

  Object.entries(campos).forEach(([nome, { el }]) => {
    const evento = nome === 'terms' ? 'change' : 'blur';

    el.addEventListener(evento, (e) => {
      // O usuário saiu do campo para CLICAR no botão de envio: inserir a mensagem agora empurraria
      // o botão para baixo entre o mousedown e o mouseup e o clique se perderia. Pula a
      // validação; o servidor valida tudo no envio e devolve o formulário com as mensagens.
      if (e.relatedTarget?.matches?.('button[type="submit"]')) return;
      estado[nome].checado = true;
      validar(nome);
    });

    // Checkbox já reage no change; os campos de texto revalidam a cada tecla depois de checados
    if (nome !== 'terms') {
      el.addEventListener('input', () => {
        if (!estado[nome].checado) return;
        validar(nome);
        // Mudar a senha pode tornar a confirmação (já checada) igual ou diferente
        if (nome === 'password' && estado.confirm.checado) validar('confirm');
      });
    }
  });
}
