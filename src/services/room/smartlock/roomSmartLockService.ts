import { Room } from '../../../models/Room';
import { SmartLock } from '../../../models/SmartLock';

export const addSmartLockToRoom = async (roomId: number, smartLockDeviceId: string) => {
    if (!smartLockDeviceId) {
        return {
            statusCode: 400,
            data: {
                status: 'failed',
                message: 'smart lock device id is required.',
                data: {}
            },
        };
    }

    try {
        const room = await Room.findByPk(roomId);
        if (!room) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Room not found.',
                    data: {}
                },
            };
        }

        const smartLock = await SmartLock.findOne({ where: { device_id: smartLockDeviceId } });
        if (!smartLock) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Smart lock not found.',
                    data: {}
                },
            };
        }

        smartLock.room_id = roomId;
        await smartLock.save();

        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Smart lock assigned to room successfully.',
                data: {}
            },
        };
    } catch (error) {
        console.error('Error assigning smart lock to room:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while assigning the smart lock to the room.',
                data: {}
            },
        };
    }
};
