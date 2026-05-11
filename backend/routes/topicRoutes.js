const express = require('express');
const router = express.Router();
const {
  addTopic,
  getDueTopics,
  getAllTopics,
  reviewTopic,
  toggleTopicStatus,
  deleteTopic,
} = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/topics
router.post('/', protect, addTopic);

// @route   GET /api/topics/due   (must be before /:id routes)
router.get('/due', protect, getDueTopics);

// @route   GET /api/topics  (all topics, for Topic Manager)
router.get('/', protect, getAllTopics);

// @route   PUT /api/topics/:id/review
router.put('/:id/review', protect, reviewTopic);

// @route   PUT /api/topics/:id/toggle-status
router.put('/:id/toggle-status', protect, toggleTopicStatus);

// @route   DELETE /api/topics/:id
router.delete('/:id', protect, deleteTopic);

module.exports = router;
