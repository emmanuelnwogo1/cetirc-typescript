import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { CardController } from '../controllers/card/cardController';

const router = Router();
const cardController = new CardController();

router.post('/cards/add', verifyToken, cardController.addCard);

export default router;
