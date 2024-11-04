import { Router } from 'express';
import { BusinessProfile } from '../models/BusinessProfile';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { BusinessDashboard } from '../models/BusinessDashboard';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const businessprofile = await BusinessProfile.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'BusinessProfile created successfully',
      data: businessprofile,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create businessprofile',
      data: {
        errors: error.errors.map((err: any) => ({
          message: err.message,
        })),
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
              { name: { [Op.like]: `%${q}%` } },
              { email: { [Op.like]: `%${q}%` } },
              { address: { [Op.like]: `%${q}%` } },
            ],
          }
        : {};
  
      const { rows: businessprofiles, count: totalBusinessProfiles } = await BusinessProfile.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalBusinessProfiles / limitNumber);
  
      if (!businessprofiles.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No businessprofiles found on this page',
          data: {
            businessprofiles: [],
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
              businessprofiles,
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
        message: 'Failed to retrieve businessprofiles',
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
    const businessprofile = await BusinessProfile.findByPk(req.params.id);
    if (!businessprofile) {
      res.status(404).json({
        status: 'failed',
        message: 'BusinessProfile not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'BusinessProfile retrieved successfully',
        data: businessprofile,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve businessprofile',
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
    const businessprofileId = parseFloat(req.params.id);
    const [updated] = await BusinessProfile.update(req.body, {
      where: { id: businessprofileId },
    });

    if (updated > 0) {
      const updatedBusinessProfile = await BusinessProfile.findByPk(businessprofileId);
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
      message: 'Failed to update businessprofile',
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