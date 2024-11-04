import { Router } from 'express';
import { UserSmartLockAccess } from '../models/UserSmartLockAccess';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const usersmartlockaccess = await UserSmartLockAccess.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'UserSmartLockAccess created successfully',
      data: usersmartlockaccess,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create usersmartlockaccess',
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
  
      const { rows: usersmartlockaccesss, count: totalUserSmartLockAccesss } = await UserSmartLockAccess.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalUserSmartLockAccesss / limitNumber);
  
      if (!usersmartlockaccesss.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No usersmartlockaccesss found on this page',
          data: {
            usersmartlockaccesss: [],
            pagination: {
              total: totalUserSmartLockAccesss,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'UserSmartLockAccesss retrieved successfully',
            data: {
              usersmartlockaccesss,
              pagination: {
                total: totalUserSmartLockAccesss,
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
        message: 'Failed to retrieve usersmartlockaccesss',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const usersmartlockaccess = await UserSmartLockAccess.findByPk(req.params.id);
    if (!usersmartlockaccess) {
      res.status(404).json({
        status: 'failed',
        message: 'UserSmartLockAccess not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'UserSmartLockAccess retrieved successfully',
        data: usersmartlockaccess,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve usersmartlockaccess',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const usersmartlockaccessId = parseFloat(req.params.id);
    const [updated] = await UserSmartLockAccess.update(req.body, {
      where: { id: usersmartlockaccessId },
    });

    if (updated > 0) {
      const updatedUserSmartLockAccess = await UserSmartLockAccess.findByPk(usersmartlockaccessId);
      res.json({
        status: 'success',
        message: 'UserSmartLockAccess updated successfully',
        data: updatedUserSmartLockAccess,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'UserSmartLockAccess not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update usersmartlockaccess',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await UserSmartLockAccess.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'UserSmartLockAccess deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'UserSmartLockAccess not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete usersmartlockaccess',
      data: null,
    });
  }
});

export default router;