const Topic = require('../models/Topic');
const CronLog = require('../models/CronLog');

const runDailySweep = async () => {
  try {
    const today = new Date();
    
    // Count topics due today (and are active)
    const topicsDueCount = await Topic.countDocuments({
      nextReview: { $lte: today },
      isActive: true
    });

    // Save log record
    const newLog = new CronLog({
      topicsDueFound: topicsDueCount,
      status: 'Success'
    });
    
    await newLog.save();

    return {
      success: true,
      topicsDue: topicsDueCount,
      message: `Sweep completed. Found ${topicsDueCount} topics due.`
    };
  } catch (error) {
    console.error('Error during daily sweep:', error);
    
    // Log the error
    try {
       const errorLog = new CronLog({
        topicsDueFound: 0,
        status: 'Error',
        errorMessage: error.message
      });
      await errorLog.save();
    } catch(e) {
      console.error('Failed to save error log', e);
    }

    throw error; // Rethrow to let the controller handle the HTTP response
  }
};

module.exports = {
  runDailySweep
};
