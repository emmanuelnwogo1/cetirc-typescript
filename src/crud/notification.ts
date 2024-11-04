import { Router } from 'express';
import { Notification } from '../models/Notification';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Notification created successfully',
      data: notification,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create notification',
      data: null,
    });
  }
});

// Read all with optional search
router.get('/', verifyToken, adminMiddleware, async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    try{
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const offset = (pageNumber - 1) * limitNumber;

      const whereClause = q
        ? {
            [Op.or]: [
              { username: { [Op.like]: `%${q}%` } },
              { email: { [Op.like]: `%${q}%` } },
              { first_name: { [Op.like]: `%${q}%` } },
              { last_name: { [Op.like]: `%${q}%` } },
            ],
          }
        : {};
  
      const { rows: notifications, count: totalNotifications } = await Notification.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalNotifications / limitNumber);
  
      if (!notifications.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No notifications found on this page',
          data: {
            notifications: [],
            pagination: {
              total: totalNotifications,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'Notifications retrieved successfully',
            data: {
              notifications,
              pagination: {
                total: totalNotifications,
                page: pageNumber,
                limit: limitNumber,
                totalPages,
              },
            },
        });
      }
    } catch (error: any) {
      res.status(500).json({
        status: 'failed',
        message: 'Failed to retrieve notifications',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      res.status(404).json({
        status: 'failed',
        message: 'Notification not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'Notification retrieved successfully',
        data: notification,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve notification',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const notificationId = parseFloat(req.params.id);
    const [updated] = await Notification.update(req.body, {
      where: { id: notificationId },
    });

    if (updated > 0) {
      const updatedNotification = await Notification.findByPk(notificationId);
      res.json({
        status: 'success',
        message: 'Notification updated successfully',
        data: updatedNotification,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'Notification not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update notification',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Notification.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'Notification deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'Notification not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete notification',
      data: null,
    });
  }
});

export default router;