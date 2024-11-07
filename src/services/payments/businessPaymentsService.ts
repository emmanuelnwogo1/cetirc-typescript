
import { Transaction } from '../../models/Transaction';

export const requestPayment = async (amount: number, businessId: number) => {
    try {
      const transaction = await Transaction.create({
        amount: amount,
        business_id: businessId,
        success: false
      } as Transaction);
  
      return {
        status: "success",
        message: "Transaction record created.",
        data: {
          transaction_id: transaction.id,
          amount: transaction.amount,
          success: transaction.success
        }
      };
    } catch (error: any) {
      return {
        status: "failed",
        message: error.message || "Failed to create payment request.",
        data: {}
      };
    }
};

export const linkPalm = async (user_id: string, card_id: string, palm_scan_data: string) => {
    try {
        return { linkId: 'link_12345', user_id, card_id };
    } catch (error: any) {
        throw new Error('Failed to link palm: ' + error.message);
    }
};

export const getTransactionHistory = async (user_id?: string, business_id?: string, date_range?: string) => {
    try {
        return [{ transactionId: 'txn_12345', user_id, business_id, amount: 100.0 }];
    } catch (error: any) {
        throw new Error('Failed to retrieve transaction history: ' + error.message);
    }
};
