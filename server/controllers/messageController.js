const Message = require('../models/Message');
const User = require('../models/User');

const getConversationId = (id1, id2) => [id1, id2].sort().join('_');

exports.getConversations = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).sort('-createdAt');

    const seen = new Set();
    const conversations = [];

    for (const msg of messages) {
      const otherId = msg.sender.toString() === myId ? msg.receiver.toString() : msg.sender.toString();
      if (!seen.has(otherId)) {
        seen.add(otherId);
        const other = await User.findById(otherId).select('name avatar lastSeen');
        const unread = await Message.countDocuments({ conversation: msg.conversation, receiver: req.user._id, read: false });
        conversations.push({ user: other, lastMessage: msg, unread });
      }
    }

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const conversationId = getConversationId(req.user._id.toString(), req.params.userId);
    const messages = await Message.find({ conversation: conversationId })
      .sort('createdAt')
      .populate('sender', 'name avatar');
    await Message.updateMany({ conversation: conversationId, receiver: req.user._id, read: false }, { read: true });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const receiverId = req.params.userId;
    const conversationId = getConversationId(req.user._id.toString(), receiverId);
    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      receiver: receiverId,
      content,
    });
    await message.populate('sender', 'name avatar');
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
