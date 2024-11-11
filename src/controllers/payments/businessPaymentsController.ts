
import { Request, Response } from 'express';
import { requestPayment, linkPalm } from '../../services/payments/businessPaymentsService';
import { processPayment } from '../../services/payments/businessPaymentsProcessingService';

export const requestPaymentController = async (req: Request, res: Response): Promise<any> => {
    const { amount, business_id } = req.body;
  
    if (!amount || !business_id) {
      return res.status(400).json({
        status: "failed",
        message: "Missing required parameters (amount or business_id).",
        data: {}
      });
    }
  
    try {
      const result: any = await requestPayment(amount, business_id);
  
      if (result.success) {
        return res.status(200).json({
          status: "success",
          message: "Transaction record created.",
          data: {
            transaction_id: result.transaction_id,
            amount: result.amount,
            status: result.status
          }
        });
      }

      return res.status(500).json({
        status: "failed",
        message: result.error || "Failed to create payment request.",
        data: {}
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "failed",
        message: error.message || "Server error while processing the request.",
        data: {}
      });
    }
};

export const processPaymentController = async (req: Request, res: Response): Promise<any> => {
    try {
      const { user_id, amount, transaction_id } = req.body;
  
      if (!user_id || !amount) {
        return res.status(400).json({
          status: "failed",
          message: "User ID, payment method, and amount are required.",
          data: {}
        });
      }
  
      const data = await processPayment(user_id, amount, transaction_id);
      if(data.status === 'success'){
        return res.status(200).json(data);
      }

      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({
        status: "failed",
        message: error.message || "Error processing the payment.",
        data: {}
      });
    }
};

export const linkPalmController = async (req: Request, res: Response): Promise<any> => {
    try {
      const { user_id, card_id, palm_scan_data } = req.body;
  
      if (!user_id || !card_id || !palm_scan_data) {
        return res.status(400).json({
          status: "failed",
          message: "User ID, card ID, and palm scan data are required.",
          data: {}
        });
      }
  
      const data = await linkPalm(user_id, card_id, palm_scan_data);
      return res.status(200).json({
        status: "success",
        message: "Palm linked successfully.",
        data
      });
    } catch (error: any) {
      return res.status(500).json({
        status: "failed",
        message: error.message || "Error linking palm scan.",
        data: {}
      });
    }
};
