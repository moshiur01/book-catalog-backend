/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';

const getProfile = async (user: any): Promise<Partial<User>> => {
  const { id } = user;
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user profile data is not found');
  }

  return excludeFields(result, [
    'createdAt',
    'updatedAt',
    'password',
  ]) as Partial<User>;
};

export const profileService = {
  getProfile,
};
