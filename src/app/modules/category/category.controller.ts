import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { categoryService } from './category.service';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllFromDb();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories fetched successfully',
    data: result,
  });
});
export const categoryController = {
  insertIntoDb,
  getAllFromDb,
};
