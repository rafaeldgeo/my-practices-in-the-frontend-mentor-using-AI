// Botão de envio: "Transmitting_" enquanto o navegador envia o formulário.
// O envio continua sendo o POST NATIVO do <form>: aqui não há preventDefault no primeiro
// submit, nem fetch. O JS só mostra o estado de loading (CSS: .button[aria-busy='true']).

const form = document.querySelector('form.form');
const botao = form?.querySelector('button[type="submit"]');
const rotulo = botao?.querySelector('.button__label');

if (form && botao && rotulo) {
  const textoOriginal = rotulo.textContent;

  const ocupado = () => botao.getAttribute('aria-busy') === 'true';

  form.addEventListener('submit', (evento) => {
    // Segundo submit enquanto o primeiro está em andamento (duplo clique/Enter): cancela
    // só este, para não enviar o formulário duas vezes. O primeiro segue normalmente.
    if (ocupado()) {
      evento.preventDefault();
      return;
    }
    botao.setAttribute('aria-busy', 'true');
    rotulo.textContent = 'Transmitting_';
  });

  // Voltar pelo histórico pode restaurar a página (bfcache) com o botão ainda ocupado
  window.addEventListener('pageshow', (evento) => {
    if (!evento.persisted) return;
    botao.removeAttribute('aria-busy');
    rotulo.textContent = textoOriginal;
  });
}
