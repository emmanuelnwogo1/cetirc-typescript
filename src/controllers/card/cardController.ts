import { Request, Response } from 'express';
import { CardService } from '../../services/card/cardService';
import { User } from '../../models/User';

const cardService = new CardService();

export class CardController {
    async addCard(req: Request, res: Response) {
        const user = await User.findOne(req.user.id);
        const cardData = req.body;

        try {
            const newCard = await cardService.addCard(user, cardData);

            res.status(201).json({
                status: 'success',
                message: 'Card added successfully.',
                data: newCard
            });
        } catch (error: any) {
            res.status(400).json({
                status: 'failed',
                message: 'Failed to add card.',
                data: error.message
            });
        }
    }
}
