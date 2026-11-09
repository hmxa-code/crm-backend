import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';

import authRoutes from './src/main-modules/auth/auth.routes.js';
import rolesRoutes from './src/main-modules/users/roles.routes.js';
import usersRoutes from './src/main-modules/users/users.routes.js';

// marketing module import (includes LeadsRouter)
import { 
  CampaignsRouter, 
  DripCampaignsRouter, 
  LeadScoringRouter, 
  SocialIntegrationRouter, 
  SocialPostsRouter,
  WorkflowsRouter,
  LeadsRouter
} from './src/bdtsystem/marketing/index.js';

// RenGrowCure module imports
import {
  VentureMatrixRouter,
  LeadIntelRouter,
  DistroEngineRouter,
  OutreachSequencesRouter,
  ChronosRouter,
  KineticsRouter
} from './src/bdtsystem/rengrowcure/index.js';

// Task Module Import ----------
import TasksRouter from './src/bdtsystem/tasks/index.js';

const app = express();

// --- Global Middlewares ---
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-auth-token']
}));

app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));

// --- Base Root & Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CRM Backend API is running successfully!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy and running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// --- Database Connection Middleware (for Serverless / Vercel & Local) ---
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('[Database Middleware Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please ensure MONGODB_URI is configured and MongoDB Atlas allows access from 0.0.0.0/0.',
      error: error.message
    });
  }
});

// --- API Route Registrations ---
// Auth routes (public & protected)
app.use('/api/auth', authRoutes);

// Roles management
app.use('/api/roles', rolesRoutes);

// Users management
app.use('/api/users', usersRoutes);

// Leads route (served by marketing module's leads router)
app.use('/api/leads', LeadsRouter);
app.use('/api/contacts', LeadsRouter);

// Marketing feature endpoints --------
app.use('/api/marketing/campaigns', CampaignsRouter);
app.use('/api/marketing/drip-campaigns', DripCampaignsRouter);
app.use('/api/marketing/lead-scoring', LeadScoringRouter);
app.use('/api/marketing/social-integration', SocialIntegrationRouter);
app.use('/api/marketing/social-posts', SocialPostsRouter);
app.use('/api/marketing/workflows', WorkflowsRouter);
// marketing endpoints end here --------

// RenGrowCure feature endpoints ---------
app.use('/api/rengrowcure/venture-matrix', VentureMatrixRouter);
app.use('/api/rengrowcure/lead-intel', LeadIntelRouter);
app.use('/api/rengrowcure/distro-engine', DistroEngineRouter);
app.use('/api/rengrowcure/outreach-sequences', OutreachSequencesRouter);
app.use('/api/rengrowcure/chronos', ChronosRouter);
app.use('/api/rengrowcure/kinetics', KineticsRouter);
// RenGrowCure endpoints end here ---------

// Tasks ----------- (Feature endpoints)
app.use('/api/tasks', TasksRouter);

// --- 404 Handler for Unmatched Routes ---
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// --- Global Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
