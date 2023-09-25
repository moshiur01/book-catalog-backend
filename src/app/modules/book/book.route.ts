import express from 'express';
import { bookController } from './book.controller';

const router = express.Router();

router.get('/', bookController.getAllFromDb);
router.post('/create-book', bookController.insertIntoDb);
export const bookRoutes = router;
