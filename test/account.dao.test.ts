import { AccountDAO } from "../src/account.dao";

test("Should save an account", async function () {
  const accountDAO = new AccountDAO();
  const account = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  const { accountId } = await accountDAO.saveAccount(account);
  const accountByEmail = await accountDAO.getAccountByEmail(account.email);
  expect(accountByEmail.name).toBe(account.name);
  expect(accountByEmail.email).toBe(account.email);
  expect(accountByEmail.cpf).toBe(account.cpf);
  expect(accountByEmail.password).toBe(account.password);
  const accountById = await accountDAO.getAccountById(accountId);
  expect(accountById.name).toBe(account.name);
  expect(accountById.email).toBe(account.email);
  expect(accountById.cpf).toBe(account.cpf);
  expect(accountById.password).toBe(account.password);
});
