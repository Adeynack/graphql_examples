import { createHash } from 'crypto';

export function generatePasswordDigest(plainTextPassword: string): string {
  return createHash('md5').update(plainTextPassword).digest('hex');
}
