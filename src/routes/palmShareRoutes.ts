import { Router } from 'express';
import { palmShareController, palmShareMemmebersController } from '../controllers/palmShareController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.post('/palm_share', verifyToken, palmShareController);
router.get('/palmshare/members/', verifyToken, palmShareMemmebersController);

export default router;
