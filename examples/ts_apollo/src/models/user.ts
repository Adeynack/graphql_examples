import { createHmac } from 'crypto';

export function generatePasswordDigest(salt: string, plainTextPassword: string): string {
  return createHmac('md5', salt).update(plainTextPassword).digest('hex');
}
