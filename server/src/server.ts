import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import multer from 'multer';
import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import propertyRoutes from './routes/property.routes';
import imageRoutes from './routes/image.routes';
import leadRoutes from './routes/lead.routes';
import visitRoutes from './routes/visit.routes';
import dealRoutes from './routes/deal.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';

const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, // Limit each IP to 10 auth requests per window
  message: { message: 'Too many authentication attempts, please try again after 15 minutes' }
});

app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/properties', imageRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Multer error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err.message && err.message.includes('Only JPG, PNG and WEBP')) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// Add default error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.stack || err.message); // Log error for server
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({ 
    message: isProduction ? 'Something went wrong. Please try again later.' : err.message,
    ...(isProduction ? {} : { stack: err.stack }) 
  });
});

const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`EstateX Backend Server is running on port ${PORT}`);
  });
};

startServer();
