import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { editUserProfile } from '../controllers/user/userController';

const router = Router();

router.put('/user_update', verifyToken, editUserProfile);

export default router;