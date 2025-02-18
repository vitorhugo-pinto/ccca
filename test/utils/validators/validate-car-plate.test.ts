import { validateCarPlate } from "../../../src/utils/validators/validate-car-plate";

test.each(["ABC1234"])("Must valid car plate %s", function (carPlate: string) {
  const isValid = validateCarPlate(carPlate);
  expect(isValid).toBe(true);
});

test.each(["", "abcdefg", "1234567", "aBc1234", "abc1234"])(
  "Must invalid car plate %s",
  function (carPlate: string) {
    const isValid = validateCarPlate(carPlate);
    expect(isValid).toBe(false);
  }
);
