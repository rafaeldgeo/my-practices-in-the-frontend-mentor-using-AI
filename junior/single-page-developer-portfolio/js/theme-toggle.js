import { THEME_KEY, resolveTheme, toggleTheme } from "./theme.js";

// Botão de tema e nomes acessíveis que dizem a ação do próximo clique
const button = document.querySelector(".theme-toggle");
const LABELS = { dark: "Switch to light theme", light: "Switch to dark theme" };

// Lê a escolha gravada; sem acesso ao armazenamento (modo privado, bloqueio), devolve null
const readStored = () => {
  try {
    return window.localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

// Grava a escolha; se o armazenamento falhar, o tema vale só durante a visita
const store = (theme) => {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // sem armazenamento: nada a fazer
  }
};

// Aplica o tema no <html> e atualiza o nome acessível do botão
const apply = (theme) => {
  document.documentElement.dataset.theme = theme;
  button.setAttribute("aria-label", LABELS[theme]);
};

apply(resolveTheme(readStored()));

// O clique alterna a partir do tema aplicado, aplica na hora e grava a escolha
button.addEventListener("click", () => {
  const next = toggleTheme(document.documentElement.dataset.theme);
  apply(next);
  store(next);
});
