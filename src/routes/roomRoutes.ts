import express from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { roomListController } from '../controllers/room/roomListController';
import { roomDetailController } from '../controllers/room/roomDetailController';
import { roomSmartLockController } from '../controllers/room/smartlock/roomSmartLockController';
import { createUserAccessController, viewUserAccessInRoomController } from '../controllers/room/access/roomAccessController';
import { deleteUserAccessFromRoomController } from '../controllers/room/access/deleteUserAccessFromRoomController';
import { editUserAccessController } from '../controllers/room/access/editUserAccessController';

const router = express.Router();

router.get('/rooms/:business_type', verifyToken, roomListController);
router.get('/rooms/:business_type/:pk', verifyToken, roomDetailController);
router.post('/assign-smart-lock-to-room/:id', verifyToken, roomSmartLockController);
router.get('/user-access/:room_id', verifyToken, viewUserAccessInRoomController);
router.delete('/remove-access/:user_id', verifyToken, deleteUserAccessFromRoomController);
router.post('/grant-access/:business_type', verifyToken, createUserAccessController);
router.patch('/update-access/:user_id', verifyToken, editUserAccessController);

export default router;
