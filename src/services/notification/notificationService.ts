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
                status_code: 200,
                data: {
                    status: 'success',
                    message: 'No notifications found. Returning dummy data for testing purposes.',
                    data: dummyData,
                },
            };
        }

        return {
            status_code: 200,
            data: {
                status: 'success',
                message: 'Notifications retrieved successfully.',
                data: notifications,
            },
        };
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return {
            status_code: 500,
            data: {
                status: 'failed',
                message: 'An error occurred while retrieving notifications.',
            },
        };
    }
};

export const getNotificationById = async (notificationId: number, userId: number) => {

    try {

        const notification = await Notification.findOne({
            where: { id: notificationId, user_id: userId },
        });

        if (notification) {
            return {
                status: 'success',
                message: 'Notification retrieved successfully.',
                data: notification,
            };
        } else {
            // Dummy notification for testing purposes
            const dummyNotification = {
                id: 11,
                user_id: userId,
                message: 'This is a dummy notification for testing purposes.',
                created_at: '2024-08-14T00:00:00Z',
                is_read: false,
            };
            return {
                status: 'success',
                message: 'Notification not found. Returning dummy data for testing purposes.',
                data: dummyNotification,
            };
        }
    } catch (error) {
        return {
            status: 'failed',
            message: 'An error occurred while retrieving the notification.',
        };
    }
};

export const updateNotificationById = async (userId: number, notificationId: number, data: any) => {
    try {
        console.log(notificationId, userId);
        const notification = await Notification.findOne({
            where: { id: notificationId, user_id: userId },
        });
        console.log(notification);

        if (!notification) {
            return { status: 'failed', message: 'Notification not found.', data: {} };
        }

        await notification.update(data);

        return {
            status: 'success',
            message: 'Notification updated successfully.',
            data: notification,
        };
    } catch (error: any) {
        return {
            status: 'success',
            message: 'Failed to updated notification',
            data: error.message,
        };
    }
};