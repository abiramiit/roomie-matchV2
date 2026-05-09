const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 1000 },
  rent: { type: Number, required: true },
  deposit: { type: Number, default: 0 },
  location: {
    address: String,
    city: { type: String, required: true },
    state: String,
    pincode: String,
  },
  roomType: { type: String, enum: ['single', 'shared', 'entire-flat'], default: 'single' },
  furnishing: { type: String, enum: ['furnished', 'semi-furnished', 'unfurnished'], default: 'unfurnished' },
  amenities: [{ type: String }],
  photos: [String],
  availableFrom: Date,
  genderPreference: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

listingSchema.index({ 'location.city': 1, rent: 1 });

module.exports = mongoose.model('RoomListing', listingSchema);
