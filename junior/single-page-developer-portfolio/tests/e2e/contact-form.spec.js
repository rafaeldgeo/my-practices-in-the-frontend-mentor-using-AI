import { test, expect } from "@playwright/test";

// Textos exibidos na página, usados como contrato dos testes
const EMPTY = "Can't be empty";
const INVALID_EMAIL = "Sorry, invalid format here";
const SUCCESS = "Thanks for getting in touch! I'll get back to you soon.";
const PROJECTS = [
  "Design portfolio",
  "E-learning landing page",
  "Todo web app",
  "Entertainment web app",
  "Memory Game",
  "Art gallery showcase",
];

// Localizadores compartilhados pelos testes
const getForm = (page) => page.getByRole("form", { name: "Contact form" });
const getFields = (page) => ({
  name: page.getByLabel("Name", { exact: true }),
  email: page.getByLabel("Email", { exact: true }),
  message: page.getByLabel("Message", { exact: true }),
});
const submit = (page) => page.getByRole("button", { name: "Send message" }).click();
const fillAll = async (page, { name, email, message }) => {
  const fields = getFields(page);
  await fields.name.fill(name);
  await fields.email.fill(email);
  await fields.message.fill(message);
};
// Dados válidos reutilizados; cada teste altera só o campo em foco
const VALID = { name: "Jane Doe", email: "jane@mail.com", message: "Hello Adam" };

// Cada teste parte da página recém-carregada
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

// Landmarks e elementos do formulário existem com nome acessível
test.describe("estrutura", () => {
  test("expõe regiões, formulário e seis cards", async ({ page }) => {
    for (const name of ["Hero", "Skills", "Projects", "Contact"]) {
      await expect(page.getByRole("region", { name, exact: true })).toBeVisible();
    }
    await expect(getForm(page)).toBeVisible();
    for (const name of PROJECTS) {
      await expect(page.getByRole("article", { name, exact: true })).toBeVisible();
    }
    await expect(page.getByRole("article")).toHaveCount(6);
  });

  test("formulário tem novalidate", async ({ page }) => {
    await expect(getForm(page)).toHaveAttribute("novalidate", "");
  });

  test("campos e botão têm rótulo acessível", async ({ page }) => {
    const fields = getFields(page);
    await expect(fields.name).toBeVisible();
    await expect(fields.email).toBeVisible();
    await expect(fields.message).toBeVisible();
    await expect(page.getByRole("button", { name: "Send message" })).toBeVisible();
  });
});

// A validação só roda no envio, com mensagens próprias (sem a nativa do navegador)
test.describe("validação ao enviar", () => {
  test("nada é validado antes do envio", async ({ page }) => {
    const { name, email } = getFields(page);
    await name.focus();
    await name.press("Tab");
    await email.fill("adam@invalid");
    await email.press("Tab");
    await expect(page.getByText(EMPTY)).toHaveCount(0);
    await expect(page.getByText(INVALID_EMAIL)).toHaveCount(0);
  });

  test("campos vazios mostram 'Can't be empty' em cada campo", async ({ page }) => {
    await submit(page);
    await expect(page.getByText(EMPTY)).toHaveCount(3);
  });

  test("campo só com espaços é inválido", async ({ page }) => {
    await fillAll(page, { ...VALID, name: "   " });
    await submit(page);
    const { name } = getFields(page);
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAccessibleDescription(EMPTY);
  });

  test("e-mail em formato inválido usa a mensagem do formulário", async ({ page }) => {
    await fillAll(page, { ...VALID, email: "adam@invalid" });
    await submit(page);
    await expect(getFields(page).email).toHaveAccessibleDescription(INVALID_EMAIL);
  });

  test("e-mail com espaço é inválido", async ({ page }) => {
    await fillAll(page, { ...VALID, email: "adam @mail.com" });
    await submit(page);
    await expect(getFields(page).email).toHaveAccessibleDescription(INVALID_EMAIL);
  });

  test("a validação nativa não bloqueia o envio nem mostra balão", async ({ page }) => {
    await fillAll(page, { ...VALID, email: "adam@invalid" });
    await submit(page);
    const validationMessage = await getFields(page).email.evaluate(
      (input) => input.validationMessage
    );
    expect(validationMessage).toBe("");
    await expect(page.getByText(INVALID_EMAIL)).toBeVisible();
  });
});

