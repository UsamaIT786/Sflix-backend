import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';

interface ChargeRequest {
  paymentToken: string;
  planId: string;
  planName: string;
  planPrice: string;
  userId?: string;
}

interface PaymentGatewayResponse {
  id: string;
  status: 'successful' | 'failed' | 'pending';
  amount: number;
  currency: string;
  card?: {
    last4: string;
    brand: string;
  };
}

interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  isVip?: boolean;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: Date;
}

const PAYMENT_GATEWAY_API_URL = process.env.SHIFT4_API_URL || 'https://api.shift4.com';
const PAYMENT_GATEWAY_SECRET_KEY = process.env.SHIFT4_SECRET_KEY || 'sk_test_P3bybJzybSV64cnMEMD6dpFj';
const SHIFT4_PUBLIC_KEY = process.env.SHIFT4_PUBLIC_KEY || 'pk_test_P3bybqxx4cUSZ8vnPmoCliSD';

export const chargeCard = async (req: Request, res: Response) => {
  try {
    const { paymentToken, planId, planName, planPrice, userId }: ChargeRequest = req.body;

    if (!paymentToken || !planId || !planName || !planPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment details'
      });
    }

    const amountInCents = Math.round(parseFloat(planPrice) * 100);
    const currency = 'USD';

    const paymentData = {
      amount: amountInCents,
      currency: currency,
      card: { id: paymentToken },
      description: `${planName} Subscription - ${planId}`,
      metadata: {
        planId,
        planName,
        userId: userId || 'guest'
      }
    };

    let gatewayResponse: PaymentGatewayResponse;

    try {
      const response = await axios.post(
        `${PAYMENT_GATEWAY_API_URL}/charges`,
        paymentData,
        {
          auth: { username: PAYMENT_GATEWAY_SECRET_KEY, password: '' },
          headers: { 'Content-Type': 'application/json' }
        }
      );
      gatewayResponse = response.data;
    } catch (gatewayError: any) {
      const errorMessage = gatewayError.response?.data?.error?.message || gatewayError.message || 'Payment processing failed';
      const errorCode = gatewayError.response?.data?.error?.code || 'payment_error';

      let userFriendlyMessage = 'Payment failed. Please try again.';
      switch (errorCode) {
        case 'card_declined': userFriendlyMessage = 'Your card was declined. Please check your card details or use a different card.'; break;
        case 'expired_card': userFriendlyMessage = 'Your card has expired. Please use a valid card.'; break;
        case 'insufficient_funds': userFriendlyMessage = 'Insufficient funds. Please check your account balance.'; break;
        case 'invalid_cvc': userFriendlyMessage = 'Invalid CVC. Please check your security code.'; break;
        case 'processing_error': userFriendlyMessage = 'A processing error occurred. Please try again later.'; break;
        default: userFriendlyMessage = errorMessage;
      }

      return res.status(402).json({ success: false, message: userFriendlyMessage, errorCode });
    }

    if (gatewayResponse.status !== 'successful') {
      return res.status(402).json({
        success: false,
        message: 'Payment was not successful. Please try again.',
        status: gatewayResponse.status
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully!',
      transaction: {
        id: gatewayResponse.id,
        amount: planPrice,
        currency,
        cardLast4: gatewayResponse.card?.last4 || '1111',
        cardBrand: gatewayResponse.card?.brand || 'Visa',
        planId,
        planName
      }
    });

  } catch (error: any) {
    console.error('[Payment Controller] Charge error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during payment processing' });
  }
};

// Function to create a signed Shift4 checkout request
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { planId, planName, planPrice } = req.body || {};
    const amountInCents = planPrice ? Math.round(parseFloat(planPrice) * 100) : 999;
    const finalPlanId = planId || 'vip-subscription';
    const finalPlanName = planName || 'Novaplay Stream VIP Access';

    // Create the checkout request object
    const checkoutRequestObj = {
      charge: {
        amount: amountInCents,
        currency: 'USD'
      }
    };

    // Convert to JSON string
    const checkoutRequestJson = JSON.stringify(checkoutRequestObj);
    
    // Create HMAC-SHA256 signature with the secret key
    const hmac = crypto.createHmac('sha256', PAYMENT_GATEWAY_SECRET_KEY || '');
    hmac.update(checkoutRequestJson);
    const signature = hmac.digest('hex');
    
    // Combine signature and JSON, then Base64 encode the entire string
    const signedCheckoutRequest = Buffer.from(`${signature}|${checkoutRequestJson}`).toString('base64');

    console.log('[Payment Controller] Created signed checkout request');

    res.status(200).json({
      success: true,
      signedCheckoutRequest,
      publicKey: SHIFT4_PUBLIC_KEY,
      planId: finalPlanId,
      planName: finalPlanName
    });

  } catch (error: any) {
    console.error('[Payment Controller] Create checkout session error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during checkout creation'
    });
  }
};
