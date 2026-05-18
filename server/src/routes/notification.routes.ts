import { Router } from 'express';
import { getUserNotifications, markNotificationRead, deleteNotification } from '../controllers/notification.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';

const router = Router();

// Broker routes
router.get('/broker', authenticate, authorizeRole('BROKER'), getUserNotifications);
router.put('/broker/:id/read', authenticate, authorizeRole('BROKER'), markNotificationRead);
router.delete('/broker/:id', authenticate, authorizeRole('BROKER'), deleteNotification);

// Owner routes
router.get('/owner', authenticate, authorizeRole('PROPERTY_OWNER'), getUserNotifications);
router.put('/owner/:id/read', authenticate, authorizeRole('PROPERTY_OWNER'), markNotificationRead);
router.delete('/owner/:id', authenticate, authorizeRole('PROPERTY_OWNER'), deleteNotification);

export default router;
