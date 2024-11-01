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
}
