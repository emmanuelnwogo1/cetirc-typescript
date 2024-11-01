import express from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { roomListController } from '../controllers/room/roomListController';
import { roomDetailController } from '../controllers/room/roomDetailController';
import { roomSmartLockController } from '../controllers/room/smartlock/roomSmartLockController';
import { viewUserAccessInRoomController } from '../controllers/room/access/roomAccessController';

const router = express.Router();

router.get('/rooms/:business_type', verifyToken, roomListController);
router.get('/rooms/:business_type/:pk', verifyToken, roomDetailController);
router.post('/assign-smart-lock-to-room/:id', verifyToken, roomSmartLockController);
router.get('/user-access/:room_id', verifyToken, viewUserAccessInRoomController);

export default router;
