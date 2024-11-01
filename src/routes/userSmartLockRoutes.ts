import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import userSmartLockController from '../controllers/user/smartlock/userSmartLockController';

const router = Router();

router.post('/user-smart-lock-signup/', verifyToken, userSmartLockController.userSmartLockSignUp);
router.post('/smart-lock-control/:action/:deviceId', verifyToken, userSmartLockController.controlSmartLock);

export default router;
