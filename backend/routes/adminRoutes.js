const express = require('express');
const router = express.Router();
const { triggerSweep } = require('../controllers/adminController');

const verifyCronSecret = (req, res, next) => {
  const secret = req.headers['x-cron-secret'];
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

router.post('/trigger-sweep', verifyCronSecret, triggerSweep);

module.exports = router;
