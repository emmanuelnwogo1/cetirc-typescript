import { Router } from 'express';
import { Card } from '../models/Card';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const card = await Card.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Card created successfully',
      data: card,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create card',
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
  
      const { rows: cards, count: totalCards } = await Card.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalCards / limitNumber);
  
      if (!cards.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No cards found on this page',
          data: {
            cards: [],
            pagination: {
              total: totalCards,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'Cards retrieved successfully',
            data: {
              cards,
              pagination: {
                total: totalCards,
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
        message: 'Failed to retrieve cards',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) {
      res.status(404).json({
        status: 'failed',
        message: 'Card not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'Card retrieved successfully',
        data: card,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve card',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const cardId = parseFloat(req.params.id);
    const [updated] = await Card.update(req.body, {
      where: { id: cardId },
    });

    if (updated > 0) {
      const updatedCard = await Card.findByPk(cardId);
      res.json({
        status: 'success',
        message: 'Card updated successfully',
        data: updatedCard,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'Card not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update card',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Card.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'Card deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'Card not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete card',
      data: null,
    });
  }
});

export default router;