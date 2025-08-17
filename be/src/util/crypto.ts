import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

export function hashString(val: string) {
    return crypto.createHash('sha256').update(val).digest('hex');
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function comparePassword(
    password: string,
    hashedPassword: string,
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// Alias for backward compatibility
export const hash = hashPassword;
export const compare = comparePassword;
