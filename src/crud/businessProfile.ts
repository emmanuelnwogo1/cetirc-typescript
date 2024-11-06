import { Router } from 'express';
import { BusinessProfile } from '../models/BusinessProfile';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { BusinessDashboard } from '../models/BusinessDashboard';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res): Promise<any> => {
  try {
    const businessProfile = await BusinessProfile.create(req.body);
        return res.status(201).json({
            status: 'success',
            message: 'BusinessProfile created successfully',
            data: businessProfile,
        });
  } catch (error: any) {
        return res.status(500).json({
            status: 'failed',
            message: 'Failed to create business profile.',
            data: {
                errors: error.errors?.map((err: any) => ({
                message: err.message,
                })) || error.detail,
            },
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
              { name: { [Op.iLike]: `%${q}%` } },
              { email: { [Op.iLike]: `%${q}%` } },
              { address: { [Op.iLike]: `%${q}%` } },
            ],
          }
        : {};
  
      const { rows: businessProfiles, count: totalBusinessProfiles } = await BusinessProfile.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalBusinessProfiles / limitNumber);
  
      if (!businessProfiles.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No businessProfiles found on this page',
          data: {
            businessProfiles: [],
            pagination: {
              total: totalBusinessProfiles,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'BusinessProfiles retrieved successfully',
            data: {
              businessProfiles,
              pagination: {
                total: totalBusinessProfiles,
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
        message: 'Failed to retrieve businessProfiles',
        data: {
            errors: error.errors.map((err: any) => ({
              message: err.message,
            })),
          },
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const businessProfile = await BusinessProfile.findByPk(req.params.id);
    if (!businessProfile) {
      res.status(404).json({
        status: 'failed',
        message: 'BusinessProfile not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'BusinessProfile retrieved successfully',
        data: businessProfile,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve businessProfile',
      data: {
        errors: error.errors.map((err: any) => ({
          message: err.message,
        })),
      },
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const businessProfileId = parseFloat(req.params.id);
    const [updated] = await BusinessProfile.update(req.body, {
      where: { id: businessProfileId },
    });

    if (updated > 0) {
      const updatedBusinessProfile = await BusinessProfile.findByPk(businessProfileId);
      res.json({
        status: 'success',
        message: 'BusinessProfile updated successfully',
        data: updatedBusinessProfile,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'BusinessProfile not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update businessProfile',
      data: {
        errors: error.errors.map((err: any) => ({
          message: err.message,
        })),
      },
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
    const businessProfileId = req.params.id;
  
    try {
      await BusinessDashboard.destroy({
        where: { business_id: businessProfileId },
      });
  
      // Now, delete the BusinessProfile
      const deleted = await BusinessProfile.destroy({
        where: { id: businessProfileId },
      });
  
      if (deleted) {
        res.status(200).json({
          status: 'success',
          message: 'BusinessProfile and its associated BusinessDashboards deleted successfully',
          data: null,
        });
      } else {
        res.status(404).json({
          status: 'failed',
          message: 'BusinessProfile not found',
          data: null,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        status: 'failed',
        message: 'Failed to delete BusinessProfile',
        data: {
            errors: error.errors.map((err: any) => ({
              message: err.message,
            })),
          },
      });
    }
});

export default router;