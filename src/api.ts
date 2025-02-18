import express from "express";
import { CreateAccountUseCase } from "./use-cases/account/create-account.use-case";
import { GetAccountByIdUseCase } from "./use-cases/account/get-account-by-id.use-case";
import { AccountDAO } from "./account.dao";

export const app = express();
app.use(express.json());

const accountDAO = new AccountDAO();
const createAccountUseCase = new CreateAccountUseCase(accountDAO);
const getAccountByIdUseCase = new GetAccountByIdUseCase(accountDAO);

app.post("/signup", async function (req, res) {
  const input = req.body;
  try {
    const output = await createAccountUseCase.execute(input);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const accountId = req.params.accountId;
  const output = await getAccountByIdUseCase.execute(accountId);
  res.json(output);
});

app.listen(3000);
