import { Router } from 'express';
import { palmShareController } from '../controllers/palmShareController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.post('/palm_share', verifyToken, palmShareController);

export default router;
