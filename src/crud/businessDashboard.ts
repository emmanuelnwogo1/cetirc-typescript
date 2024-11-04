import { Router } from 'express';
import { BusinessDashboard } from '../models/BusinessDashboard';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const businessdashboard = await BusinessDashboard.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'BusinessDashboard created successfully',
      data: businessdashboard,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create businessdashboard',
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
  
      const { rows: businessdashboards, count: totalBusinessDashboards } = await BusinessDashboard.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalBusinessDashboards / limitNumber);
  
      if (!businessdashboards.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No businessdashboards found on this page',
          data: {
            businessdashboards: [],
            pagination: {
              total: totalBusinessDashboards,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'BusinessDashboards retrieved successfully',
            data: {
              businessdashboards,
              pagination: {
                total: totalBusinessDashboards,
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
        message: 'Failed to retrieve businessdashboards',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const businessdashboard = await BusinessDashboard.findByPk(req.params.id);
    if (!businessdashboard) {
      res.status(404).json({
        status: 'failed',
        message: 'BusinessDashboard not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'BusinessDashboard retrieved successfully',
        data: businessdashboard,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve businessdashboard',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const businessdashboardId = parseFloat(req.params.id);
    const [updated] = await BusinessDashboard.update(req.body, {
      where: { id: businessdashboardId },
    });

    if (updated > 0) {
      const updatedBusinessDashboard = await BusinessDashboard.findByPk(businessdashboardId);
      res.json({
        status: 'success',
        message: 'BusinessDashboard updated successfully',
        data: updatedBusinessDashboard,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'BusinessDashboard not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update businessdashboard',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await BusinessDashboard.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'BusinessDashboard deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'BusinessDashboard not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete businessdashboard',
      data: null,
    });
  }
});

export default router;