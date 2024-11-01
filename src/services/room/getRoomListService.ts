import { Room } from "../../models/Room";
import { SmartLockGroup } from "../../models/SmartLockGroup";

export const getRoomsListByBusinessType = async (businessType: string) => {

    const validBusinessTypes: any[] = SmartLockGroup.BUSINESS_TYPES;

    if (!validBusinessTypes.includes(businessType)) {
        return {
            statusCode: 400,
            data: {
                status: 'failed',
                message: 'Invalid business type. Please provide a valid business type.',
            },
        };
    }

    try {
        const group = await SmartLockGroup.findOne({ where: { name: businessType } });
        if (!group) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'SmartLockGroup not found. Please provide a valid business type.',
                },
            };
        }

        const rooms = await Room.findAll({ where: { group_id: group.id } });
        if (!rooms.length) {
            return {
                statusCode: 200,
                data: {
                    status: 'success',
                    message: 'No rooms found for the specified business type.',
                    data: [],
                },
            };
        }

        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Rooms retrieved successfully.',
                data: rooms,
            },
        };
    } catch (error) {
        console.error('Error retrieving rooms:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while retrieving rooms.',
                data: {},
            },
        };
    }
};