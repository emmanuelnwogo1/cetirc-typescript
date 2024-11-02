import express from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { getNotificationsController } from '../controllers/notification/notificationController';

const router = express.Router();

router.get('/notifications', verifyToken, getNotificationsController);

export default router;
