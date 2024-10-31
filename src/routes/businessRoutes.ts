import { Router } from 'express';
import { businessRegisterController, getBusinessLocation, getNearestBusinessesController, nearbyBusinessesController, updateBusinessProfileController } from '../controllers/business/businessController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.post('/nearby/', verifyToken, nearbyBusinessesController);
router.post('/register_business', businessRegisterController);
router.put('/update_business_profile/:business_id/', updateBusinessProfileController);
router.get('/business_location', getBusinessLocation);
router.post('/nearest-businesses', getNearestBusinessesController);

export default router;
