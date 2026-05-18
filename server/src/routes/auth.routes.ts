import { Router } from 'express';
import { register, login, brokerLogin, getMe, updateProfile, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/broker-login', brokerLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Authenticated routes
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);

export default router;
