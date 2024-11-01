import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { editUserProfile, fetchUserProfileDetails } from '../controllers/user/userController';

const router = Router();

router.put('/user_update', verifyToken, editUserProfile);
router.get('/user_profile', verifyToken, fetchUserProfileDetails);

export default router;