import { Router } from 'express';
import { nearbyBusinessesController } from '../controllers/business/businessController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.post('/nearby/', verifyToken, nearbyBusinessesController);

export default router;
