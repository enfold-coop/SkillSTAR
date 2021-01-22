/**
 * Returns a random-ish alphanumeric string 32 characters long
 */
export const randomId = (maxChars = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomChars = '';

  for (let i = 0; i < maxChars; i++) {
    const j = Math.floor(Math.random() * chars.length);
    randomChars = randomChars + chars.charAt(j);
  }

  return randomChars;
};
