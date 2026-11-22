import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateName,
  validateEmail,
  validateMessage,
  validateForm,
} from "../../js/validation.js";

// Mensagens esperadas, iguais às exibidas no formulário
const EMPTY = "Can't be empty";
const INVALID_EMAIL = "Sorry, invalid format here";

// Nome: obrigatório, espaços nas pontas não contam
describe("validateName", () => {
  it("devolve null para um nome válido", () => {
    assert.equal(validateName("Adam Keyes"), null);
  });

  it("devolve erro para vazio", () => {
    assert.equal(validateName(""), EMPTY);
  });

  it("devolve erro para só espaços", () => {
    assert.equal(validateName("   "), EMPTY);
  });

  it("trata undefined e null como vazio", () => {
    assert.equal(validateName(undefined), EMPTY);
    assert.equal(validateName(null), EMPTY);
  });
});

// Mensagem: mesma regra do nome (obrigatória, sem só espaços)
describe("validateMessage", () => {
  it("devolve null para uma mensagem válida", () => {
    assert.equal(validateMessage("Hello there"), null);
  });

  it("devolve erro para vazio", () => {
    assert.equal(validateMessage(""), EMPTY);
  });

  it("devolve erro para só espaços", () => {
    assert.equal(validateMessage(" \t "), EMPTY);
  });

  it("trata undefined e null como vazio", () => {
    assert.equal(validateMessage(undefined), EMPTY);
    assert.equal(validateMessage(null), EMPTY);
  });
});

// E-mail: vazio tem mensagem própria; formato exige algo@dominio.sufixo
describe("validateEmail", () => {
  it("devolve null para e-mails válidos", () => {
    assert.equal(validateEmail("adam@mail.com"), null);
    assert.equal(validateEmail("adam.keyes@mail.co.uk"), null);
    assert.equal(validateEmail("  adam@mail.com  "), null);
  });

  it("aceita o limite a@b.c", () => {
    assert.equal(validateEmail("a@b.c"), null);
  });

  it("devolve erro de vazio para vazio e só espaços", () => {
    assert.equal(validateEmail(""), EMPTY);
    assert.equal(validateEmail("   "), EMPTY);
  });

  it("trata undefined e null como vazio", () => {
    assert.equal(validateEmail(undefined), EMPTY);
    assert.equal(validateEmail(null), EMPTY);
  });

  it("devolve erro de formato para e-mails inválidos", () => {
    // Casos de borda: sem "@", sem sufixo, espaços, "@" duplicado e pontos vazios
    const invalids = [
      "adam",
      "adam@",
      "@mail.com",
      "adam@invalid",
      "adam @mail.com",
      "adam@ma il.com",
      "a@@b.com",
      "a@b@c.com",
      "a@b.",
      "a@.com",
      "a@b..com",
    ];
    invalids.forEach((value) => {
      assert.equal(validateEmail(value), INVALID_EMAIL, `"${value}" deveria ser inválido`);
    });
  });
});

// Formulário: devolve só os campos inválidos, objeto vazio se tudo é válido
describe("validateForm", () => {
  it("devolve objeto vazio quando tudo é válido", () => {
    assert.deepEqual(
      validateForm({ name: "Adam", email: "adam@mail.com", message: "Hi" }),
      {}
    );
  });

  it("devolve erro nos três campos quando tudo está vazio", () => {
    assert.deepEqual(validateForm({ name: "", email: "", message: "" }), {
      name: EMPTY,
      email: EMPTY,
      message: EMPTY,
    });
  });

  it("devolve só as chaves inválidas", () => {
    assert.deepEqual(
      validateForm({ name: "Adam", email: "adam@invalid", message: "Hi" }),
      { email: INVALID_EMAIL }
    );
  });

  it("combina erros de campos diferentes", () => {
    assert.deepEqual(
      validateForm({ name: "  ", email: "adam@mail.com", message: "" }),
      { name: EMPTY, message: EMPTY }
    );
  });
});
