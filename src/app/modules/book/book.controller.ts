import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookFilterableFields } from './book.constrain';
import { bookService } from './book.service';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.insertIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book created successfully',
    data: result,
  });
});

const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder']);

  const result = await bookService.getAllFromDb(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Books fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAllFromDbByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder']);
    const result = await bookService.getAllFromDbByCategory(
      req.params.id,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Books with associated category data fetched successfully',
      data: result,
    });
  }
);

const getSingleFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.getSingleFromDb(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book fetched successfully',
    data: result,
  });
});

const updateOneFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await bookService.updateOneFromDb(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully',
    data: result,
  });
});

export const bookController = {
  insertIntoDb,
  getAllFromDb,
  getAllFromDbByCategory,
  getSingleFromDb,
  updateOneFromDb,
};
