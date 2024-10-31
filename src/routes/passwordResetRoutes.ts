import { Router } from 'express';
import { confirmPasswordReset, requestPasswordResetController } from '../controllers/password/passwordResetController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.post('/password-reset/request/', verifyToken, requestPasswordResetController);
router.post('/password-reset/verify', confirmPasswordReset);


export default router;
