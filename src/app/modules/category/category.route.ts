import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { categoryController } from './category.controller';

const router = express.Router();

router.get('/', categoryController.getAllFromDb);

router.post('/', auth(ENUM_USER_ROLE.ADMIN), categoryController.insertIntoDb);

export const categoryRoutes = router;
