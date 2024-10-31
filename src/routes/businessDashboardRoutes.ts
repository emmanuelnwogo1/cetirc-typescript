import { Router } from 'express';
import { businessDashboardController, updateDashboardController } from '../controllers/business/businessDashboardController';
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.get('/business_dashboard/', verifyToken, businessDashboardController);
router.post('/business_dashboard/', verifyToken, updateDashboardController);

export default router;
