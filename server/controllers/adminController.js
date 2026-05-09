const User = require('../models/User');
const Profile = require('../models/Profile');
const RoomListing = require('../models/RoomListing');
const Match = require('../models/Match');

exports.getDashboard = async (req, res) => {
  try {
    const [users, listings, matches] = await Promise.all([
      User.countDocuments(),
      RoomListing.countDocuments(),
      Match.countDocuments({ status: 'matched' }),
    ]);
    res.json({ users, listings, matches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = search ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] } : {};
    const users = await User.find(filter).select('-password').skip((page - 1) * limit).limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, [{ $set: { isBlocked: { $not: '$isBlocked' } } }], { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Profile.findOneAndDelete({ user: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllListings = async (req, res) => {
  try {
    const listings = await RoomListing.find().populate('owner', 'name email').sort('-createdAt');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleListing = async (req, res) => {
  try {
    const listing = await RoomListing.findById(req.params.id);
    listing.isActive = !listing.isActive;
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
