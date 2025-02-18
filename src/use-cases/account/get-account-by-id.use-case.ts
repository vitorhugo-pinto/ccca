import { AccountDAOInterface } from "../../account.dao";

export class GetAccountByIdUseCase {
  constructor(readonly databaseDAO: AccountDAOInterface) {}
  async execute(accountId: string) {
    return await this.databaseDAO.getAccountById(accountId);
  }
}
