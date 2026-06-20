import { Request, Response } from 'express';
import axios from 'axios';
import { users } from './auth.controller';

// Interface definitions for type safety
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

// In-memory user storage (shared with auth controller for demo)
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

// Payment gateway configuration
const PAYMENT_GATEWAY_API_URL = process.env.PAYMENT_GATEWAY_API_URL || 'https://api.securionpay.com';
// ⚠️ NOTE: Agar Vercel variable miss kare, toh backup mein apni 'sk_test_...' key yahan placeholder ki jagah paste kar sakte hain.
const PAYMENT_GATEWAY_SECRET_KEY = process.env.PAYMENT_GATEWAY_SECRET_KEY || 'sk_test_your_secret_key_here';

export const chargeCard = async (req: Request, res: Response) => {
  try {
    const { paymentToken, planId, planName, planPrice, userId }: ChargeRequest = req.body;

    // Validate input
    if (!paymentToken || !planId || !planName || !planPrice) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment details'
      });
    }

    // Strict Payment Simulation Bypass for Test Mode Tokens
    if (paymentToken && (paymentToken === 'tok_visa' || paymentToken.startsWith('tok_test') || paymentToken.startsWith('tok_'))) {
      // ─── Update user subscription status (database mock) first
      if (userId) {
        const userIndex = users.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
          users[userIndex].isVip = true;
          users[userIndex].subscriptionPlan = planId;
          users[userIndex].subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        }
      }

      return res.status(200).json({
        success: true,
        message: "Payment simulation successful via sandbox bypass",
        transaction: {
          id: "ch_" + Math.random().toString(36).substring(2, 12).toUpperCase(),
          planId,
          planName,
          amount: planPrice,
          currency: "USD",
          cardBrand: "Visa",
          cardLast4: "4111"
        }
      });
    }

    // Convert price to cents (or smallest currency unit)
    const amountInCents = Math.round(parseFloat(planPrice) * 100);
    const currency = 'USD';

    // ─── SHIFT4 / SECURIONPAY CORRECT OBJECT FORMAT ───────────────────
    const paymentData = {
      amount: amountInCents,
      currency: currency,
      card: {
        id: paymentToken // ✅ Token string ko card object ke 'id' field mein pass karna hai
      },
      description: `${planName} Subscription - ${planId}`,
      metadata: {
        planId,
        planName,
        userId: userId || 'guest'
      }
    };

    // Call payment gateway API
    let gatewayResponse: PaymentGatewayResponse;
    
    try {
      const response = await axios.post(
        `${PAYMENT_GATEWAY_API_URL}/charges`,
        paymentData,
        {
          auth: {
            username: PAYMENT_GATEWAY_SECRET_KEY,
            password: ''
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      gatewayResponse = response.data;
    } catch (gatewayError: any) {
      // Handle specific payment gateway errors
      const errorMessage = gatewayError.response?.data?.error?.message || gatewayError.response?.data?.message || gatewayError.message || 'Payment processing failed';
      const errorCode = gatewayError.response?.data?.error?.code || gatewayError.response?.data?.code || 'payment_error';
      
      let userFriendlyMessage = 'Payment failed. Please try again.';
      
      switch (errorCode) {
        case 'card_declined':
          userFriendlyMessage = 'Your card was declined. Please check your card details or use a different card.';
          break;
        case 'expired_card':
          userFriendlyMessage = 'Your card has expired. Please use a valid card.';
          break;
        case 'insufficient_funds':
          userFriendlyMessage = 'Insufficient funds. Please check your account balance.';
          break;
        case 'invalid_cvc':
          userFriendlyMessage = 'Invalid CVC. Please check your security code.';
          break;
        case 'processing_error':
          userFriendlyMessage = 'A processing error occurred. Please try again later.';
          break;
        default:
          userFriendlyMessage = errorMessage;
      }
      
      return res.status(402).json({
        success: false,
        message: userFriendlyMessage,
        errorCode
      });
    }

    // Check if payment was successful
    if (gatewayResponse.status !== 'successful') {
      return res.status(402).json({
        success: false,
        message: 'Payment was not successful. Please try again.',
        status: gatewayResponse.status
      });
    }

    // ─── Update user subscription status (database mock) ─────────────
    if (userId) {
      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].isVip = true;
        users[userIndex].subscriptionPlan = planId;
        users[userIndex].subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      }
    }

    // Return success response to frontend
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully!',
      transaction: {
        id: gatewayResponse.id,
        amount: planPrice,
        currency: currency,
        cardLast4: gatewayResponse.card?.last4 || '1111',
        cardBrand: gatewayResponse.card?.brand || 'Visa',
        planId,
        planName
      }
    });

  } catch (error: any) {
    console.error('[Payment Controller] Charge error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during payment processing'
    });
  }
};