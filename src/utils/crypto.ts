import crypto from 'crypto';

export const generateToken = async (
  bytes = 32,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): Promise<string> =>
  await new Promise((resolve) => {
    crypto.randomBytes(bytes, (err, buf) => {
      let token = '';
      for (let i = 0; i < buf.length; ++i) {
        token += chars[buf.readUInt8(i) % chars.length];
      }
      return resolve(token);
    });
  });
