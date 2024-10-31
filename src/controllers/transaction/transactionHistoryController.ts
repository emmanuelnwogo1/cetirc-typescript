import { Request, Response } from 'express';
import { getTransactionHistory } from '../../services/transaction/transactionHistoryService';

export const getTransactionHistoryController = async (req: Request, res: Response) => {
    const userId = req.user.id;

    const transactions = await getTransactionHistory(userId);

    if (transactions.length > 0) {
        res.status(200).json({
            status: 'success',
            message: 'Transaction history retrieved successfully.',
            data: transactions,
        });
    } else {
        res.status(200).json({
            status: 'info',
            message: 'No transaction history available for this user.',
            data: [],
        });
    }
};