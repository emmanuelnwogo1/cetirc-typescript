import { Transaction } from '../../models/Transaction';
import { TransactionHistory } from '../../models/TransactionHistory';
import Stripe from 'stripe';
import { UserProfile } from '../../models/UserProfile';
import { User } from '../../models/User';
import { Card } from '../../models/Card';

const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: '2024-10-28.acacia' });

export const processPayment = async (user_id: number, amount: number, transaction_id: number) => {
    try {
        const user: any = await User.findOne({
            where: { id: user_id }
        });

        if (!user) {
            return {
                status: 'failed',
                message: 'User does not exist.',
                data: null
            };
        }

        const userProfile = await UserProfile.findOne({
            where: { username_id: user_id }
        });

        if (!userProfile) {
            return {
                status: 'failed',
                message: 'User profile does not exist.',
                data: null
            };
        }

        const card = await Card.findOne({
            where: { user_profile_id: userProfile.id, is_default: true },
        });

        if (!card) {
            return {
                status: 'failed',
                message: 'No default card found for the user.',
                data: null
            };
        }

        const paymentMethodId = card.stripe_payment_method_id;

        if (!paymentMethodId) {
            return {
                status: 'failed',
                message: 'No payment method found for the user.',
                data: null
            };
        }

        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        if (!paymentMethod) {
            return {
                status: 'failed',
                message: 'Payment method not found.',
                data: null
            };
        }

        let customer;
        const stripeCustomerId = userProfile.stripe_customer_id;

        if (stripeCustomerId) {
            customer = await stripe.customers.retrieve(stripeCustomerId);
        }

        if (!customer) {
            customer = await stripe.customers.create({
                email: user.email,
                name: `${user.first_name} ${user.lastname}`,
                description: 'Customer for POS transaction',
            });

            await UserProfile.update({ stripe_customer_id: customer.id }, { where: { id: userProfile.id } });
        }

        const attachedPaymentMethods = await stripe.customers.listPaymentMethods(customer.id, {
            type: 'card',
        });

        const isPaymentMethodAttached = attachedPaymentMethods.data.some(pm => pm.id === paymentMethod.id);

        if (!isPaymentMethodAttached) {
            if (paymentMethod.customer && paymentMethod.customer !== customer.id) {
                await stripe.paymentMethods.detach(paymentMethod.id);
            }

            await stripe.paymentMethods.attach(paymentMethod.id, {
                customer: customer.id,
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            confirm: true,
            description: `Transaction for user ${user.first_name} ${user.lastname}`,
            payment_method: paymentMethod.id,
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
            payment_method_options: {
                card: {
                    request_three_d_secure: 'automatic',
                },
            },
            return_url: process.env.APP_URL
        });

        await Transaction.update(
            {
                success: true,
                transaction_date: new Date()
            },
            {
                where: { id: transaction_id }
            }
        );

        await TransactionHistory.create({
            transaction_id,
            user_id
        } as TransactionHistory);

        return {
            status: 'success',
            message: 'Payment processed successfully',
            data: {
                transactionId: paymentIntent.id,
                transaction_id,
                user_id,
                amount
            }
        };

    } catch (error: any) {
        await Transaction.update(
            {
                success: false,
                transaction_date: new Date()
            },
            {
                where: { id: transaction_id }
            }
        );

        await TransactionHistory.create({
            transaction_id,
            user_id
        } as TransactionHistory);

        return {
            status: 'failed',
            message: 'Failed to process payment: ' + error.message,
            data: null
        };
    }
};
