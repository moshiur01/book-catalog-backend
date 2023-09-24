import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { userController } from './user.controller';

const router = express.Router();

router.get('/', auth(ENUM_USER_ROLE.ADMIN), userController.getAllFromDb);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  userController.getSingleUserFromDb
);
router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), userController.updateUser);

export const UserRoutes = router;
