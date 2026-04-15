const { runDailySweep } = require('../services/automationService');

const triggerSweep = async (req, res) => {
  try {
    const result = await runDailySweep();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sweep failed', error: error.message });
  }
};

module.exports = {
  triggerSweep
};
