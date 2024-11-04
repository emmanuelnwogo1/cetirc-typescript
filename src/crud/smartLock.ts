import { Router } from 'express';
import { SmartLock } from '../models/SmartLock';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const smartlock = await SmartLock.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'SmartLock created successfully',
      data: smartlock,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create smartlock',
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
  
      const { rows: smartlocks, count: totalSmartLocks } = await SmartLock.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalSmartLocks / limitNumber);
  
      if (!smartlocks.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No smartlocks found on this page',
          data: {
            smartlocks: [],
            pagination: {
              total: totalSmartLocks,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'SmartLocks retrieved successfully',
            data: {
              smartlocks,
              pagination: {
                total: totalSmartLocks,
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
        message: 'Failed to retrieve smartlocks',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const smartlock = await SmartLock.findByPk(req.params.id);
    if (!smartlock) {
      res.status(404).json({
        status: 'failed',
        message: 'SmartLock not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'SmartLock retrieved successfully',
        data: smartlock,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve smartlock',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const smartlockId = parseFloat(req.params.id);
    const [updated] = await SmartLock.update(req.body, {
      where: { id: smartlockId },
    });

    if (updated > 0) {
      const updatedSmartLock = await SmartLock.findByPk(smartlockId);
      res.json({
        status: 'success',
        message: 'SmartLock updated successfully',
        data: updatedSmartLock,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'SmartLock not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update smartlock',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await SmartLock.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'SmartLock deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'SmartLock not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete smartlock',
      data: null,
    });
  }
});

export default router;