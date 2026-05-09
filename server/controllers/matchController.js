const Match = require('../models/Match');
const Profile = require('../models/Profile');
const Notification = require('../models/Notification');
const calculateMatchScore = require('../utils/matchScore');

exports.getMatches = async (req, res) => {
  try {
    const myProfile = await Profile.findOne({ user: req.user._id });
    if (!myProfile) return res.status(404).json({ message: 'Complete your profile first' });

    const allProfiles = await Profile.find({ user: { $ne: req.user._id } })
      .populate('user', 'name avatar lastSeen');

    const existingMatches = await Match.find({ users: req.user._id });
    const interactedIds = new Set(
      existingMatches.flatMap(m => m.users.map(u => u.toString()))
        .filter(id => id !== req.user._id.toString())
    );

    const scored = allProfiles
      .filter(p => p.user && !interactedIds.has(p.user._id.toString()))
      .map(profile => ({
        profile,
        score: calculateMatchScore(myProfile, profile),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.json(scored);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likeUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const myId = req.user._id;

    let match = await Match.findOne({ users: { $all: [myId, targetId] } });

    if (!match) {
      const myProfile = await Profile.findOne({ user: myId });
      const theirProfile = await Profile.findOne({ user: targetId });
      const score = calculateMatchScore(myProfile, theirProfile);
      match = await Match.create({ users: [myId, targetId], initiator: myId, score, likedBy: [myId] });
    } else {
      if (!match.likedBy.includes(myId)) match.likedBy.push(myId);
      if (match.likedBy.length === 2) {
        match.status = 'matched';
        await Notification.create({ user: targetId, type: 'match', message: `You matched with ${req.user.name}!`, link: `/chat/${myId}` });
        await Notification.create({ user: myId, type: 'match', message: `You matched with someone!`, link: `/chat/${targetId}` });
      }
      await match.save();
    }

    res.json({ match, isMatch: match.status === 'matched' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.dislikeUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const myId = req.user._id;
    let match = await Match.findOne({ users: { $all: [myId, targetId] } });
    if (!match) {
      match = await Match.create({ users: [myId, targetId], initiator: myId, status: 'rejected', dislikedBy: [myId] });
    } else {
      match.dislikedBy.push(myId);
      match.status = 'rejected';
      await match.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({ users: req.user._id, status: 'matched' })
      .populate({ path: 'users', select: 'name avatar lastSeen' });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(20);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
