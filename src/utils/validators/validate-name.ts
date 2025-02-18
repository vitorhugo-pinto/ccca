export function validateName(name: string) {
  if (name.match(/[a-zA-Z] [a-zA-Z]+/)) return true;
  return false;
}
