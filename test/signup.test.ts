import pgp from "pg-promise";

const baseURL = "http://localhost:3000";
const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

type FetchUserResponseType = {
  account_id: string;
  name: string;
  email: string;
  password: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
};

type SignUpInputType = {
  name: string;
  email: string;
  password: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
};

async function signUpUser(bodyJson: SignUpInputType) {
  const response = await fetch(`${baseURL}/signup`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(bodyJson),
  });
  return response;
}

async function fetchUserById(userId: string) {
  const response = await fetch(`${baseURL}/accounts/${userId}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return response;
}

beforeEach(() => {
  connection.query("delete from ccca.account");
});

afterAll(() => {
  connection.$pool.end();
});

describe("Sing up tests", function () {
  test("Successfully signing up", async function () {
    const response = await signUpUser({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "asd123ASD",
      cpf: "05641429481",
      carPlate: "",
      isDriver: false,
      isPassenger: false,
    });
    const responseJson = await response.json();
    expect(responseJson).toHaveProperty("accountId");
  });

  test("Fails due to invalid CPF", async function () {
    const response = await signUpUser({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "asd123ASD",
      cpf: "11111111111",
      carPlate: "",
      isDriver: false,
      isPassenger: false,
    });
    const responseJson = await response.json();
    expect(responseJson.message).toBe("Invalid CPF");
  });

  test("Fails due to invalid email", async function () {
    const response = await signUpUser({
      name: "John Doe",
      email: "invalid",
      password: "asd123ASD",
      cpf: "05641429481",
      carPlate: "",
      isDriver: false,
      isPassenger: false,
    });
    const responseJson = await response.json();
    expect(responseJson.message).toBe("Invalid email");
  });

  test("Fails due to invalid name", async function () {
    const response = await signUpUser({
      name: "invalid",
      email: "johndoe@email.com",
      password: "asd123ASD",
      cpf: "05641429481",
      carPlate: "",
      isDriver: false,
      isPassenger: false,
    });
    const responseJson = await response.json();
    expect(responseJson.message).toBe("Invalid name");
  });

  test("Fails due to already exists", async function () {
    await signUpUser({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "asd123ASD",
      cpf: "05641429481",
      carPlate: "",
      isDriver: false,
      isPassenger: false,
    });
    const response = await signUpUser({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "asd123ASD",
      cpf: "05641429481",
      carPlate: "",
      isDriver: false,
      isPassenger: false,
    });
    const responseJson = await response.json();
    expect(responseJson.message).toBe("Already exists");
  });

  test("Fails due to invalid password", async function () {
    const response = await signUpUser({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "asd",
      cpf: "05641429481",
      carPlate: "",
      isDriver: false,
      isPassenger: false,
    });
    const responseJson = await response.json();
    expect(responseJson.message).toBe("Invalid password");
  });

  test("Fails due to invalid car plate", async function () {
    const response = await signUpUser({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "asd123ASD",
      cpf: "05641429481",
      carPlate: "invalid",
      isDriver: true,
      isPassenger: false,
    });
    const responseJson = await response.json();
    expect(responseJson.message).toBe("Invalid car plate");
  });
});

describe("Get an account by id", function () {
  test("Successfully fetches a user by id", async function () {
    const expectedResponse = {} as FetchUserResponseType;
    const createUserResponse = await signUpUser({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "asd123ASD",
      cpf: "05641429481",
      carPlate: "",
      isDriver: false,
      isPassenger: false,
    });
    const { accountId } = await createUserResponse.json();
    const response = await fetchUserById(accountId);
    const responseJson = await response.json();
    expect(responseJson).toMatchObject<FetchUserResponseType>({
      ...expectedResponse,
      account_id: accountId,
    });
  });

  test("Successfully fetches when user does not exists", async function () {
    const accountId = "d4c5ac45-872b-4e61-80b6-ab287e32c991";
    const response = await fetchUserById(accountId);
    const responseJson = await response.json();
    expect(responseJson).toBeFalsy();
  });
});
