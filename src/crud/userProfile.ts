import { Router } from 'express';
import { UserProfile } from '../models/UserProfile';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const userprofile = await UserProfile.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'UserProfile created successfully',
      data: userprofile,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create userprofile',
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
  
      const { rows: userprofiles, count: totalUserProfiles } = await UserProfile.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalUserProfiles / limitNumber);
  
      if (!userprofiles.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No userprofiles found on this page',
          data: {
            userprofiles: [],
            pagination: {
              total: totalUserProfiles,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'UserProfiles retrieved successfully',
            data: {
              userprofiles,
              pagination: {
                total: totalUserProfiles,
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
        message: 'Failed to retrieve userprofiles',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const userprofile = await UserProfile.findByPk(req.params.id);
    if (!userprofile) {
      res.status(404).json({
        status: 'failed',
        message: 'UserProfile not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'UserProfile retrieved successfully',
        data: userprofile,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve userprofile',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const userprofileId = parseFloat(req.params.id);
    const [updated] = await UserProfile.update(req.body, {
      where: { id: userprofileId },
    });

    if (updated > 0) {
      const updatedUserProfile = await UserProfile.findByPk(userprofileId);
      res.json({
        status: 'success',
        message: 'UserProfile updated successfully',
        data: updatedUserProfile,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'UserProfile not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update userprofile',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await UserProfile.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'UserProfile deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'UserProfile not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete userprofile',
      data: null,
    });
  }
});

export default router;