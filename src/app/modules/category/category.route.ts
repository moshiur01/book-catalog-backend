import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { categoryController } from './category.controller';

const router = express.Router();

router.get('/', categoryController.getAllFromDb);
router.get('/:id', categoryController.getSingleCategoryFromDb);

router.post(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.insertIntoDb
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.updateCategory
);
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  categoryController.deleteCategory
);

export const categoryRoutes = router;
