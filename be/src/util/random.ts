import { randomBytes } from 'crypto';

export function generateRandomString(length = 15) {
  return randomBytes(length)
    .toString('base64') // Convert to Base64 (contains letters, numbers, and `+/=`)
    .replace(/[^a-zA-Z]/g, '') // Remove non-letter characters
    .slice(0, length); // Trim to required length
}
