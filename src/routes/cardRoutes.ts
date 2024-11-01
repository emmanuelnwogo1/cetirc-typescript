import { Router } from 'express';
import verifyToken from '../middlewares/authMiddleware';
import { CardController } from '../controllers/card/cardController';

const router = Router();
const cardController = new CardController();

router.post('/cards/add', verifyToken, cardController.addCard);
router.put('/cards/update/:id', verifyToken, cardController.editCard);
router.get('/user_cards', verifyToken, cardController.fetchUserCards);

export default router;
