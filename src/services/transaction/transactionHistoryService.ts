import { TransactionHistory } from "../../models/TransactionHistory";

export const getTransactionHistory = async (userId: number) => {
    const transactions = await TransactionHistory.findAll({
        where: { user_id: userId },
    });

    return transactions;
};