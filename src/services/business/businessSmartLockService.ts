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