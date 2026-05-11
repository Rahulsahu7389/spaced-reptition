const Topic = require('../models/Topic');
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

const getDueTopics = async (req, res) => {
  try {
    const eod = new Date();
    eod.setHours(23, 59, 59, 999);
    const dueTopics = await Topic.find({
      userId: req.user.uid,
      nextReview: { $lte: eod },
      isActive: true,
    }).sort({ nextReview: 1 });
    res.status(200).json(dueTopics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

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

const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!topic) return res.status(404).json({ message: 'Topic not found or unauthorized' });
    res.status(200).json({ message: 'Topic deleted successfully' });
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
  deleteTopic,
};
