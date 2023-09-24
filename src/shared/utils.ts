import bcrypt from 'bcrypt';
import config from '../config';
const hashPassword = async (pass: string): Promise<string> => {
  const hash = await bcrypt.hash(pass, Number(config.bcrypt_salt_rounds));

  return hash;
};

const isPasswordMatch = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const utilsFunctions = {
  hashPassword,
  isPasswordMatch,
};
