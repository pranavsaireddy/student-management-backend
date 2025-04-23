require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Enhanced CORS Configuration
const corsOptions = {
  origin: [
    "https://candid-gnome-f44a3a.netlify.app", // Removed /students from origin
    "http://localhost:3000" // For local development
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// Apply CORS middleware with options
app.use(cors(corsOptions)); // Remove the duplicate cors() call

// Middleware
app.use(express.json());

// Routes
app.use('/students', studentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
    
    const PORT = process.env.PORT || 5000;
    const HOST = '0.0.0.0';
    
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
