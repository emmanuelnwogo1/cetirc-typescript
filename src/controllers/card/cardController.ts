import { Request, Response } from 'express';
import { CardService } from '../../services/card/cardService';
import { User } from '../../models/User';

const cardService = new CardService();

export class CardController {
    async addCard(req: Request, res: Response): Promise<any> {
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });
        console.log(req.user.id, user);
        const cardData = req.body;

        try {
            const response: any = await cardService.addCard(user, cardData);

            if(response.status == 'success'){
                return res.status(201).json({
                    status: 'success',
                    message: 'Card added successfully.',
                    data: response.data
                });
            }else{
                return res.status(404).json({
                    status: 'failed',
                    message: 'User profile not found.',
                    data: {}
                });
            }            
        } catch (error: any) {
            return res.status(400).json({
                status: 'failed',
                message: 'Failed to add card.',
                data: error.message
            });
        }
    }

    editCard = async (req: Request, res: Response) => {
        const cardId = parseInt(req.params.id);
        const userId = req.user.id;
        const data = req.body;
        console.log(data, cardId, userId);
    
        const result = await cardService.updateCard(cardId, data, userId);
    
        if (result.status === "success") {
            res.status(200).json(result);
        } else if (result.message === "Card not found.") {
            res.status(404).json(result);
        } else {
            res.status(400).json(result);
        }
    };

    fetchUserCards = async (req: Request, res: Response) => {
        const userId = req.user.id;
    
        const result = await cardService.getUserCards(userId);
    
        if (result.status === "success") {
            res.status(200).json(result);
        } else if (result.message === "User profile does not exist.") {
            res.status(404).json(result);
        } else {
            res.status(500).json(result);
        }
    };
}
