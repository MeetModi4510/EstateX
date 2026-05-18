import { Router } from 'express';
import { createDeal, getBrokerDeals, updateDealStatus } from '../controllers/deal.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Broker routes
router.get('/broker', authenticate, authorizeRole('BROKER'), getBrokerDeals);
router.post('/broker', authenticate, authorizeRole('BROKER'), createDeal);
router.put('/broker/:id', authenticate, authorizeRole('BROKER'), updateDealStatus);

export default router;
