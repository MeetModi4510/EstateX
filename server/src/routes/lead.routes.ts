import { Router } from 'express';
import { 
  createLead, getBrokerLeads, updateLeadStatus, getBrokerLeadById, 
  markLeadContacted, addLeadNote, getLeadNotes 
} from '../controllers/lead.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Public: Submit inquiry
router.post('/public', createLead);

// Broker routes
router.get('/broker', authenticate, authorizeRole('BROKER'), getBrokerLeads);
router.get('/broker/:id', authenticate, authorizeRole('BROKER'), getBrokerLeadById);
router.put('/broker/:id', authenticate, authorizeRole('BROKER'), updateLeadStatus);
router.post('/broker/:id/contact', authenticate, authorizeRole('BROKER'), markLeadContacted);

// Broker Notes
router.get('/broker/:id/notes', authenticate, authorizeRole('BROKER'), getLeadNotes);
router.post('/broker/:id/notes', authenticate, authorizeRole('BROKER'), addLeadNote);

export default router;
