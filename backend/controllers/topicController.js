const Topic = require('../models/Topic');

// @desc    Create a new topic
// @route   POST /api/topics
// @access  Private
const addTopic = async (req, res) => {
  try {
    const { title, notesLink } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + 1);

    const newTopic = new Topic({
      userId: req.user.uid,
      title,
      notesLink,
      interval: 1,
      nextReview,
    });

    const savedTopic = await newTopic.save();
    res.status(201).json(savedTopic);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all due topics for the user (only active ones)
// @route   GET /api/topics/due
// @access  Private
const getDueTopics = async (req, res) => {
  try {
    const dueTopics = await Topic.find({
      userId: req.user.uid,
      nextReview: { $lte: new Date() },
      isActive: true,   // Only fetch active topics
    }).sort({ nextReview: 1 });

    res.status(200).json(dueTopics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get ALL topics for the user (for Topic Manager)
// @route   GET /api/topics
// @access  Private
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Review a topic (SRS Engine)
// @route   PUT /api/topics/:id/review
// @access  Private
const reviewTopic = async (req, res) => {
  try {
    const { isSuccess } = req.body;
    const topicId = req.params.id;

    if (typeof isSuccess !== 'boolean') {
      return res.status(400).json({ message: 'isSuccess must be a boolean value' });
    }

    const topic = await Topic.findOne({ _id: topicId, userId: req.user.uid });
    if (!topic) return res.status(404).json({ message: 'Topic not found or unauthorized' });

    const now = new Date();
    topic.interval = isSuccess ? topic.interval * 2 : 1;

    const newNextReview = new Date(now);
    newNextReview.setDate(newNextReview.getDate() + topic.interval);
    topic.nextReview = newNextReview;

    const updatedTopic = await topic.save();
    res.status(200).json(updatedTopic);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Toggle a topic's active status (archive/unarchive)
// @route   PUT /api/topics/:id/toggle-status
// @access  Private
const toggleTopicStatus = async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!topic) return res.status(404).json({ message: 'Topic not found or unauthorized' });

    topic.isActive = !topic.isActive;
    const updatedTopic = await topic.save();
    res.status(200).json(updatedTopic);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  addTopic,
  getDueTopics,
  getAllTopics,
  reviewTopic,
  toggleTopicStatus,
};
