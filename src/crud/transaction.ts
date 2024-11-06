import { Router } from 'express';
import { Transaction } from '../models/Transaction';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';
import { User } from '../models/User';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
        });
        res.status(201).json({
            status: 'success',
            message: 'Transaction created successfully',
            data: transaction,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: error,
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
                    { '$user.email$': { [Op.iLike]: `%${q}%` } },
                    { '$user.first_name$': { [Op.iLike]: `%${q}%` } },
                    { '$user.last_name$': { [Op.iLike]: `%${q}%` } },
                ],
            }
            : {};
  
        const { rows: transactions, count: totalTransactions } = await Transaction.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'user',
                    required: false,
                    attributes: ['first_name', 'last_name', 'email'],
                },
            ],
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalTransactions / limitNumber);
  
        if (!transactions.length) {
            res.status(200).json({
                status: 'success',
                message: 'No transactions found on this page',
                data: {
                    transactions: [],
                    pagination: {
                        total: totalTransactions,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'Transaction retrieved successfully',
                data: {
                    transactions,
                    pagination: {
                        total: totalTransactions,
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
            message: 'Failed to retrieve transactions',
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
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            res.status(404).json({
                status: 'failed',
                message: 'Transaction not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'Transaction retrieved successfully',
                data: transaction,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve transaction',
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
        const transactionId = parseFloat(req.params.id);
        const [updated] = await Transaction.update(req.body, {
            where: { id: transactionId },
        });

        if (updated > 0) {
            const updatedTransaction = await Transaction.findByPk(transactionId);
            res.json({
                status: 'success',
                message: 'Transaction updated successfully',
                data: updatedTransaction,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'Transaction not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update transaction',
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
        const deleted = await Transaction.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'Transaction deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'Transaction not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete transaction',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent?.code}`,
            },
        });
    }
});

export default router;