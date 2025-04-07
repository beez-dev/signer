import * as crypto from 'crypto';

export function hash(val: string) {
  return crypto.createHash('sha256').update(val).digest('hex');
}
