import { SmartLock } from "../../../models/SmartLock";
import { SmartLockGroup } from "../../../models/SmartLockGroup";
import { UserSmartLockAccess } from "../../../models/UserSmartLockAccess";

class UserSmartLockService {
    
    async userSmartLockSignUp(deviceId: string, groupName: string, userId: number) {
        
        const smartLock = await SmartLock.findOne({ where: { device_id: deviceId } });
        if (!smartLock) {
            throw new Error('Smart lock not found.');
        }

        // Find or create the SmartLockGroup
        var smartLockGroup = await SmartLockGroup.findOne({ where: { name: groupName } });

        if (!smartLockGroup) {
            smartLockGroup = await SmartLockGroup.create({
                name: groupName,
                description: `${groupName} Group`,
            } as SmartLockGroup);
        }

        // Assign the SmartLock to the group if it isn't already
        if (smartLock.group_id !== smartLockGroup.id) {
            smartLock.group_id = smartLockGroup.id;
            await smartLock.save();
        }

        // Check if the user already has access to the SmartLock
        const existingAccess = await UserSmartLockAccess.findOne({
            where: { user_id: userId, smart_lock_id: smartLock.id }
        });

        if (existingAccess) {
            throw new Error('User already has access to this smart lock.');
        }

        // Grant access to the user for the smart lock
        await UserSmartLockAccess.create({
            smart_lock_id: smartLock.id,
            user_id: userId,
            granted_at: new Date(),
            granted_by_id: userId,
            period: new Date(),
            room_id: smartLock.room_id
        } as UserSmartLockAccess);

        return {
            status: 'success',
            message: 'User successfully signed up for the smart lock.',
            data: {
                device_id: deviceId,
                group_name: groupName
            }
        };
    }
}

export default new UserSmartLockService();
