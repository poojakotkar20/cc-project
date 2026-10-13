const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const postRoutes = require('./routes/postRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

// CORS configuration for multi-cloud communication
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

if (FRONTEND_URL) {
  allowedOrigins.push(FRONTEND_URL);
  // Also support netlify app url without trailing slash
  allowedOrigins.push(FRONTEND_URL.replace(/\/$/, ''));
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, Postman, Render health checks)
      if (!origin) return callback(null, true);
      // In production or development, allow configured origins or any netlify.app subdomain
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.netlify.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root route - Cloud Architecture Info
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'CloudScribe - 3-Tier Cloud Architecture Blog Platform',
    status: 'Running',
    architecture: {
      tier1_presentation: 'Netlify (React / Vite)',
      tier2_application: 'Render (Node.js / Express REST API)',
      tier3_database: 'MongoDB Atlas (Managed Cloud Database)',
    },
    databaseStatus: getDBStatus(),
    endpoints: {
      health: 'GET /api/health',
      posts: 'GET /api/posts',
      createPost: 'POST /api/posts',
      getPost: 'GET /api/posts/:id',
      updatePost: 'PUT /api/posts/:id',
      deletePost: 'DELETE /api/posts/:id',
      seed: 'POST /api/posts/seed',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint for tier monitoring
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    cloudTiers: {
      backend: {
        platform: 'Render',
        tier: 'Application Tier (Tier 2)',
        status: 'Healthy',
      },
      database: {
        platform: 'MongoDB Atlas',
        tier: 'Database Tier (Tier 3)',
        status: dbStatus.status,
        connected: dbStatus.isConnected,
        host: dbStatus.host,
      },
    },
  });
});

// API Routes
app.use('/api/posts', postRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB and start HTTP server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 [Tier 2] Backend Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌐 Allowed Frontend: ${FRONTEND_URL || 'Localhost & *.netlify.app'}`);
    console.log(`=======================================================`);
  });
};

startServer();
