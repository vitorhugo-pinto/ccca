import { AccountDAOInterface } from "../../account.dao";
import { validateCarPlate } from "../../utils/validators/validate-car-plate";
import { validateCpf } from "../../utils/validators/validate-cpf";
import { validateEmail } from "../../utils/validators/validate-email";
import { validateName } from "../../utils/validators/validate-name";
import { validatePassword } from "../../utils/validators/validate-password";

export class CreateAccountUseCase {
  constructor(readonly databaseDAO: AccountDAOInterface) {}
  async execute(input: any) {
    const accountExists = await this.databaseDAO.getAccountByEmail(input.email);
    if (accountExists) throw new Error("Account already exists");
    if (!validateName(input.name)) throw new Error("Invalid name");
    if (!validateEmail(input.email)) throw new Error("Invalid email");
    if (!validatePassword(input.password)) throw new Error("Invalid password");
    if (!validateCpf(input.cpf)) throw new Error("Invalid CPF");
    if (input.isDriver && !validateCarPlate(input.carPlate))
      throw new Error("Invalid car plate");
    return await this.databaseDAO.saveAccount(input);
  }
}
