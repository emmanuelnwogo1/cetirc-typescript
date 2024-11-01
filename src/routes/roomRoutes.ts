import express from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { roomListController } from '../controllers/room/roomListController';
import { roomDetailController } from '../controllers/room/roomDetailController';

const router = express.Router();

router.get('/rooms/:business_type', verifyToken, roomListController);
router.get('/rooms/:business_type/:pk', verifyToken, roomDetailController);

export default router;
