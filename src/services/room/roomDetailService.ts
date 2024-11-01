import { Room } from "../../models/Room";
import { SmartLockGroup } from "../../models/SmartLockGroup";

export const getRoomDetails = async (businessType: string, roomId: number) => {
    try {
        const group = await SmartLockGroup.findOne({ where: { name: businessType } });
        if (!group) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'SmartLockGroup not found.',
                },
            };
        }
        console.log(roomId);

        const room = await Room.findOne({ where: { id: roomId, group_id: group.id } });
        if (!room) {
            return {
                statusCode: 404,
                data: {
                    status: 'failed',
                    message: 'Room not found.',
                },
            };
        }

        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Room details retrieved successfully.',
                data: room,
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while retrieving room details.',
                data: {},
            },
        };
    }
};
