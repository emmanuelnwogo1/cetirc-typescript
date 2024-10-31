import { Router } from 'express';
import { AuthController } from '../controllers/auth/AuthController';

const router = Router();
const authController = new AuthController();

router.post('/login_email', authController.login.bind(authController));

export default router;
