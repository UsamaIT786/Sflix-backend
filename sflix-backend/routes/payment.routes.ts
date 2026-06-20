import express from 'express';
import { chargeCard } from '../controllers/payment.controller';

const router = express.Router();

// Charge endpoint
router.post('/charge', chargeCard);

export default router;
