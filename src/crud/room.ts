import { Router } from 'express';
import { Room } from '../models/Room';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Room created successfully',
      data: room,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create room',
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
  
      const { rows: rooms, count: totalRooms } = await Room.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalRooms / limitNumber);
  
      if (!rooms.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No rooms found on this page',
          data: {
            rooms: [],
            pagination: {
              total: totalRooms,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'Rooms retrieved successfully',
            data: {
              rooms,
              pagination: {
                total: totalRooms,
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
        message: 'Failed to retrieve rooms',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) {
      res.status(404).json({
        status: 'failed',
        message: 'Room not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'Room retrieved successfully',
        data: room,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve room',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const roomId = parseFloat(req.params.id);
    const [updated] = await Room.update(req.body, {
      where: { id: roomId },
    });

    if (updated > 0) {
      const updatedRoom = await Room.findByPk(roomId);
      res.json({
        status: 'success',
        message: 'Room updated successfully',
        data: updatedRoom,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'Room not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update room',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Room.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'Room deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'Room not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete room',
      data: null,
    });
  }
});

export default router;