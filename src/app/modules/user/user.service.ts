import { User } from '@prisma/client';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';

const getAllFromDb = async (): Promise<User[] | User> => {
  const result = await prisma.user.findMany();

  return excludeFields(result, ['createdAt', 'updatedAt', 'password']);
};

export const userService = {
  getAllFromDb,
};
