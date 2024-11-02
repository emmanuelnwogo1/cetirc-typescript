import express from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { getNotificationByIdController, getNotificationsController, updateNotificationByIdController } from '../controllers/notification/notificationController';

const router = express.Router();

router.get('/notifications', verifyToken, getNotificationsController);
router.get('/notifications/:id', verifyToken, getNotificationByIdController);
router.patch('/notifications/:id', verifyToken, updateNotificationByIdController);

export default router;
