// Chave do localStorage onde a escolha do tema é gravada (a mesma do script inline do <head>)
export const THEME_KEY = "theme";

// Tema a aplicar a partir do valor gravado: só "light" vale, qualquer outro valor abre no dark
export const resolveTheme = (stored) => (stored === "light" ? "light" : "dark");

// Tema oposto ao atual
export const toggleTheme = (current) => (current === "dark" ? "light" : "dark");
