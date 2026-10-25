import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { seedDatabase } from './utils/seedData.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import scrutinyRoutes from './routes/scrutinyRoutes.js';
import evcRoutes from './routes/evcRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// System Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ACTIVE',
    project: 'AICTE Pravah - Smart Approval Workflow & Compliance Monitoring Engine',
    problemStatement: 'ID 26262',
    timestamp: new Date().toISOString(),
    apiEndpoints: [
      '/api/auth',
      '/api/applications',
      '/api/scrutiny',
      '/api/evc',
      '/api/compliance',
      '/api/admin',
    ],
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    uptimeSeconds: process.uptime(),
    serverTime: new Date().toISOString(),
  });
});

// Mount Modular API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/scrutiny', scrutinyRoutes);
app.use('/api/evc', evcRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Bootstrapping
const startServer = async () => {
  try {
    // Attempt DB connection & seed data
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`================================================================`);
      console.log(`🚀 [AICTE Pravah Backend Engine] LIVE ON PORT ${PORT}`);
      console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
      console.log(`🛡️  Problem Statement 26262 (AICTE Approval Workflow Automation)`);
      console.log(`================================================================`);
    });
  } catch (error) {
    console.error(`[AICTE Pravah Server Boot Error]: ${error.message}`);
    process.exit(1);
  }
};

startServer();
