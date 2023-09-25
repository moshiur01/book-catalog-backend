/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (user: any, data: Order) => {
  const insertedData = data.orderedBooks;

  const { id, role } = user;

  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (isExist?.role === role) {
    const result = await prisma.order.create({
      data: {
        userId: id,
        orderedBooks: JSON.stringify(insertedData),
        status: 'pending',
      },
    });
    return excludeFields(result, ['updatedAt']);
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User is not Authorized');
  }
};

export const orderService = {
  insertIntoDb,
};
