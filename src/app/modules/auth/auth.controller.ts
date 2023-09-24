import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ILoginUserResponse } from './auth.interface';
import { authService } from './auth.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.insertIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await authService.loginUser(loginData);
  const { refreshToken } = result;

  //set refresh token options
  const cookeOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  //set refresh token into cookies
  res.cookie('refreshToken', refreshToken, cookeOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signin successfully!',
    token: result.accessToken,
  });
});

export const authController = {
  insertIntoDB,
  loginUser,
};
