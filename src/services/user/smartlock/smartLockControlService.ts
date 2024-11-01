import { SmartLock } from "../../../models/SmartLock";
import { UserSmartLockAccess } from "../../../models/UserSmartLockAccess";


export const controlSmartLock = async (userId: number, action: string, deviceId: string) => {
    if (!['open', 'close'].includes(action)) {
      throw new Error('Invalid action.');
    }

    const smartLock = await SmartLock.findOne({ where: { device_id: deviceId } });
    if (!smartLock) {
      throw new Error('Smart lock not found.');
    }

    const userAccess = await UserSmartLockAccess.findOne({
      where: { user_id: userId, smart_lock_id: smartLock.id },
    });
    if (!userAccess) {
      throw new Error('User does not have access to this smart lock.');
    }

    return {
      status: 'success',
      message: `Smart lock ${action} command sent successfully.`,
    };
}