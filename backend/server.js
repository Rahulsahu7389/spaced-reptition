require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');

try {
  const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin Initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
}

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ status: 'Server is running', message: 'Welcome to SRS Backend API' });
});

const topicRoutes = require('./routes/topicRoutes');

app.use('/api/topics', topicRoutes);

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
