import { SmartLock } from "../../../models/SmartLock";
import { UserSmartLockAccess } from "../../../models/UserSmartLockAccess";

export const getUserSmartLockGroups = async (userId: number) => {
    
    const userAccessRecords = await UserSmartLockAccess.findAll({
        where: { user_id: userId },
    });

    
    const smartLockIds = userAccessRecords.map(access => access.smart_lock_id);

    
    if (smartLockIds.length === 0) {
        return {
            status: 'success',
            message: 'No smart locks found for the user.',
            data: [],
        };
    }

    
    const smartLocks = await SmartLock.findAll({
        where: {
            id: smartLockIds,
        },
    });

    if (smartLocks.length > 0) {
        return {
            status: 'success',
            message: 'Smart locks associated with the user have been retrieved successfully.',
            data: smartLocks,
        };
    } else {
        return {
            status: 'success',
            message: 'No smart locks found for the user.',
            data: [],
        };
    }
};
