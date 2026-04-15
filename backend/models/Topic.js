const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  notesLink: {
    type: String,
    trim: true,
  },
  interval: {
    type: Number,
    default: 1, // Represents days
  },
  nextReview: {
    type: Date,
    default: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
