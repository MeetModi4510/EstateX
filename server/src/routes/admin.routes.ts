import express from 'express';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';
import {
  getDashboardStats,
  getProperties,
  getPropertyById,
  updatePropertyStatus,
  archiveProperty,
  reassignProperty,
  getBrokers,
  createBroker,
  updateBrokerStatus,
  updateBroker,
  getPropertyOwners,
  updateOwnerStatus,
  getLeads,
  reassignLead,
  getVisits,
  getDeals,
  getAnalytics,
  getActivityLogs
} from '../controllers/admin.controller';

const router = express.Router();

// Apply auth to all admin routes
router.use(authenticate);
router.use(authorizeRole('ADMIN'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Properties
router.get('/properties', getProperties);
router.get('/properties/:id', getPropertyById);
router.put('/properties/:id/status', updatePropertyStatus);
router.put('/properties/:id/archive', archiveProperty);
router.put('/properties/:id/reassign', reassignProperty);

// Brokers
router.get('/brokers', getBrokers);
router.post('/brokers', createBroker);
router.put('/brokers/:id', updateBroker);
router.put('/brokers/:id/status', updateBrokerStatus);

// Owners
router.get('/property-owners', getPropertyOwners);
router.put('/property-owners/:id/status', updateOwnerStatus);

// Leads
router.get('/leads', getLeads);
router.put('/leads/:id/reassign', reassignLead);

// Visits, Deals, Analytics, Logs
router.get('/visits', getVisits);
router.get('/deals', getDeals);
router.get('/analytics', getAnalytics);
router.get('/activity-logs', getActivityLogs);

export default router;
