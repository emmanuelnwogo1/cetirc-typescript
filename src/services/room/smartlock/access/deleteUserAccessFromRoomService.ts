import { UserSmartLockAccess } from "../../../../models/UserSmartLockAccess";

export const removeUserAccessFromRoom = async (userId: number, currentUser: any) => {
    try {
        const accessRecords = await UserSmartLockAccess.findAll({
            where: {
                user_id: userId,
                granted_by_id: currentUser.id,
            },
        });

        if (accessRecords.length > 0) {
            const count = await UserSmartLockAccess.destroy({
                where: {
                    user_id: userId,
                    granted_by_id: currentUser.id,
                },
            });

            return {
                statusCode: 200,
                data: {
                    status: 'success',
                    message: `${count} access record(s) removed successfully.`,
                },
            };
        } else {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'No access records found for the provided user ID, or you do not have permission to delete them.',
                },
            };
        }
    } catch (error) {
        console.error('Error removing user access:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while removing user access.',
            },
        };
    }
};
