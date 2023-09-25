/* eslint-disable @typescript-eslint/no-explicit-any */
import { Book, Prisma } from '@prisma/client';
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
) => {
  const { size, page, skip } = paginationHelpers.calculatePagination(options);
  const result = await prisma.book.findMany({
    where: {
      categoryId: id,
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
export const bookService = {
  insertIntoDb,
  getAllFromDb,
  getAllFromDbByCategory,
};
