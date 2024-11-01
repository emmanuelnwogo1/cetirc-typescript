import express from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { roomListController } from '../controllers/room/roomListController';

const router = express.Router();

router.get('/rooms/:business_type', verifyToken, roomListController);

export default router;
