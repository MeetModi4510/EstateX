import { Router } from 'express';
import { createVisitRequest, getBrokerVisits, updateVisitStatus } from '../controllers/visit.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Public / Authenticated lead action (depending on architecture, usually leads can request visits via lead ID or publicly on property)
// We already have a route in lead.routes.ts maybe? No, we will put it here for now.
router.post('/', createVisitRequest);

// Broker routes
router.get('/broker', authenticate, authorizeRole('BROKER'), getBrokerVisits);
router.put('/broker/:id', authenticate, authorizeRole('BROKER'), updateVisitStatus);

export default router;
