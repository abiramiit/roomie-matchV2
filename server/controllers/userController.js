const User = require('../models/User');
const Profile = require('../models/Profile');
const { cloudinary, upload } = require('../utils/cloudinary');

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
    if (profile.age && profile.gender && profile.location?.city && profile.budget?.max) {
      await User.findByIdAndUpdate(req.user._id, { isProfileComplete: true });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path }, { new: true }).select('-password');
    res.json({ avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadPhotos = async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });
    const urls = req.files.map(f => f.path);
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { photos: { $each: urls } } },
      { new: true }
    );
    res.json({ photos: profile.photos });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { city, gender, minBudget, maxBudget, smoking, pets, page = 1, limit = 12 } = req.query;
    const profileFilter = {};
    if (city) profileFilter['location.city'] = new RegExp(city, 'i');
    if (gender) profileFilter.gender = gender;
    if (minBudget || maxBudget) {
      profileFilter['budget.min'] = { $lte: Number(maxBudget) || 999999 };
      profileFilter['budget.max'] = { $gte: Number(minBudget) || 0 };
    }
    if (smoking) profileFilter['lifestyle.smoking'] = smoking;
    if (pets) profileFilter['lifestyle.pets'] = pets;

    const profiles = await Profile.find(profileFilter)
      .populate('user', 'name avatar lastSeen isProfileComplete')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const filtered = profiles.filter(p => p.user && p.user._id.toString() !== req.user._id.toString() && !req.user.isBlocked);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate('user', 'name avatar lastSeen');
    if (!profile) return res.status(404).json({ message: 'User not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const targetId = req.params.id;
    const isSaved = user.savedProfiles.includes(targetId);
    if (isSaved) {
      user.savedProfiles.pull(targetId);
    } else {
      user.savedProfiles.push(targetId);
    }
    await user.save();
    res.json({ saved: !isSaved, savedProfiles: user.savedProfiles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSavedProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProfiles', 'name avatar');
    const profiles = await Profile.find({ user: { $in: user.savedProfiles } }).populate('user', 'name avatar');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
