import { Router } from 'express';
import { TransactionHistory } from '../models/TransactionHistory';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { User } from '../models/User';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {

        const transactionHistory = await TransactionHistory.create({
            ...req.body,
        });
        res.status(201).json({
            status: 'success',
            message: 'TransactionHistory created successfully',
            data: transactionHistory,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create transactionhistory',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

// Read all with optional search
router.get('/', verifyToken, adminMiddleware, async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    try {
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const offset = (pageNumber - 1) * limitNumber;

        const whereClause = q
            ? {
                [Op.or]: [
                    { '$user.first_name$': { [Op.iLike]: `%${q}%` } },
                    { '$user.last_name$': { [Op.iLike]: `%${q}%` } },
                    { '$user.email$': { [Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
  
        const { rows: transactionHistorys, count: totalTransactionHistorys } = await TransactionHistory.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['first_name', 'last_name', 'email'],
                },
            ],
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalTransactionHistorys / limitNumber);
  
        if (!transactionHistorys.length) {
            res.status(200).json({
                status: 'success',
                message: 'No transactionhistorys found on this page',
                data: {
                    transactionHistorys: [],
                    pagination: {
                        total: totalTransactionHistorys,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'TransactionHistory retrieved successfully',
                data: {
                    transactionHistorys,
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
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const transactionHistory = await TransactionHistory.findByPk(req.params.id);
        if (!transactionHistory) {
            res.status(404).json({
                status: 'failed',
                message: 'TransactionHistory not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'TransactionHistory retrieved successfully',
                data: transactionHistory,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve transactionhistory',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const transactionHistoryId = parseFloat(req.params.id);
        const [updated] = await TransactionHistory.update(req.body, {
            where: { id: transactionHistoryId },
        });

        if (updated > 0) {
            const updatedTransactionHistory = await TransactionHistory.findByPk(transactionHistoryId);
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
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
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
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;