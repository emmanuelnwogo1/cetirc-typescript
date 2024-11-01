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