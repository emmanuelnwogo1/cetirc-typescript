import { Router } from 'express';
import { BusinessProfile } from '../models/BusinessProfile';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

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
        data: null,
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
      data: null,
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
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await BusinessProfile.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'BusinessProfile deleted successfully',
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
      message: 'Failed to delete businessprofile',
      data: null,
    });
  }
});

export default router;