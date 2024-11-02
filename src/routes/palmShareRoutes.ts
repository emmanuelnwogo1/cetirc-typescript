import { Router } from 'express';
import { deletePalmShareMemberController, palmShareController, palmShareMemmebersController, palmShareUpdateMemberController, searchPalmShareController } from '../controllers/palmShareController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.post('/palm_share', verifyToken, palmShareController);
router.get('/palmshare/members/', verifyToken, palmShareMemmebersController);
router.put('/palmshare/members/:allowed_username', verifyToken, palmShareUpdateMemberController);
router.delete('/palmshare/members/remove/:allowedUsername', verifyToken, deletePalmShareMemberController);
router.get('/palmshare/search/', verifyToken, searchPalmShareController);

export default router;
