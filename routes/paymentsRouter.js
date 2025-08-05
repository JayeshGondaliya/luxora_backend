import express from 'express';
import { createCheckoutSession, getpaymentsData } from '../controllers/payments.js';

const paymentsRouter = express.Router();

paymentsRouter.post('/create-checkout-session', createCheckoutSession);

paymentsRouter.get('/session/:id',getpaymentsData)
export default paymentsRouter;
