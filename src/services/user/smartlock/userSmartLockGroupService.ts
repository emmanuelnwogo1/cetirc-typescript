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

export const leaveSmartLockGroup = async (userId: number, smartLockDeviceId: string) => {
    
    const smartLock = await SmartLock.findOne({ where: { device_id: smartLockDeviceId } });
    
    if (!smartLock) {
        return {
            status: 'failed',
            message: 'Smart lock not found.',
            data: {}
        };
    }

    const userSmartLockAccess = await UserSmartLockAccess.findOne({
        where: { user_id: userId, smart_lock_id: smartLock.id }
    });

    if (!userSmartLockAccess) {
        return {
            status: 'failed',
            message: 'You are not associated with this smart lock group.',
            data: {}
        };
    }

    await userSmartLockAccess.destroy();

    return {
        status: 'success',
        message: 'You have left the smart lock group successfully.',
        data: {}
    };
}
