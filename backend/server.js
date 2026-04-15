require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Make sure to download your service account key from Firebase and specify the correct path
try {
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin Initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  // Optional: process.exit(1) if Firebase is strictly required to start
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is running', message: 'Welcome to SRS Backend API' });
});

// Import Routes
const topicRoutes = require('./routes/topicRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount Routes
app.use('/api/topics', topicRoutes);
app.use('/api/admin', adminRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connection established successfully.');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
