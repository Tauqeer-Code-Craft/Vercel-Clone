import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const algorithm = 'aes-256-cbc';
const ivLength = 16;

const secretKeyHex = process.env.CRYPTO_SECRET_KEY || '';
const secretKey = Buffer.from(secretKeyHex, 'hex');

if (secretKey.length !== 32) {
  throw new Error("CRYPTO_SECRET_KEY must be 32 bytes (64 hex characters)");
}

export const encrypt = (text) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = (encryptedData) => {
  const [ivHex, encryptedText] = encryptedData.split(':');
  if (!ivHex || !encryptedText) throw new Error('Invalid encrypted data format');

  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

