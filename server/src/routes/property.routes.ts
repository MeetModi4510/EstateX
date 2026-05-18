import { Router } from 'express';
import { 
  getProperties, getPropertyById, getOwnerProperties, createProperty, updateProperty, submitProperty, deleteProperty,
  getPendingProperties, approveProperty, rejectProperty, markFeatured, markVerified,
  recordPropertyView, getOwnerAnalytics
} from '../controllers/property.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/public', getProperties);
router.get('/public/:id', getPropertyById);
router.post('/public/:id/view', recordPropertyView);

// Property Owner routes
router.get('/owner', authenticate, authorizeRole('PROPERTY_OWNER'), getOwnerProperties);
router.get('/owner/analytics', authenticate, authorizeRole('PROPERTY_OWNER'), getOwnerAnalytics);
router.post('/owner', authenticate, authorizeRole('PROPERTY_OWNER'), createProperty);
router.put('/owner/:id', authenticate, authorizeRole('PROPERTY_OWNER'), updateProperty);
router.delete('/owner/:id', authenticate, authorizeRole('PROPERTY_OWNER'), deleteProperty);
router.post('/owner/:id/submit', authenticate, authorizeRole('PROPERTY_OWNER'), submitProperty);

// Broker routes
router.get('/broker/pending', authenticate, authorizeRole('BROKER'), getPendingProperties);
router.post('/broker/:id/approve', authenticate, authorizeRole('BROKER'), approveProperty);
router.post('/broker/:id/reject', authenticate, authorizeRole('BROKER'), rejectProperty);
router.put('/broker/:id/featured', authenticate, authorizeRole('BROKER'), markFeatured);
router.put('/broker/:id/verified', authenticate, authorizeRole('BROKER'), markVerified);

export default router;
