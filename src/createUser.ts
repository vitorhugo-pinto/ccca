import { Request } from "express";
import { type IDatabase } from "pg-promise";
import { type IClient } from "pg-promise/typescript/pg-subset";

export async function createUser(
  request: Request,
  connection: IDatabase<{}, IClient>
) {
  const input = request.body;
  const id = crypto.randomUUID();
  await connection.query(
    "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      id,
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      !!input.isPassenger,
      !!input.isDriver,
      input.password,
    ]
  );

  return {
    accountId: id,
  };
}
