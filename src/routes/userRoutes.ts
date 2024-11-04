import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { editUserProfile, fetchUserProfileDetails, updateProfilePhotoController } from '../controllers/user/userController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'images/' });

router.put('/user_update', verifyToken, editUserProfile);
router.get('/user_profile', verifyToken, fetchUserProfileDetails);
router.patch('/profile-photo/', verifyToken, upload.single('image'), updateProfilePhotoController);

export default router;