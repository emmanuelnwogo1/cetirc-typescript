import { Op } from 'sequelize';
import { PalmShare } from '../models/PalmShare';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';

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


export const getPalmShareMembers = async (username: string) => {
    const userProfile = await User.findOne({ where: { username } });
    
    if (!userProfile) {
        throw new Error('User profile not found');
    }

    const palmshareMembers = await PalmShare.findAll({
        where: { owner_id: userProfile.id }
    });

    return palmshareMembers;
}

export const updatePalmShareMember = async (allowedUsername: string, user: any, updateData: any) => {
    
    const userProfile = await User.findOne({ where: { username: user.username } });
    if (!userProfile) {
        throw new Error('User profile not found');
    }

    const allowedUser = await User.findOne({ where: { username: allowedUsername } });
    if (!allowedUser) {
        throw new Error('Allowed user does not exist');
    }

    const palmShareMember = await PalmShare.findOne({
        where: {
            owner_id: userProfile.id,
            allowed_user_id: allowedUser.id
        }
    });

    if (!palmShareMember) {
        throw new Error('PalmShare member does not exist');
    }

    await palmShareMember.update(updateData);

    return palmShareMember;
}

export const deletePalmShareMember = async (allowedUsername: string, userId: number) => {
    
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User is not authenticated.');

    const userProfile = await UserProfile.findOne({ where: { username_id: user.id } });
    const allowedUser = await User.findOne({ where: { username: allowedUsername } });
    
    if (!userProfile || !allowedUser) {
        throw new Error('PalmShare member does not exist.');
    }

    const palmShareMember = await PalmShare.findOne({
        where: { owner_id: userProfile.id, allowed_user_id: allowedUser.id },
    });

    if (!palmShareMember) throw new Error('PalmShare member does not exist.');

    await palmShareMember.destroy();

    return {
        status: 'success',
        message: 'PalmShare member removed successfully.',
        data: {},
    };
};

export const searchPalmShare = async (allowedUsername?: string, dateCreated?: string) => {
    const filters: any = {};

    if (allowedUsername) {
        const users = await User.findAll({
            where: {
                username: {
                    [Op.iLike]: `%${allowedUsername}%`
                }
            }
        });

        const userIds = users.map(user => user.id);
        filters.allowed_user_id = {
            [Op.in]: userIds,
        };
    }

    if (dateCreated) {
        try {
            filters.date_created = {
                [Op.eq]: new Date(dateCreated),
            };
        } catch (error) {
            return { status: 'failed', message: 'Invalid date format. Use YYYY-MM-DD.' };
        }
    }

    const palmShares = await PalmShare.findAll({ where: filters });
    
    return {
        status: 'success',
        message: 'Data retrieved successfully.',
        data: palmShares,
    };
};