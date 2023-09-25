import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { profileService } from './profile.service';

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await profileService.getProfile(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile data successfully',
    data: result,
  });
});

export const profileController = {
  getProfile,
};
