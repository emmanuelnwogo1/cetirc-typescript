import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { getTransactionHistoryController } from '../controllers/transaction/transactionHistoryController';

const router = Router();

router.get('/transaction-history', verifyToken, getTransactionHistoryController);

export default router;