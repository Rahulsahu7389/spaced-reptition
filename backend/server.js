require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');
const topicRoutes = require('./routes/topicRoutes');

const app = express();

if (!admin.apps.length) {
  let cert;
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    cert = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    cert = require('./serviceAccountKey.json');
  }
  admin.initializeApp({
    credential: admin.credential.cert(cert)
  });
}

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use('/api/topics', topicRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(e => console.error("DB Error:", e));

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server live on ${port}`);
});
