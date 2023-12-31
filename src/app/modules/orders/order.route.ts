import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { orderController } from './order.controller';
const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  orderController.getAllFromDb
);
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.CUSTOMER),
  orderController.getSingleOrderFromDb
);

router.post(
  '/create-order',
  auth(ENUM_USER_ROLE.CUSTOMER),
  orderController.insertIntoDb
);

export const OrderRoutes = router;
