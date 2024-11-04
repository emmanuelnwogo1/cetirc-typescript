import { Router } from 'express';
import { TransactionHistory } from '../models/TransactionHistory';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const transactionhistory = await TransactionHistory.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'TransactionHistory created successfully',
      data: transactionhistory,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to create transactionhistory',
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
  
      const { rows: transactionhistorys, count: totalTransactionHistorys } = await TransactionHistory.findAndCountAll({
        where: whereClause,
        offset,
        limit: limitNumber,
      });
  
      const totalPages = Math.ceil(totalTransactionHistorys / limitNumber);
  
      if (!transactionhistorys.length) {
        res.status(404).json({
          status: 'failed',
          message: 'No transactionhistorys found on this page',
          data: {
            transactionhistorys: [],
            pagination: {
              total: totalTransactionHistorys,
              page: pageNumber,
              limit: limitNumber,
              totalPages,
            },
          },
        });
      }else{
        res.json({
            status: 'success',
            message: 'TransactionHistorys retrieved successfully',
            data: {
              transactionhistorys,
              pagination: {
                total: totalTransactionHistorys,
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
        message: 'Failed to retrieve transactionhistorys',
        data: null,
      });
    }
});
  

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const transactionhistory = await TransactionHistory.findByPk(req.params.id);
    if (!transactionhistory) {
      res.status(404).json({
        status: 'failed',
        message: 'TransactionHistory not found',
        data: null,
      });
    } else {
      res.json({
        status: 'success',
        message: 'TransactionHistory retrieved successfully',
        data: transactionhistory,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to retrieve transactionhistory',
      data: null,
    });
  }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const transactionhistoryId = parseFloat(req.params.id);
    const [updated] = await TransactionHistory.update(req.body, {
      where: { id: transactionhistoryId },
    });

    if (updated > 0) {
      const updatedTransactionHistory = await TransactionHistory.findByPk(transactionhistoryId);
      res.json({
        status: 'success',
        message: 'TransactionHistory updated successfully',
        data: updatedTransactionHistory,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'TransactionHistory not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to update transactionhistory',
      data: null,
    });
  }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
  try {
    const deleted = await TransactionHistory.destroy({
      where: { id: req.params.id },
    });

    if (deleted) {
      res.status(200).json({
        status: 'success',
        message: 'TransactionHistory deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        status: 'failed',
        message: 'TransactionHistory not found',
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'failed',
      message: 'Failed to delete transactionhistory',
      data: null,
    });
  }
});

export default router;