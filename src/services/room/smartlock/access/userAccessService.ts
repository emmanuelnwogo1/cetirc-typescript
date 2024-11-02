import { UserSmartLockAccess } from "../../../../models/UserSmartLockAccess";

interface UpdateAccessData {
    period?: Date;
    room?: string;
}

export const updateUserAccess = async (userId: string, data: UpdateAccessData, currentUser: any) => {
    try {
        console.log(userId, data, currentUser);
        const accessRecord = await UserSmartLockAccess.findOne({
            where: { user_id: userId, granted_by_id: currentUser.id },
        });

        if (!accessRecord) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Access record not found.',
                    data: {}
                },
            };
        }

        await accessRecord.update(data);

        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Access record updated successfully.',
                data: accessRecord,
            },
        };
    } catch (error) {
        console.error('Error updating user access:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while updating access record.',
                data: {}
            },
        };
    }
};
