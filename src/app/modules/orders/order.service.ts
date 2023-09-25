/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from '@prisma/client';
import httpStatus from 'http-status';
import { ENUM_USER_ROLE } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (
  user: any,
  data: Order
): Promise<Partial<Order>> => {
  const insertedData = data.orderedBooks;

  const { id, role } = user;

  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User is not found');
  }

  if (isExist?.role === role) {
    const result = await prisma.order.create({
      data: {
        userId: id,
        orderedBooks: JSON.stringify(insertedData),
        status: 'pending',
      },
    });
    return excludeFields(result, ['updatedAt']) as Partial<Order>;
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not Authorized');
  }
};

const getAllFromDb = async (user: any): Promise<Order[] | Order> => {
  const { id, role } = user;
  const isExist = await prisma.user.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User is not found');
  }
  if (role === ENUM_USER_ROLE.ADMIN) {
    const result = await prisma.order.findMany({});
    return result;
  } else if (role === ENUM_USER_ROLE.CUSTOMER) {
    const result = await prisma.order.findMany({
      where: {
        userId: id,
      },
    });
    return result;
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not Authorized');
  }
};

export const orderService = {
  insertIntoDb,
  getAllFromDb,
};
