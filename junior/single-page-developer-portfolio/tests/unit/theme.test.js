import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { THEME_KEY, resolveTheme, toggleTheme } from "../../js/theme.js";

// Chave gravada no localStorage, igual à usada pelo script inline do <head>
describe("THEME_KEY", () => {
  it("é a chave 'theme'", () => {
    assert.equal(THEME_KEY, "theme");
  });
});

// Tema a aplicar a partir do valor gravado: só "light" vale, o resto abre no dark
describe("resolveTheme", () => {
  it("devolve light para o valor 'light'", () => {
    assert.equal(resolveTheme("light"), "light");
  });

  it("devolve dark para o valor 'dark'", () => {
    assert.equal(resolveTheme("dark"), "dark");
  });

  it("devolve dark sem valor gravado (null e undefined)", () => {
    assert.equal(resolveTheme(null), "dark");
    assert.equal(resolveTheme(undefined), "dark");
  });

  it("devolve dark para string vazia", () => {
    assert.equal(resolveTheme(""), "dark");
  });

  it("devolve dark para valor desconhecido", () => {
    assert.equal(resolveTheme("blue"), "dark");
  });

  it("não aceita variação de caixa ou espaços", () => {
    assert.equal(resolveTheme("Light"), "dark");
    assert.equal(resolveTheme(" light "), "dark");
  });
});

// Alternar devolve sempre o tema oposto
describe("toggleTheme", () => {
  it("troca dark por light", () => {
    assert.equal(toggleTheme("dark"), "light");
  });

  it("troca light por dark", () => {
    assert.equal(toggleTheme("light"), "dark");
  });

  it("alternar duas vezes volta ao tema de origem", () => {
    assert.equal(toggleTheme(toggleTheme("dark")), "dark");
    assert.equal(toggleTheme(toggleTheme("light")), "light");
  });
});
