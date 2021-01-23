/**
 * Returns a random-ish alphanumeric string 32 characters long
 */
export const randomId = (item?: unknown, index?: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomChars = `${typeof item}_${index}_`;
  const maxChars = 32;

  for (let i = 0; i < maxChars; i++) {
    const j = Math.floor(Math.random() * chars.length);
    randomChars = randomChars + chars.charAt(j);
  }

  return randomChars;
};
