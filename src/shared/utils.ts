import bcrypt from 'bcrypt';
import config from '../config';
const hashPassword = async (pass: string): Promise<string> => {
  const hash = await bcrypt.hash(pass, Number(config.bcrypt_salt_rounds));

  return hash;
};

export const utilsFunctions = {
  hashPassword,
};
