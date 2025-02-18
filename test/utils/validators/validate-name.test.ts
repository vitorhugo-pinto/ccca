import { validateName } from "../../../src/utils/validators/validate-name";

test.each(["John Doe", "john doe"])(
  "Must valid name %s",
  function (name: string) {
    const isValid = validateName(name);
    expect(isValid).toBe(true);
  }
);

test.each(["", "John", "John1"])(
  "Must invalid name %s",
  function (name: string) {
    const isValid = validateName(name);
    expect(isValid).toBe(false);
  }
);
