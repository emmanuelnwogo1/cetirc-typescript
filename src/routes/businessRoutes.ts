import { Router } from 'express';
import { businessRegisterController, nearbyBusinessesController } from '../controllers/business/businessController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.post('/nearby/', verifyToken, nearbyBusinessesController);
router.post('/register_business', businessRegisterController);

export default router;
