/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';
import { bookSearchableFields } from './book.constrain';

const insertIntoDb = async (data: Book): Promise<Partial<Book>> => {
  const result = await prisma.book.create({
    data,
    include: {
      category: true,
    },
  });

  return excludeFields(result, ['createdAt', 'updatedAt']) as Partial<Book>;
};

const getAllFromDb = async (
  filters: any,
  options: IPaginationOptions
): Promise<IGenericResponse<Book[]>> => {
  const { size, page, skip } = paginationHelpers.calculatePagination(options);

  const { search, minPrice, maxPrice, ...filterData } = filters;

  const andConditions = [];
  if (search) {
    andConditions.push({
      OR: bookSearchableFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive',
        },
      })),
    });
  }

  const fieldMapping: Record<string, string> = {
    category: 'categoryId',
  };

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        const databaseField = fieldMapping[key] || key;
        return {
          [databaseField]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  if (minPrice) {
    andConditions.push({
      price: {
        gte: parseInt(minPrice),
      },
    });
  }
  if (maxPrice) {
    andConditions.push({
      price: {
        lte: parseInt(maxPrice),
      },
    });
  }

  const whereConditions: Prisma.BookWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const filteredResult = await prisma.book.findMany({
    include: {
      category: true,
    },
    where: whereConditions,
    skip,
    take: size,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.book.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      size,
    },
    data: filteredResult,
  };
};

const getAllFromDbByCategory = async (
  id: string,
  options: IPaginationOptions
): Promise<IGenericResponse<Partial<Book[]>>> => {
  const { size, page, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.book.findMany({
    where: {
      categoryId: id,
    },
    include: {
      category: true,
    },
    skip,
    take: size,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.book.count({
    where: {
      categoryId: id,
    },
  });
  return {
    meta: {
      total,
      page,
      size,
    },
    data: result,
  };
};

const getSingleFromDb = async (id: string): Promise<Partial<Book | null>> => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
  });
  if (result === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Book not Found');
  }
  return excludeFields(result, ['createdAt', 'updatedAt']) as Partial<Book>;
};

const updateOneFromDb = async (id: string, payload: Partial<Book>) => {
  const isExist = await prisma.book.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.OK, 'Book not Found');
  }

  const result = await prisma.book.update({
    where: {
      id,
    },
    data: payload,
  });

  return excludeFields(result, ['createdAt', 'updatedAt']) as Partial<Book>;
};

const deleteOneFromDb = async (id: string) => {
  const isExist = await prisma.book.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.OK, 'Book not Found');
  }

  const result = await prisma.book.delete({
    where: {
      id,
    },
  });

  return excludeFields(result, ['createdAt', 'updatedAt']) as Partial<Book>;
};

export const bookService = {
  insertIntoDb,
  getAllFromDb,
  getAllFromDbByCategory,
  getSingleFromDb,
  updateOneFromDb,
  deleteOneFromDb,
};
