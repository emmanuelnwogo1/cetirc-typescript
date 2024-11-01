import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import userSmartLockController from '../controllers/user/smartlock/userSmartLockController';

const router = Router();

router.post('/user-smart-lock-signup/', verifyToken, userSmartLockController.userSmartLockSignUp);
router.post('/smart-lock-control/:action/:deviceId', verifyToken, userSmartLockController.controlSmartLock);
router.get('/user-smart-lock-groups', verifyToken, userSmartLockController.getUserSmartLockGroupsController);
router.post('/remove-user-from-smart-lock-group', verifyToken, userSmartLockController.removeUserFromSmartLockGroup);
router.post('/leave-smart-lock-group', verifyToken, userSmartLockController.leaveSmartLockGroupController);

export default router;
