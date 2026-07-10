const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Load environment variables
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from public folder (for images, CSS, frontend JS)
app.use(express.static(path.join(__dirname, '../public')));

// Admin UI Page Routes (Clean URLs)
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/login.html'));
});

app.get('/admin/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/register.html'));
});

app.get('/admin/products', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/products.html'));
});

app.get('/admin/orders', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/orders.html'));
});

app.get('/admin', (req, res) => {
  res.redirect('/admin/products');
});

// Root Client Shop Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 Route for APIs
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    data: null
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error: ' + err.message,
    data: null
  });
});

module.exports = app;
