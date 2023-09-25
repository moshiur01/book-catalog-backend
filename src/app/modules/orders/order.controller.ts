import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { orderService } from './order.service';

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
  if (req.user) {
    const result = await orderService.insertIntoDb(req.user, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: true,
      message: 'user is not Found',
      data: null,
    });
  }
});
const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  if (req.user) {
    const result = await orderService.getAllFromDb(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order created successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: true,
      message: 'user is not Found',
      data: null,
    });
  }
});

const getSingleOrderFromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getSingleOrderFromDb(
    req.user,
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order fetched successfully',
    data: result,
  });
});

export const orderController = {
  insertIntoDb,
  getAllFromDb,
  getSingleOrderFromDb,
};
