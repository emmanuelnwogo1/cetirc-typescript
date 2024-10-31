import { Router } from 'express';
import { requestPasswordResetController } from '../controllers/password/passwordResetController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.post('/password-reset/request/', verifyToken, requestPasswordResetController);

export default router;
