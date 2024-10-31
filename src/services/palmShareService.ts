import { PalmShare } from '../models/PalmShare';
import { User } from '../models/User';

export const savePalmShareSettings = async (ownerId: number, allowed_username: string, max_amount: number) => {
    const allowedUser = await User.findOne({ where: { username: allowed_username } });
    
    if (!allowedUser) {
        return {
            status: 'failed',
            message: 'Allowed user does not exist.',
            data: {}
        };
    }

    const data = {
        owner_id: ownerId,
        allowed_user_id: allowedUser.id,
        max_amount: max_amount
    };

    await PalmShare.update(data, {
            where: {
                owner_id: ownerId,
                allowed_user_id: allowedUser.id
            }
        }
    );

    return {
        status: 'success',
        message: 'Palm Share settings saved successfully.',
        data: {
            allowed_username: allowed_username,
            max_amount: max_amount
        }
    };
};
