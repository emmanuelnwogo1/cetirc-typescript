import { SmartLock } from "../../../../models/SmartLock";
import { User } from "../../../../models/User";
import { UserSmartLockAccess } from "../../../../models/UserSmartLockAccess";

export const getUserAccessInRoom = async (roomId: number | null, user: any) => {
    try {
        let accessList;
        if (roomId) {
            accessList = await UserSmartLockAccess.findAll({
                where: {
                    granted_by_id: user.id,
                    room_id: roomId,
                },
            });
        } else {
            accessList = await UserSmartLockAccess.findAll({
                where: {
                    granted_by_id: user.id,
                },
            });
        }

        if(!accessList || accessList.length == 0){
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Access list not found.',
                    data: accessList,
                },
            };
        }

        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Access list retrieved successfully.',
                data: accessList,
            },
        };
        
    } catch (error) {
        console.error('Error retrieving user access:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while retrieving user access.',
            },
        };
    }
};

interface GrantAccessData {
    username: string;
    smart_lock_device_id: string;
    period: Date;
}

export const grantUserAccess = async (data: GrantAccessData, businessType: string, currentUser: any) => {
    const { username, smart_lock_device_id, period } = data;

    try {
        
        const userToGrant = await User.findOne({ where: { username } });
        const smartLock = await SmartLock.findOne({ where: { device_id: smart_lock_device_id } });

        if (!userToGrant) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'User not found.',
                },
            };
        }

        if (!smartLock) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Smart lock not found.',
                },
            };
        }

        await UserSmartLockAccess.create({
            user_id: userToGrant.id,
            smart_lock_id: smartLock.id,
            granted_by_id: currentUser.id,
            period,
        } as UserSmartLockAccess);

        return {
            statusCode: 201,
            data: {
                status: 'success',
                message: 'Access granted successfully.',
            },
        };
    } catch (error) {
        console.error('Error granting user access:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while granting access.',
            },
        };
    }
};