import { Router } from 'express';
import { BusinessProfile } from '../models/BusinessProfile';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { BusinessDashboard } from '../models/BusinessDashboard';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

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
router.get('/', verifyToken, adminMiddleware, async (req, res): Promise<any> => {
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
        return res.json({
          status: 'success',
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

        const serverUrl = process.env.SERVER_URL;
        const defaultImageUrl = process.env.PLACEHOLDER_IMAGE;

        const businessProfilesUpdated = businessProfiles.map(function(businessProfile){
            businessProfile.image = businessProfile.image ? `${serverUrl}/api/${businessProfile.image}` : defaultImageUrl;
            return businessProfile;
        });

        return res.json({
            status: 'success',
            message: 'BusinessProfiles retrieved successfully',
            data: {
              businessProfiles: businessProfilesUpdated,
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
      return res.status(500).json({
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
router.get('/:id', verifyToken, adminMiddleware, async (req, res): Promise<any> => {
  try {
    var businessProfile = await BusinessProfile.findByPk(req.params.id);
    if (!businessProfile) {
      return res.status(404).json({
        status: 'failed',
        message: 'BusinessProfile not found',
        data: null,
      });
    } else {
        const serverUrl = process.env.SERVER_URL;
            const defaultImageUrl = `${process.env.PLACEHOLDER_IMAGE}`;

            businessProfile.image = businessProfile.image 
            ? `${serverUrl}/api/${businessProfile.image}` 
            : defaultImageUrl;

      return res.json({
        status: 'success',
        message: 'BusinessProfile retrieved successfully',
        data: businessProfile,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
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

const upload = multer({ dest: 'business_images/' });

router.patch(
  '/:id/image',
  verifyToken,
  adminMiddleware,
  upload.single('image'),
  async (req, res): Promise<any> => {

    try {
      const image = req.file;
      const businessId = parseInt(req.params.id);

      if (!image || !image.path || !businessId) {
        return res.status(400).json({
          status: 'failed',
          message: 'No image or business ID provided.',
          data: null,
        });
      }

      const imageBuffer = await fs.promises.readFile(image.path);

      const profile = await BusinessProfile.findOne({
        where: { id: businessId },
      });

      if (!profile) {
        return res.status(404).json({
          status: 'failed',
          message: 'BusinessProfile not found',
          data: null,
        });
      }

      const fileExtension = path.extname(image.originalname) || '.png';
      const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
      const imageName = `image_${timestamp}${fileExtension}`;
      const imagePath = path.join(__dirname, '../../business_images/', imageName);

      await fs.promises.writeFile(imagePath, imageBuffer);

      const serverUrl = process.env.SERVER_URL;
      const fullImageUrl = `${serverUrl}/api/business_images/${imageName}`;

      profile.image = `business_images/${imageName}`;
      await profile.save();

      return res.status(200).json({
        status: 'success',
        message: 'Business profile photo updated successfully.',
        data: { image_url: fullImageUrl },
      });
      
    } catch (error: any) {
      return res.status(500).json({
        status: 'failed',
        message: 'An error occurred while updating the business profile photo.',
        data: { error: error.message || 'Unknown error' },
      });
    }
  }
);

export default router;