import { randomBytes, scryptSync, createHash, BinaryLike } from "crypto";

// Pass the password string and get hashed password back
// ( and store only the hashed string in your database)
const encryptPassword = (password: string, salt: string) => {
  return scryptSync(password, salt, 32).toString("hex");
};

export const generateRandomToken = (length: number): string => {
  return randomBytes(length).toString("hex");
};

export const createHashFn = (data: BinaryLike) => {
  return createHash("sha256").update(data).digest("hex");
};

/**
 * Hash password with random salt
 * @return {string} password hash followed by salt
 *  XXXX till 64 XXXX till 32
 *
 */
export const hashPassword = (password: string): string => {
  // Any random string here (ideally should be at least 16 bytes)
  const salt = generateRandomToken(16);
  return encryptPassword(password, salt) + salt;
};

// fetch the user from your db and then use this function

/**
 * Match password against the stored hash
 */
export const matchPassword = (password: string, hash: string): Boolean => {
  // extract salt from the hashed string
  // our hex password length is 32*2 = 64
  const salt = hash.slice(64);
  const originalPassHash = hash.slice(0, 64);
  const currentPassHash = encryptPassword(password, salt);
  return originalPassHash === currentPassHash;
};
