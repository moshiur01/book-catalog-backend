import { Category } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (data: Category): Promise<Partial<Category>> => {
  const result = await prisma.category.create({
    data,
  });

  return excludeFields(result, ['createdAt', 'updatedAt']) as Partial<Category>;
};

const getAllFromDb = async (): Promise<Category[] | Category> => {
  const result = await prisma.category.findMany();

  return excludeFields(result, ['createdAt', 'updatedAt']);
};

const getSingleCategoryFromDb = async (
  id: string
): Promise<Partial<Category> | null> => {
  const result = await prisma.category.findFirst({
    where: {
      id,
    },
    include: {
      books: true,
    },
  });

  if (result === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category not Found');
  }

  return excludeFields(result, ['createdAt', 'updatedAt']) as Partial<Category>;
};

const updateCategory = async (
  id: string,
  payload: Partial<Category>
): Promise<Partial<Category>> => {
  const isExist = prisma.category.findFirst({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.OK, 'Category not Found');
  }

  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });
  return excludeFields(result, ['createdAt', 'updatedAt']) as Partial<Category>;
};
const deleteCategory = async (id: string): Promise<Partial<Category>> => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });
  return excludeFields(result, ['createdAt', 'updatedAt']) as Partial<Category>;
};

export const categoryService = {
  insertIntoDb,
  getAllFromDb,
  getSingleCategoryFromDb,
  updateCategory,
  deleteCategory,
};