// Como o erro é exposto: aria-invalid, descrição, ordem, posição e foco
test.describe("apresentação e foco do erro", () => {
  test("campo inválido é marcado e descrito pela mensagem", async ({ page }) => {
    await fillAll(page, { ...VALID, email: "adam@invalid" });
    await submit(page);
    const { name, email, message } = getFields(page);
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAccessibleDescription(INVALID_EMAIL);
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
    await expect(message).not.toHaveAttribute("aria-invalid", "true");
  });

  test("erros aparecem na ordem Name, Email, Message", async ({ page }) => {
    await submit(page);
    const { name, email, message } = getFields(page);
    // Lê a posição vertical de cada erro pelo id referenciado em aria-describedby
    const positions = await Promise.all(
      [name, email, message].map(async (field) => {
        const id = await field.getAttribute("aria-describedby");
        const box = await page.locator(`[id="${id}"]`).boundingBox();
        return box.y;
      })
    );
    expect(positions[0]).toBeLessThan(positions[1]);
    expect(positions[1]).toBeLessThan(positions[2]);
  });

  test("a mensagem de erro fica abaixo do campo", async ({ page }) => {
    await submit(page);
    const { name } = getFields(page);
    const id = await name.getAttribute("aria-describedby");
    const fieldBox = await name.boundingBox();
    const errorBox = await page.locator(`[id="${id}"]`).boundingBox();
    expect(errorBox.y).toBeGreaterThanOrEqual(fieldBox.y + fieldBox.height - 1);
  });

  test("foco vai para o primeiro campo inválido", async ({ page }) => {
    const { name, email } = getFields(page);
    await name.fill("Jane Doe");
    await submit(page);
    await expect(email).toBeFocused();
  });
});

// Digitar limpa o erro do campo, mas não revalida até o próximo envio
test.describe("corrigir o campo", () => {
  test("digitar limpa só o erro do campo corrigido", async ({ page }) => {
    await submit(page);
    const { name, email, message } = getFields(page);
    await name.fill("Jane Doe");
    await expect(name).not.toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText(EMPTY)).toHaveCount(2);
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(message).toHaveAttribute("aria-invalid", "true");
  });

  test("valor ainda inválido não revalida até o próximo envio", async ({ page }) => {
    await fillAll(page, { ...VALID, email: "adam@invalid" });
    await submit(page);
    const { email } = getFields(page);
    await email.fill("adam@");
    await expect(page.getByText(INVALID_EMAIL)).toHaveCount(0);
    await expect(email).not.toHaveAttribute("aria-invalid", "true");
    await submit(page);
    await expect(email).toHaveAccessibleDescription(INVALID_EMAIL);
  });
});

// Envio válido: mensagem em role="status", campos limpos e sem requisição
test.describe("estado de sucesso", () => {
  test("envio válido mostra sucesso e limpa os campos", async ({ page }) => {
    await fillAll(page, VALID);
    await submit(page);
    await expect(page.getByRole("status")).toHaveText(SUCCESS);
    await expect(page.getByText(EMPTY)).toHaveCount(0);
    await expect(page.getByText(INVALID_EMAIL)).toHaveCount(0);
    const { name, email, message } = getFields(page);
    await expect(name).toHaveValue("");
    await expect(email).toHaveValue("");
    await expect(message).toHaveValue("");
  });

  test("a mensagem de sucesso fica dentro de Contact, após o botão", async ({ page }) => {
    await fillAll(page, VALID);
    await submit(page);
    const status = page
      .getByRole("region", { name: "Contact", exact: true })
      .getByRole("status");
    await expect(status).toHaveText(SUCCESS);
    const buttonBox = await page.getByRole("button", { name: "Send message" }).boundingBox();
    const statusBox = await status.boundingBox();
    expect(statusBox.y).toBeGreaterThanOrEqual(buttonBox.y + buttonBox.height - 1);
  });

  test("sucesso some ao digitar", async ({ page }) => {
    await fillAll(page, VALID);
    await submit(page);
    await expect(page.getByRole("status")).toHaveText(SUCCESS);
    await getFields(page).name.fill("J");
    await expect(page.getByText(SUCCESS)).toHaveCount(0);
  });

  test("sucesso some em novo envio inválido", async ({ page }) => {
    await fillAll(page, VALID);
    await submit(page);
    await expect(page.getByRole("status")).toHaveText(SUCCESS);
    await submit(page);
    await expect(page.getByText(SUCCESS)).toHaveCount(0);
    await expect(page.getByText(EMPTY)).toHaveCount(3);
  });

  test("nenhuma requisição de rede é feita no envio", async ({ page }) => {
    await fillAll(page, VALID);
    const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    await submit(page);
    await expect(page.getByRole("status")).toHaveText(SUCCESS);
    expect(requests).toEqual([]);
  });
});
