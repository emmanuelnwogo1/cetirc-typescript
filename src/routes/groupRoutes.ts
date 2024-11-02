import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { deleteGroupController } from '../controllers/group/deleteGroupController';
import { createGroupController } from '../controllers/group/smartLockGroupController';

const router = Router();

router.delete('/delete-group/:group_id', verifyToken, deleteGroupController);
router.post("/create-group", verifyToken, createGroupController);

export default router;
