import { Card } from '../../models/Card';
import { User } from '../../models/User';
import { UserProfile } from '../../models/UserProfile';

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

    getUserCards = async (userId: number) => {
        try {
            const userProfile = await UserProfile.findOne({ where: { id: userId } });
    
            if (!userProfile) {
                return {
                    status: "error",
                    message: "User profile does not exist.",
                    data: {}
                };
            }
    
            // Fetch cards associated with the user profile
            const cards = await Card.findAll({ where: { user_profile_id: userId } });
    
            const cardData = cards.map(card => ({
                id: card.id,
                name: card.name,
                card_number: card.card_number,
                expiration_month_year: card.expiration_month_year,
                cvv: card.cvv
            }));
    
            return {
                status: "success",
                message: "Cards retrieved successfully.",
                data: cardData
            };
        } catch (error) {
            return {
                status: "error",
                message: "Failed to retrieve cards.",
                data: error
            };
        }
    };
}
