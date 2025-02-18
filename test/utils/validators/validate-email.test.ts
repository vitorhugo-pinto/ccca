import { validateEmail } from "../../../src/utils/validators/validate-email";

test.each(["John@Doe", "john@doe"])(
  "Must valid email %s",
  function (email: string) {
    const isValid = validateEmail(email);
    expect(isValid).toBe(true);
  }
);

test.each(["", "john@"])("Must invalid email %s", function (email: string) {
  const isValid = validateEmail(email);
  expect(isValid).toBe(false);
});
