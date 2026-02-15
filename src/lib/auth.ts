import bcrypt from 'bcryptjs';

const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'admin123';

export function validatePassword(password: string): boolean {
  return password === AUTH_PASSWORD;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}