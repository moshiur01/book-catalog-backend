import { User } from '@prisma/client';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import excludeFields from '../../../shared/excludeFields';
import prisma from '../../../shared/prisma';
import { utilsFunctions } from '../../../shared/utils';
import { ILoginUser, ILoginUserResponse } from './auth.interface';

const insertIntoDB = async (data: User): Promise<Partial<User>> => {
  const { password } = data;
  const hashPassword = await utilsFunctions.hashPassword(password);
  data.password = hashPassword;
  const result = await prisma.user.create({
    data,
  });

  return excludeFields(result, ['createdAt', 'updatedAt', 'password']);
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  //check user
  const isUserExist = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Does Not Exists');
  }

  //check password
  if (
    isUserExist.password &&
    !(await utilsFunctions.isPasswordMatch(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token
  const { id, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.jwt_token as Secret,
    config.jwt.jwt_token_expires_in as string
  );
  // refresh token
  const refreshToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.jwt_refresh_token as Secret,
    config.jwt.jwt_refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  insertIntoDB,
  loginUser,
};
