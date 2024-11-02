import { SmartLock } from "../../models/SmartLock";
import { SmartLockGroup } from "../../models/SmartLockGroup";
import { User } from "../../models/User";

export const deleteGroupService = async (groupId: number, userId: number) => {
    try {
        const group = await SmartLockGroup.findOne({ where: { id: groupId } });
        
        if (!group) {
            return {
                statusCode: 404,
                status: 'failed',
                message: 'SmartLockGroup not found.',
            };
        }

        const hasPermission = await userHasPermission(userId, groupId);
        if (!hasPermission) {
            return {
                statusCode: 403,
                status: 'failed',
                message: 'You do not have permission to delete this group.',
            };
        }

        await SmartLock.destroy({ where: { group_id: group.id } });

        // Attempt to delete the group
        await group.destroy();

        return {
            statusCode: 200,
            status: 'success',
            message: 'SmartLockGroup deleted successfully.',
        };

    } catch (error: any) {
        // Check for foreign key constraint error
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return {
                statusCode: 400,
                status: 'failed',
                message: 'Cannot delete SmartLockGroup as there are related child records. Please delete them first.',
            };
        }

        // Generic error handler
        return {
            statusCode: 500,
            status: 'failed',
            message: 'An error occurred while deleting the group.',
        };
    }
};

const userHasPermission = async (userId: number, groupId: number): Promise<boolean> => {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) return false;

    // Permission logic here (e.g., check if user is an admin or is associated with the group)
    return true;
};
