import { Notification } from "../../models/Notification";

export const getUserNotifications = async (userId: number) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
        });

        if (notifications.length === 0) {
            const dummyData = [
                {
                    id: 1,
                    user_id: userId,
                    message: 'This is a dummy notification for testing purposes.',
                    created_at: '2024-08-14T00:00:00Z',
                    is_read: false,
                },
                {
                    id: 2,
                    user_id: userId,
                    message: 'Another dummy notification for testing purposes.',
                    created_at: '2024-08-15T00:00:00Z',
                    is_read: true,
                },
            ];

            return {
                statusCode: 200,
                data: {
                    status: 'success',
                    message: 'No notifications found. Returning dummy data for testing purposes.',
                    data: dummyData,
                },
            };
        }

        return {
            statusCode: 200,
            data: {
                status: 'success',
                message: 'Notifications retrieved successfully.',
                data: notifications,
            },
        };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return {
            statusCode: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while retrieving notifications.',
            },
        };
    }
};
