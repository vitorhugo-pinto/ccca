import pgp from "pg-promise";
import express from "express";
import { validateCpf } from "./validateCpf";
import { validateName } from "./validateName";
import { validateEmail } from "./validateEmail";
import { validatePassword } from "./validatePassword";
import { validateCarPlate } from "./validateCarPlate";
import { createUser } from "./createUser";

export const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const input = req.body;
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const [accountExists] = await connection.query(
      "select * from ccca.account where email = $1",
      [input.email]
    );
    if (accountExists)
      return res.status(422).json({ message: "Already exists" });
    if (!validateName(input.name))
      return res.status(422).json({ message: "Invalid name" });
    if (!validateEmail(input.email))
      return res.status(422).json({ message: "Invalid email" });
    if (!validatePassword(input.password))
      return res.status(422).json({ message: "Invalid password" });
    if (!validateCpf(input.cpf))
      return res.status(422).json({ message: "Invalid CPF" });
    if (input.isDriver && !validateCarPlate(input.carPlate))
      return res.status(422).json({ message: "Invalid car plate" });

    const createdUserId = await createUser(req, connection);
    return res.json(createdUserId);
  } finally {
    await connection.$pool.end();
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const accountId = req.params.accountId;
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  const [output] = await connection.query(
    "select * from ccca.account where account_id = $1",
    [accountId]
  );
  await connection.$pool.end();
  res.json(output ?? null);
});

app.listen(3000);
