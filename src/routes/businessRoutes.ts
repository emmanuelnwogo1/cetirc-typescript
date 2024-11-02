import { Router } from 'express';
import { businessRegisterController, getBusinessLocation, getNearestBusinessesController, nearbyBusinessesController, updateBusinessProfileController } from '../controllers/business/businessController';
import verifyToken from '../middlewares/authMiddleware';
import { fetchBusinessProfileDetails, updateBusinessProfileImageController } from '../controllers/business/businessProfileController';
import { addSmartLockController, fetchBusinessSmartLocks, grantSmartLockAccessToBusinessController, signUpBusinessSmartLockController } from '../controllers/business/businessSmartLockController';
import multer from 'multer';

const router = Router();

const upload = multer({ dest: 'business_images/' });

router.post('/nearby/', verifyToken, nearbyBusinessesController);
router.post('/register_business', businessRegisterController);
router.put('/update_business_profile/:business_id/', updateBusinessProfileController);
router.get('/business_location', getBusinessLocation);
router.post('/nearest-businesses', getNearestBusinessesController);
router.get('/business_profile', verifyToken, fetchBusinessProfileDetails);
router.post('/business-smart-lock-signup', verifyToken, signUpBusinessSmartLockController);
router.get('/business-smart-locks', verifyToken, fetchBusinessSmartLocks);
router.post('/grant-access-business/:businessType', verifyToken, grantSmartLockAccessToBusinessController);
router.post('/add-smart-lock', verifyToken, addSmartLockController);
router.patch('/business-profile-image/', verifyToken, upload.single('image'), updateBusinessProfileImageController);

export default router;
