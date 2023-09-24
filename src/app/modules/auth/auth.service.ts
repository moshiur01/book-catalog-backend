import { User } from '@prisma/client';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';
import { utilsFunctions } from '../../../shared/utils';

const insertIntoDB = async (data: User): Promise<Partial<User>> => {
  const { password } = data;
  const hashPassword = await utilsFunctions.hashPassword(password);
  data.password = hashPassword;
  const result = await prisma.user.create({
    data,
  });

  return excludeFields(result, ['createdAt', 'updatedAt', 'password']);
};

export const authService = {
  insertIntoDB,
};
