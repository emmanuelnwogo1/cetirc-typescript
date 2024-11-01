import { Op } from "sequelize";
import { BusinessProfile } from "../../models/BusinessProfile";
import { BusinessSmartLock } from "../../models/BusinessSmartLock";
import { SmartLock } from "../../models/SmartLock";
import { SmartLockGroup } from "../../models/SmartLockGroup";
import { User } from "../../models/User";
import { UserSmartLockAccess } from "../../models/UserSmartLockAccess";
import { Room } from "../../models/Room";

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

export const grantSmartLockAccessToBusiness = async (
    requestUser: any,
    username: string,
    device_id: string,
    period: Date,
    room_id: number,
    businessType: string,
    grantedBy: number
) => {
    
    const validBusinessTypes = [
        'apartment',
        'school',
        'gym',
        'hotel',
        'retail_store',
        'company',
        'airbnb',
        'others'
    ];

    if (!validBusinessTypes.includes(businessType)) {
        return {
            status: 'failed',
            message: 'Invalid business type.',
            data: {}
        };
    }

    const userToGrant = await User.findOne({ where: { username } });
    if (!userToGrant) {
        return {
            status: 'failed',
            message: 'User not found.',
            data: {}
        };
    }

    const smartLock = await SmartLock.findOne({ where: { device_id } });
    if (!smartLock) {
        return {
            status: 'failed',
            message: 'Smart lock not found.',
            data: {}
        };
    }

    const room = await Room.findOne({ where: { id: room_id } });
    if (!room) {
        return {
            status: 'failed',
            message: 'Room not found.',
            data: {}
        };
    }
    const smartLockGroup = await SmartLockGroup.findOne({where: {id: smartLock.group_id}})

    if(!smartLockGroup){
        return {
            status: 'failed',
            message: 'Smart lock group does not exist.',
            data: {}
        };
    }

    if (smartLockGroup.name !== businessType) {
        return {
            status: 'failed',
            message: 'Smart lock does not belong to this business type.',
            data: {}
        };
    }

    const [userAccess, created] = await UserSmartLockAccess.upsert({
        user_id: userToGrant.id,
        smart_lock_id: smartLock.id,
        granted_by_id: requestUser.id,
        room_id: room.id,
        period: period
    } as UserSmartLockAccess);

    return {
        status: 'success',
        message: 'Access granted successfully.',
        data: {
            user_id: userToGrant.id,
            username: userToGrant.username,
            smart_lock: smartLock.device_id,
            room_id: room.id,
            period
        }
    };
};

export const addSmartLockService = async (device_id: string, business_type: string, userId: number) => {

    const user: User | null = await User.findOne({ where: { id: userId } });
    if (!user) {
        return {
            statusCode: 401,
            data: {
                status: 'UnAuthorized',
                message: 'User does not exist.',
                data: {}
            }
        };
    }

    const smartLockGroup = await SmartLockGroup.findOne({ where: { name: business_type } });
    if (!smartLockGroup) {
        return {
            statusCode: 400,
            data: {
                status: 'failed',
                message: 'Invalid input.',
                data: { business_type: [`Smart lock group with name '${business_type}' does not exist.`] }
            }
        };
    }

    var smartLock = null;
    try{
        smartLock = await SmartLock.create({
            id: 503,
            device_id,
            group_id: smartLockGroup.id,
            created_at: new Date
        } as SmartLock);
    }catch(e: any){
        throw new Error(e.message);
    }

    if(!smartLock){
        return {
            statusCode: 404,
            data: {
                status: 'failed',
                message: 'Failed to create smart lock.',
                data: {}
            }
        };
    }


    const businessProfile = await BusinessProfile.findOne({ where: { user_id: userId } });
    if (businessProfile) {

        await BusinessSmartLock.findOrCreate({
            where: { id: 503, business_profile_id: businessProfile.id, smart_lock_id: smartLock.id }
        });
        return {
            statusCode: 201,
            data: {
                status: 'success',
                message: 'Smart lock added and associated with BusinessProfile successfully.',
                data: smartLock
            }
        };
    } else {
        await UserSmartLockAccess.findOrCreate({
            where: { user_id: userId, smart_lock_id: smartLock.id }
        });
        return {
            statusCode: 201,
            data: {
                status: 'success',
                message: 'Smart lock added and associated with UserSmartLockAccess successfully.',
                data: smartLock
            }
        };
    }
};