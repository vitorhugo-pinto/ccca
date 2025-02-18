export function validateCarPlate(carPlate: string) {
  if (carPlate.match(/[A-Z]{3}[0-9]{4}/)) return true;
  return false;
}
