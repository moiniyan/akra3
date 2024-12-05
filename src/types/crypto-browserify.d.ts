import type { Hash, Hmac, Cipher, Decipher, Signer, Verify, DiffieHellman } from 'crypto';

declare module 'crypto-browserify' {
  export function createHash(algorithm: string): Hash;
  export function createHmac(algorithm: string, key: string | Buffer): Hmac;
  export function createCipher(algorithm: string, password: string | Buffer): Cipher;
  export function createCipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer): Cipher;
  export function createDecipher(algorithm: string, password: string | Buffer): Decipher;
  export function createDecipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer): Decipher;
  export function createSign(algorithm: string): Signer;
  export function createVerify(algorithm: string): Verify;
  export function createDiffieHellman(prime_length: number, generator?: number): DiffieHellman;
  export function createDiffieHellman(prime: Buffer): DiffieHellman;
  export function getDiffieHellman(group_name: string): DiffieHellman;
  export function pbkdf2(
    password: string | Buffer,
    salt: string | Buffer,
    iterations: number,
    keylen: number,
    digest: string,
    callback: (err: Error | null, derivedKey: Buffer) => void
  ): void;
  export function pbkdf2Sync(
    password: string | Buffer,
    salt: string | Buffer,
    iterations: number,
    keylen: number,
    digest: string
  ): Buffer;
  export function randomBytes(size: number): Buffer;
  export function pseudoRandomBytes(size: number): Buffer;
}