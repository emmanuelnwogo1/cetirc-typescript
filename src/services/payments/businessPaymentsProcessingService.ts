import { Transaction } from '../../models/Transaction';
import { TransactionHistory } from '../../models/TransactionHistory';
import Stripe from 'stripe';
import { BusinessProfile } from '../../models/BusinessProfile';

const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: '2024-10-28.acacia' });

export const processPayment = async (user_id: number, stripePaymentMethodId: string, amount: number, transaction_id: number ) => {

    try {

        const businessProfile = await BusinessProfile.findOne({
            where: {
                user_id: user_id
            }
        });

        if (!businessProfile) {
            return ({
                status: 'failed',
                message: 'Payments are only for business users.',
                data: null
            });
        }


        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            payment_method: stripePaymentMethodId,
            confirmation_method: 'manual',
            confirm: true,
            description: `Transaction for user ${user_id}`,
        });

        await Transaction.update(
            {
                success: true,
                transaction_date: new Date(),
            },
            {
                where: { id: transaction_id },
            }
        );

        await TransactionHistory.create({
            transaction_id: transaction_id,
            user_id,
        } as TransactionHistory);

        return ({
            status: 'success',
            message: 'Payment processed successfully',
            data: {
                transactionId: paymentIntent.id,
                transaction_id,
                user_id,
                amount
            }
        });

    } catch (error: any) {

        await Transaction.update(
            {
                success: false,
                transaction_date: new Date(),
            },
            {
                where: { id: transaction_id },
            }
        );

        await TransactionHistory.create({
            transaction_id,
            user_id,
        } as TransactionHistory);

        return ({
            status: 'failed',
            message: 'Failed to process payment: ' + error.message,
            data: null
        });
    }
};
