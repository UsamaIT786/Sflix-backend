import express from 'express';
import { chargeCard, createCheckoutSession } from '../controllers/payment.controller';

const router = express.Router();

// Charge endpoint
router.post('/charge', chargeCard);

// Create checkout session endpoint
router.post('/create-checkout-session', createCheckoutSession);

export default router;
