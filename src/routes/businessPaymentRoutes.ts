
import express from 'express';
import { requestPaymentController, processPaymentController, linkPalmController } from '../controllers/payments/businessPaymentsController';
import verifyToken from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/businessprofiles/payments/request', verifyToken, requestPaymentController);
router.post('/businessprofiles/payments/process', verifyToken, processPaymentController);
router.post('/users/link_palm', verifyToken, linkPalmController);

export default router;
