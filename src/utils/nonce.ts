export const parseNonceFromMessage = (message: string): string =>
  message.substring(message.length - 6);
