import { Router } from 'express';
import { BusinessSmartLock } from '../models/BusinessSmartLock';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const businesssmartlock = await BusinessSmartLock.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'BusinessSmartLock created successfully',
      data: businesssmartlock,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create businesssmartlock',
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
  
      const { rows: businesssmartlocks, count: totalBusinessSmartLocks } = await BusinessSmartLock.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalBusinessSmartLocks / limitNumber);
  
      if (!businesssmartlocks.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No businesssmartlocks found on this page',
          data: {
            businesssmartlocks: [],
            pagination: {
              total: totalBusinessSmartLocks,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'BusinessSmartLocks retrieved successfully',
            data: {
              businesssmartlocks,
              pagination: {
                total: totalBusinessSmartLocks,
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
        message: 'Failed to retrieve businesssmartlocks',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const businesssmartlock = await BusinessSmartLock.findByPk(req.params.id);
    if (!businesssmartlock) {
      res.status(404).json({
        status: 'failed',
        message: 'BusinessSmartLock not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'BusinessSmartLock retrieved successfully',
        data: businesssmartlock,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve businesssmartlock',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const businesssmartlockId = parseFloat(req.params.id);
    const [updated] = await BusinessSmartLock.update(req.body, {
      where: { id: businesssmartlockId },
    });

    if (updated > 0) {
      const updatedBusinessSmartLock = await BusinessSmartLock.findByPk(businesssmartlockId);
      res.json({
        status: 'success',
        message: 'BusinessSmartLock updated successfully',
        data: updatedBusinessSmartLock,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'BusinessSmartLock not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update businesssmartlock',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await BusinessSmartLock.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'BusinessSmartLock deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'BusinessSmartLock not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete businesssmartlock',
      data: null,
    });
  }
});

export default router;