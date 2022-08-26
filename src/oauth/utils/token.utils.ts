import { randomBytes } from 'node:crypto';

export function generateToken(length: number = 32) {
  return randomBytes(length).toString('hex');
}
