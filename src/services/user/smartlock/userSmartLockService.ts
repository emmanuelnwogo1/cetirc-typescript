import { BusinessProfile } from "../../../models/BusinessProfile";
import { BusinessSmartLock } from "../../../models/BusinessSmartLock";
import { SmartLock } from "../../../models/SmartLock";
import { SmartLockGroup } from "../../../models/SmartLockGroup";
import { UserSmartLockAccess } from "../../../models/UserSmartLockAccess";

class UserSmartLockService {
    
    async userSmartLockSignUp(deviceId: string, groupName: string, userId: number) {
        
        const smartLock = await SmartLock.findOne({ where: { device_id: deviceId } });
        if (!smartLock) {
            return {
                status: 'failed',
                message: 'Smart lock not found.',
                data: {}
            };
        }

        var smartLockGroup = await SmartLockGroup.findOne({ where: { name: groupName } });

        if (!smartLockGroup) {
            smartLockGroup = await SmartLockGroup.create({
                name: groupName,
                description: `${groupName} Group`,
            } as SmartLockGroup);
        }

        if (smartLock.group_id !== smartLockGroup.id) {
            smartLock.group_id = smartLockGroup.id;
            await smartLock.save();
        }

        const existingAccess = await UserSmartLockAccess.findOne({
            where: { user_id: userId, smart_lock_id: smartLock.id }
        });

        if (existingAccess) {
            return {
                status: 'failed',
                message: 'User already has access to this smart lock.',
                data: {
                    device_id: deviceId,
                    group_name: groupName
                }
            };
        }

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

    async removeUserFromSmartLockGroup(userId: number, smartLockDeviceId: string) {
        
        const businessProfile = await BusinessProfile.findOne({ where: { user_id: userId } });
        
        if (!businessProfile) {
            throw new Error('Business profile not found.');
        }
    
        const smartLock = await SmartLock.findOne({ where: { device_id: smartLockDeviceId } });
        if (!smartLock) {
            throw new Error('Smart lock not found.');
        }
    
        const businessSmartLocks = await BusinessSmartLock.findAll({ where: { business_profile_id: businessProfile.id } });
        const isSmartLockAssociated = businessSmartLocks.some((businessSmartLock) => businessSmartLock.smart_lock_id === smartLock.id);
        
        if (!isSmartLockAssociated) {
            throw new Error('Smart lock does not belong to your business.');
        }
    
        const userSmartLockAccess = await UserSmartLockAccess.findOne({ where: { user_id: userId, smart_lock_id: smartLock.id } });
        if (!userSmartLockAccess) {
            throw new Error('User is not associated with this smart lock group.');
        }
    
        await userSmartLockAccess.destroy();
        return {
            status: 'success',
            message: 'User removed from smart lock group successfully.',
        };
    }    
}

export default new UserSmartLockService();
