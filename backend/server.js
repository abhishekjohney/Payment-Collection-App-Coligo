const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');
const customerRoutes = require('./routes/customers');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/customers', customerRoutes);
app.use('/payments', paymentRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Payment Collection API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      customers: '/customers',
      payments: '/payments'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = () => {
  try {
    // Test database connection
    const dbConnected = testConnection();
    
    if (!dbConnected) {
      console.error('⚠️  Starting server without database connection');
      console.error('Please set up the database using: npm run setup');
    }

    app.listen(PORT, '0.0.0.0', () => {
      // Get local IP address
      const os = require('os');
      const networkInterfaces = os.networkInterfaces();
      let localIP = 'localhost';
      
      for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];
        for (const addr of addresses) {
          if (addr.family === 'IPv4' && !addr.internal) {
            localIP = addr.address;
            break;
          }
        }
        if (localIP !== 'localhost') break;
      }

      console.log('');
      console.log('═══════════════════════════════════════════════════');
      console.log('  Payment Collection API Server');
      console.log('═══════════════════════════════════════════════════');
      console.log(`  🚀 Server running on: http://0.0.0.0:${PORT}`);
      console.log(`  📱 Mobile access: http://${localIP}:${PORT}`);
      console.log(`  📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  💾 Database: ${dbConnected ? 'Connected ✅ (SQLite)' : 'Not Connected ❌'}`);
      console.log('═══════════════════════════════════════════════════');
      console.log('');
      console.log('API Endpoints:');
      console.log(`  GET  http://${localIP}:${PORT}/customers`);
      console.log(`  GET  http://${localIP}:${PORT}/customers/:id`);
      console.log(`  GET  http://${localIP}:${PORT}/customers/account/:accountNumber`);
      console.log(`  POST http://${localIP}:${PORT}/payments`);
      console.log(`  GET  http://${localIP}:${PORT}/payments/:accountNumber`);
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
