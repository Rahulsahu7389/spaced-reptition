const mongoose = require('mongoose');

const cronLogSchema = new mongoose.Schema({
  dateExecuted: {
    type: Date,
    default: Date.now,
  },
  topicsDueFound: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Success', 'Error'],
    required: true,
  },
  errorMessage: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('CronLog', cronLogSchema);
