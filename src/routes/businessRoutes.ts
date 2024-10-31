import { Router } from 'express';
import { businessRegisterController, nearbyBusinessesController, updateBusinessProfileController } from '../controllers/business/businessController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.post('/nearby/', verifyToken, nearbyBusinessesController);
router.post('/register_business', businessRegisterController);
router.put('/update_business_profile/:business_id/', updateBusinessProfileController);

export default router;
