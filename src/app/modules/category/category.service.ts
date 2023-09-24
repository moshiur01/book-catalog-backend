import { Category } from '@prisma/client';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';

const insertIntoDb = async (data: Category): Promise<Partial<Category>> => {
  const result = await prisma.category.create({
    data,
  });

  return excludeFields(result, ['createdAt', 'updatedAt']) as Partial<Category>;
};

export const categoryService = {
  insertIntoDb,
};
