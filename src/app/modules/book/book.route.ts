import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { bookController } from './book.controller';

const router = express.Router();

router.get('/', bookController.getAllFromDb);
router.get('/:id', bookController.getSingleFromDb);
router.get('/:id/category', bookController.getAllFromDbByCategory);

router.post(
  '/create-book',
  auth(ENUM_USER_ROLE.ADMIN),
  bookController.insertIntoDb
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  bookController.updateOneFromDb
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  bookController.deleteOneFromDb
);

export const bookRoutes = router;
