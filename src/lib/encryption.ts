import crypto from 'crypto';
import { env } from './envLoad'

export function encrypt(data: string) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(env.encryption.key, 'hex'), Buffer.from(env.encryption.iv, 'hex'));
  let encryptedData = cipher.update(data);
  return Buffer.concat([encryptedData, cipher.final()]).toString();
}

export function decrypt(encryptedData: string) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(env.encryption.key, 'hex'), Buffer.from(env.encryption.iv, 'hex'));
  let data = decipher.update(Buffer.from(encryptedData, 'hex'));
  return Buffer.concat([data, decipher.final()]).toString();
}

export const nonce = crypto.randomBytes(16).toString('hex');