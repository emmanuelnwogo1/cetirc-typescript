import { Card } from '../../models/Card';
import { UserProfile } from '../../models/UserProfile';

export class CardService {
    async addCard(user: any, cardData: any) {
        console.log(user.id);
        const userProfile = await UserProfile.findOne({ where: { username_id: user.id } });
        if (!userProfile) {
            return {
                status: "failed",
                message: "User profile not found.",
                data: {}
            };
        }

        // Create the card
        const newCard = await Card.create({
            ...cardData,
            user_profile_id: userProfile.id,
        });

        return {
            status: "success",
            message: "Card added successfully.",
            data: newCard
        };
    }

    updateCard = async (cardId: number, data: any, userId: number) => {
        try {
            const card = await Card.findOne({
                where: { id: cardId }
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
            const userProfile = await UserProfile.findOne({ where: {  username_id: userId } });
    
            if (!userProfile) {
                return {
                    status: "error",
                    message: "User profile does not exist.",
                    data: {}
                };
            }
    
            const cards = await Card.findAll({ where: { user_profile_id: userProfile.id } });
    
            return {
                status: "success",
                message: "Cards retrieved successfully.",
                data: cards
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
