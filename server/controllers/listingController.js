const RoomListing = require('../models/RoomListing');

exports.createListing = async (req, res) => {
  try {
    const photos = req.files ? req.files.map(f => f.path) : [];
    const listing = await RoomListing.create({ ...req.body, owner: req.user._id, photos });
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListings = async (req, res) => {
  try {
    const { city, minRent, maxRent, roomType, furnishing, gender, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (roomType) filter.roomType = roomType;
    if (furnishing) filter.furnishing = furnishing;
    if (gender) filter.genderPreference = { $in: [gender, 'any'] };
    if (minRent || maxRent) filter.rent = { $gte: Number(minRent) || 0, $lte: Number(maxRent) || 999999 };

    const listings = await RoomListing.find(filter)
      .populate('owner', 'name avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await RoomListing.countDocuments(filter);
    res.json({ listings, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await RoomListing.findById(req.params.id).populate('owner', 'name avatar lastSeen');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await RoomListing.findOne({ _id: req.params.id, owner: req.user._id });
    if (!listing) return res.status(404).json({ message: 'Not found or unauthorized' });
    Object.assign(listing, req.body);
    await listing.save();
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await RoomListing.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!listing) return res.status(404).json({ message: 'Not found or unauthorized' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyListings = async (req, res) => {
  try {
    const listings = await RoomListing.find({ owner: req.user._id }).sort('-createdAt');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
