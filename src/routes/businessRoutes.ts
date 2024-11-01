import { Router } from 'express';
import { businessRegisterController, getBusinessLocation, getNearestBusinessesController, nearbyBusinessesController, updateBusinessProfileController } from '../controllers/business/businessController';
import verifyToken from '../middlewares/authMiddleware';
import { fetchBusinessProfileDetails } from '../controllers/business/businessProfileController';
import { addSmartLockController, fetchBusinessSmartLocks, grantSmartLockAccessToBusinessController, signUpBusinessSmartLockController } from '../controllers/business/businessSmartLockController';

const router = Router();

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

export default router;
