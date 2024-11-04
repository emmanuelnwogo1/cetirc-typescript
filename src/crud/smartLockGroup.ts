import { Router } from 'express';
import { SmartLockGroup } from '../models/SmartLockGroup';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const smartlockgroup = await SmartLockGroup.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'SmartLockGroup created successfully',
      data: smartlockgroup,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create smartlockgroup',
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
  
      const { rows: smartlockgroups, count: totalSmartLockGroups } = await SmartLockGroup.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalSmartLockGroups / limitNumber);
  
      if (!smartlockgroups.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No smartlockgroups found on this page',
          data: {
            smartlockgroups: [],
            pagination: {
              total: totalSmartLockGroups,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'SmartLockGroups retrieved successfully',
            data: {
              smartlockgroups,
              pagination: {
                total: totalSmartLockGroups,
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
        message: 'Failed to retrieve smartlockgroups',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const smartlockgroup = await SmartLockGroup.findByPk(req.params.id);
    if (!smartlockgroup) {
      res.status(404).json({
        status: 'failed',
        message: 'SmartLockGroup not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'SmartLockGroup retrieved successfully',
        data: smartlockgroup,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve smartlockgroup',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const smartlockgroupId = parseFloat(req.params.id);
    const [updated] = await SmartLockGroup.update(req.body, {
      where: { id: smartlockgroupId },
    });

    if (updated > 0) {
      const updatedSmartLockGroup = await SmartLockGroup.findByPk(smartlockgroupId);
      res.json({
        status: 'success',
        message: 'SmartLockGroup updated successfully',
        data: updatedSmartLockGroup,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'SmartLockGroup not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update smartlockgroup',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await SmartLockGroup.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'SmartLockGroup deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'SmartLockGroup not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete smartlockgroup',
      data: null,
    });
  }
});

export default router;