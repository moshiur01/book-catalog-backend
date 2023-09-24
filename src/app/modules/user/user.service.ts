import { User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';

const getAllFromDb = async (): Promise<User[] | User> => {
  const result = await prisma.user.findMany();

  return excludeFields(result, ['createdAt', 'updatedAt', 'password']);
};

const getSingleUserFromDb = async (
  id: string
): Promise<Partial<User> | null> => {
  const result = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (result === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not Found');
  }

  return excludeFields(result, [
    'createdAt',
    'updatedAt',
    'password',
  ]) as Partial<User>;
};

const updateUser = async (
  id: string,
  payload: Partial<User>
): Promise<Partial<User>> => {
  const isExist = prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.OK, 'User not Found');
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });
  return excludeFields(result, [
    'createdAt',
    'updatedAt',
    'password',
  ]) as Partial<User>;
};

export const userService = {
  getAllFromDb,
  getSingleUserFromDb,
  updateUser,
};
