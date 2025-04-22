require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/students', studentRoutes);

// Health check endpoint (required for Render)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    
    // Critical Render-specific configuration
    const PORT = process.env.PORT || 5000;
    const HOST = '0.0.0.0'; // Required for Render
    
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      console.log('Ready for Render port detection');
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit if DB fails
  });

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
