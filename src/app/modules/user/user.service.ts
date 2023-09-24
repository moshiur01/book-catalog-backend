import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';

const getAllFromDb = async (): Promise<User[]> => {
  const result = await prisma.user.findMany();
  return result;
};

export const userService = {
  getAllFromDb,
};
