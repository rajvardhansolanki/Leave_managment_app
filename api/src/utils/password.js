import bcrypt from 'bcrypt';

/**
 * Generate Password
 */
const generatePassword = (length = 6) => {
  let text = '';
  let possible = process.env.POSSIBLE_PASSWORDS;

  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

/**
 * Encrypt the password using bcrypt algo
 */
const encryptPassword = (password, salt) => {
  return bcrypt.hashSync(password, salt);
};

/**
 * Compare the password using bcrypt algo
 */
const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
/**
 * Generates Salt for the password
 */
const generateSalt = (length = 10) => {
  return bcrypt.genSaltSync(length);
};

/**
 * Encrypt Email and Id
 */

export { generatePassword, encryptPassword, comparePassword, generateSalt };
