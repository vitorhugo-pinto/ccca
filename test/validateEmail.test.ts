import { validateEmail } from "../src/validateEmail";

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
