import { Op } from "sequelize";
import { BusinessProfile } from "../../models/BusinessProfile";
import { BusinessSmartLock } from "../../models/BusinessSmartLock";
import { SmartLock } from "../../models/SmartLock";
import { SmartLockGroup } from "../../models/SmartLockGroup";

export const signUpBusinessSmartLock = async (userId: number, smartLockId: number, businessType: string) => {
    const businessProfile = await BusinessProfile.findOne({ where: { user_id: userId } });

    if (!businessProfile) {
      throw new Error('Business profile not found.');
    }

    const smartLock = await SmartLock.findByPk(smartLockId);
    if (!smartLock) {
      throw new Error(`Smart lock with ID ${smartLockId} does not exist.`);
    }

    let smartLockGroup = await SmartLockGroup.findOne({ where: { name: businessType } });
    if (!smartLockGroup) {
      smartLockGroup = await SmartLockGroup.create({ name: businessType } as SmartLockGroup);
    }

    const [businessSmartLock, created] = await BusinessSmartLock.upsert({
      business_profile_id: businessProfile.id,
      smart_lock_id: smartLock.id,
      business_type_id: smartLockGroup.id,
    } as BusinessSmartLock);

    return {
      status: 'success',
      message: 'Smart lock signed up successfully for the business.',
      data: { businessSmartLock, created },
    };
}

export const getBusinessSmartLocks = async (userId: number) => {

    const businessProfile = await BusinessProfile.findOne({ where: { user_id: userId } });
    
    if (!businessProfile) {
        return {
            status: 'failed',
            message: 'Business profile not found. Please ensure you have a valid business profile associated with your account.',
            data: []
        };
    }

    const businessSmartLocks = await BusinessSmartLock.findAll({
        where: { business_profile_id: businessProfile.id },
    });

    const businessSmartLockIds = businessSmartLocks.map(bsl => bsl.smart_lock_id);

    const smartLocks = await SmartLock.findAll({
        where: { id: { [Op.in]: businessSmartLockIds } }
    });

    if (smartLocks.length === 0) {
        return {
            status: 'success',
            message: 'No smart locks found for this business profile.',
            data: []
        };
    }

    return {
        status: 'success',
        message: 'Smart locks retrieved successfully.',
        data: smartLocks
    };
};