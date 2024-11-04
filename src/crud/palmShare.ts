import { Router } from 'express';
import { PalmShare } from '../models/PalmShare';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const palmshare = await PalmShare.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'PalmShare created successfully',
      data: palmshare,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create palmshare',
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
  
      const { rows: palmshares, count: totalPalmShares } = await PalmShare.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalPalmShares / limitNumber);
  
      if (!palmshares.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No palmshares found on this page',
          data: {
            palmshares: [],
            pagination: {
              total: totalPalmShares,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'PalmShares retrieved successfully',
            data: {
              palmshares,
              pagination: {
                total: totalPalmShares,
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
        message: 'Failed to retrieve palmshares',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const palmshare = await PalmShare.findByPk(req.params.id);
    if (!palmshare) {
      res.status(404).json({
        status: 'failed',
        message: 'PalmShare not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'PalmShare retrieved successfully',
        data: palmshare,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve palmshare',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const palmshareId = parseFloat(req.params.id);
    const [updated] = await PalmShare.update(req.body, {
      where: { id: palmshareId },
    });

    if (updated > 0) {
      const updatedPalmShare = await PalmShare.findByPk(palmshareId);
      res.json({
        status: 'success',
        message: 'PalmShare updated successfully',
        data: updatedPalmShare,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'PalmShare not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update palmshare',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await PalmShare.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'PalmShare deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'PalmShare not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete palmshare',
      data: null,
    });
  }
});

export default router;