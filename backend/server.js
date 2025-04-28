const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const config = require('./config/config');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Debug logging
console.log('Starting server...');
console.log('Config:', config);

try {
  // Set environment variables from config
  Object.keys(config).forEach(key => {
    process.env[key] = config[key];
  });

  // Connect to database
  console.log('Connecting to database...');
  connectDB().then(() => {
    // Create Express app
    const app = express();

    // Security middleware
    app.use(helmet());
    app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
      credentials: true,
    }));

    // Body parsers
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }

    // Routes
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/products', require('./routes/productRoutes'));
    app.use('/api/orders', require('./routes/orderRoutes'));

    // API test route
    app.get('/api', (req, res) => {
      res.json({ message: 'API is running...' });
    });

    // Production setup for frontend
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../frontend/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
      });
    } else {
      app.get('/', (req, res) => {
        res.send('API is running...');
      });
    }

    // Error handling middleware
    app.use(notFound);
    app.use(errorHandler);

    // Start server
    const PORT = config.PORT;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  }).catch(error => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Server startup error:', error);
  process.exit(1);
} 