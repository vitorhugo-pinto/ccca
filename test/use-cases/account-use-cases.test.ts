import { AccountDAO, AccountDAOMemory } from "../../src/account.dao";
import { GetAccountByIdUseCase } from "../../src/use-cases/account/get-account-by-id.use-case";
import { CreateAccountUseCase } from "../../src/use-cases/account/create-account.use-case";
import sinon from "sinon";

let createAccountUseCase: CreateAccountUseCase;
let getAccountByIdUseCase: GetAccountByIdUseCase;

beforeEach(() => {
  const accountDAO = new AccountDAO();
  createAccountUseCase = new CreateAccountUseCase(accountDAO);
  getAccountByIdUseCase = new GetAccountByIdUseCase(accountDAO);
});

test("Deve fazer a criação da conta de um usuário do tipo passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  const outputSignup = await createAccountUseCase.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccountByIdUseCase.execute(
    outputSignup.accountId
  );
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
});

test("Deve fazer a criação da conta de um usuário do tipo motorista", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignup = await createAccountUseCase.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccountByIdUseCase.execute(
    outputSignup.accountId
  );
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
});

test("Não deve fazer a criação da conta de um usuário se o nome for inválido", async function () {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  await expect(() => createAccountUseCase.execute(input)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("Não deve fazer a criação da conta de um usuário se o email for inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  await expect(() => createAccountUseCase.execute(input)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test("Não deve fazer a criação da conta de um usuário se o cpf for inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "974563215",
    password: "asdQWE123",
    isPassenger: true,
  };
  await expect(() => createAccountUseCase.execute(input)).rejects.toThrow(
    new Error("Invalid CPF")
  );
});

test("Não deve fazer a criação da conta de um usuário se o senha for inválida", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE",
    isPassenger: true,
  };
  await expect(() => createAccountUseCase.execute(input)).rejects.toThrow(
    new Error("Invalid password")
  );
});

test("Não deve fazer a criação da conta de um usuário se a conta estiver duplicada", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  await createAccountUseCase.execute(input);
  await expect(() => createAccountUseCase.execute(input)).rejects.toThrow(
    new Error("Account already exists")
  );
});

test("Não deve fazer a criação da conta de um usuário se a placa for inválida", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    carPlate: "AAA999",
    isDriver: true,
  };
  await expect(() => createAccountUseCase.execute(input)).rejects.toThrow(
    new Error("Invalid car plate")
  );
});

// Test Patterns

test("Deve fazer a criação da conta de um usuário do tipo passageiro com stub", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  const saveAccountStub = sinon
    .stub(AccountDAO.prototype, "saveAccount")
    .resolves({ accountId: crypto.randomUUID() });
  const getAccountByEmailStub = sinon
    .stub(AccountDAO.prototype, "getAccountByEmail")
    .resolves();
  const getAccountById = sinon
    .stub(AccountDAO.prototype, "getAccountById")
    .resolves(input);
  const { accountId } = await createAccountUseCase.execute(input);
  expect(accountId).toBeDefined();
  const outputGetAccount = await getAccountByIdUseCase.execute(accountId);
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  saveAccountStub.restore();
  getAccountByEmailStub.restore();
  getAccountById.restore();
});

test("Deve fazer a criação da conta de um usuário do tipo passageiro com spy", async function () {
  const saveAccountSpy = sinon.spy(AccountDAO.prototype, "saveAccount");
  const getAccountByIdSpy = sinon.spy(AccountDAO.prototype, "getAccountById");
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  const outputSignup = await createAccountUseCase.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccountByIdUseCase.execute(
    outputSignup.accountId
  );
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(saveAccountSpy.calledOnce).toBe(true);
  expect(getAccountByIdSpy.calledWith(outputSignup.accountId)).toBe(true);
  saveAccountSpy.restore();
  getAccountByIdSpy.restore();
});

test("Deve fazer a criação da conta de um usuário do tipo passageiro com mock", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  const accountDAOMock = sinon.mock(AccountDAO.prototype);
  accountDAOMock
    .expects("saveAccount")
    .once()
    .resolves({ accountId: crypto.randomUUID() });
  accountDAOMock.expects("getAccountByEmail").once().resolves();
  const outputSignup = await createAccountUseCase.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  accountDAOMock
    .expects("getAccountById")
    .once()
    .withArgs(outputSignup.accountId)
    .resolves(input);
  const outputGetAccount = await getAccountByIdUseCase.execute(
    outputSignup.accountId
  );
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  accountDAOMock.verify();
  accountDAOMock.restore();
});

test("Should create an account as passenger with fake pattern", async function () {
  const accountDAO = new AccountDAOMemory();
  createAccountUseCase = new CreateAccountUseCase(accountDAO);
  getAccountByIdUseCase = new GetAccountByIdUseCase(accountDAO);
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  const outputSignup = await createAccountUseCase.execute(input);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await getAccountByIdUseCase.execute(
    outputSignup.accountId
  );
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
});

test("Should not create an account as passenger with fake pattern due to already exists", async function () {
  const accountDAO = new AccountDAOMemory();
  createAccountUseCase = new CreateAccountUseCase(accountDAO);
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "asdQWE123",
    isPassenger: true,
  };
  await createAccountUseCase.execute(input);
  await expect(() => createAccountUseCase.execute(input)).rejects.toThrow(
    new Error("Account already exists")
  );
});
