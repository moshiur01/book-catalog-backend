import express from 'express';
import { userController } from './user.controller';

const router = express.Router();

router.get('/', userController.getAllFromDb);

export const UserRoutes = router;