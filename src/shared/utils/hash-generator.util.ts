import { createHash, randomBytes } from 'crypto';

export function generateRandomSHA256() {
  const bytes = randomBytes(32);

  const hash = createHash('sha256').update(bytes).digest('hex');
  return hash;
}
