import pgp from "pg-promise";

export interface AccountDAOInterface {
  saveAccount(account: any): Promise<{ accountId: string }>;
  getAccountByEmail(email: string): Promise<any>;
  getAccountById(accountId: string): Promise<any>;
}

export class AccountDAO implements AccountDAOInterface {
  async saveAccount(account: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const id = crypto.randomUUID();
    await connection.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        id,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
        account.password,
      ]
    );
    await connection.$pool.end();
    return {
      accountId: id,
    };
  }

  async getAccountByEmail(email: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query(
      "select * from ccca.account where email = $1",
      [email]
    );
    await connection.$pool.end();
    return account;
  }

  async getAccountById(accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [account] = await connection.query(
      "select * from ccca.account where account_id = $1",
      [accountId]
    );
    await connection.$pool.end();
    return account;
  }
}

export class AccountDAOMemory implements AccountDAOInterface {
  accounts: any[] = [];

  async getAccountByEmail(email: string): Promise<any> {
    return this.accounts.find((account: any) => account.email === email);
  }

  async getAccountById(accountId: string): Promise<any> {
    return this.accounts.find((account: any) => account.id === accountId);
  }

  async saveAccount(account: any): Promise<{ accountId: string }> {
    const saveAccount = {
      id: crypto.randomUUID(),
      ...account,
    };
    this.accounts.push(saveAccount);
    return { accountId: saveAccount.id };
  }
}
