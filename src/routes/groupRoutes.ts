import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { deleteGroupController } from '../controllers/group/deleteGroupController';

const router = Router();

router.delete('/delete-group/:group_id', verifyToken, deleteGroupController);

export default router;
