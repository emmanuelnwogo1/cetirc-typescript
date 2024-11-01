import { Card } from '../../models/Card';
import { User } from '../../models/User';

export class CardService {
    async addCard(user: any, cardData: any) {
        
        const userProfile = await User.findOne({ where: { username: user.username } });
        if (!userProfile) {
            throw new Error('User profile not found');
        }

        // Create the card
        const newCard = await Card.create({
            ...cardData,
            user_profile_id: userProfile.id,
        });

        return newCard;
    }

    updateCard = async (cardId: number, data: any, userId: number) => {
        try {
            const card = await Card.findOne({
                where: { id: cardId, user_profile_id: userId }
            });
    
            if (!card) {
                return {
                    status: "failed",
                    message: "Card not found.",
                    data: {}
                };
            }
    
            await card.update(data);
            return {
                status: "success",
                message: "Card updated successfully.",
                data: card
            };
        } catch (error) {
            return {
                status: "failed",
                message: "Failed to update card.",
                data: error
            };
        }
    }
}
