import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { createUserController, deleteUserController, editUserProfile, fetchUserProfileDetails, getUserByIdController, getUsersController, updateProfilePhotoController } from '../controllers/user/userController';
import multer from 'multer';
import adminMiddleware from '../middlewares/adminMiddleware';

const router = Router();
const upload = multer({ dest: 'images/' });

router.put('/user_update', verifyToken, editUserProfile);
router.get('/user_profile', verifyToken, fetchUserProfileDetails);
router.patch('/profile-photo/', verifyToken, upload.single('image'), updateProfilePhotoController);

// User routes with admin verification
router.get('/users', verifyToken, adminMiddleware, getUsersController);
router.get('/users/:id', verifyToken, adminMiddleware, getUserByIdController);
router.put('/users', verifyToken, adminMiddleware, createUserController);
router.delete('/users/:id', verifyToken, adminMiddleware, deleteUserController);

export default router;