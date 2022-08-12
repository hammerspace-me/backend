import { randomInt } from 'node:crypto';

export function generateActivationCode(length: number = 6) {
  let activationCode = randomInt(10).toString();
  for (let i = 0; i < length - 1; i++) {
    activationCode += randomInt(10).toString();
  }
  return activationCode;
}
