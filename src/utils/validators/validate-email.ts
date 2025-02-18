export function validateEmail(email: string) {
  if (email.match(/^(.+)@(.+)$/)) return true;
  return false;
}
