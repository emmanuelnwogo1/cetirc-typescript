import { Router } from 'express';
import { Withdrawal } from '../models/Withdrawal';
import verifyToken from '../middlewares/authMiddleware';
import adminMiddleware from '../middlewares/adminMiddleware';
import { Op } from 'sequelize';

const router = Router();

// Create
router.post('/', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const withdrawal = await Withdrawal.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Withdrawal created successfully',
            data: withdrawal,
        });
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to create withdrawal',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent.code}`,
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
                withdraw_code: { [Op.like]: `%${q}%` },
            }
            : {};
  
        const { rows: withdrawals, count: totalWithdrawals } = await Withdrawal.findAndCountAll({
            where: whereClause,
            offset,
            limit: limitNumber,
        });
  
        const totalPages = Math.ceil(totalWithdrawals / limitNumber);
  
        if (!withdrawals.length) {
            res.status(200).json({
                status: 'success',
                message: 'No withdrawals found on this page',
                data: {
                    withdrawals: [],
                    pagination: {
                        total: totalWithdrawals,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages,
                    },
                },
            });
        } else {
            res.json({
                status: 'success',
                message: 'Withdrawal retrieved successfully',
                data: {
                    withdrawals,
                    pagination: {
                        total: totalWithdrawals,
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
            message: 'Failed to retrieve withdrawals',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent.code}`,
            },
        });
    }
});

// Read one
router.get('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const withdrawal = await Withdrawal.findByPk(req.params.id);
        if (!withdrawal) {
            res.status(404).json({
                status: 'failed',
                message: 'Withdrawal not found',
                data: null,
            });
        } else {
            res.json({
                status: 'success',
                message: 'Withdrawal retrieved successfully',
                data: withdrawal,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to retrieve withdrawal',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent.code}`,
            },
        });
    }
});

// Update
router.put('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const withdrawalId = parseFloat(req.params.id);
        const [updated] = await Withdrawal.update(req.body, {
            where: { id: withdrawalId },
        });

        if (updated > 0) {
            const updatedWithdrawal = await Withdrawal.findByPk(withdrawalId);
            res.json({
                status: 'success',
                message: 'Withdrawal updated successfully',
                data: updatedWithdrawal,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'Withdrawal not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to update withdrawal',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent.code}`,
            },
        });
    }
});

// Delete
router.delete('/:id', verifyToken, adminMiddleware, async (req, res) => {
    try {
        const deleted = await Withdrawal.destroy({
            where: { id: req.params.id },
        });

        if (deleted) {
            res.status(200).json({
                status: 'success',
                message: 'Withdrawal deleted successfully',
                data: null,
            });
        } else {
            res.status(404).json({
                status: 'failed',
                message: 'Withdrawal not found',
                data: null,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            status: 'failed',
            message: 'Failed to delete withdrawal',
            data: {
                errors: error.errors?.map((err: any) => ({
                    message: err.message,
                })) ?? `Error code: ${error.parent.code}`,
            },
        });
    }
});

export default router;