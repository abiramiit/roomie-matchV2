const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  age: { type: Number, min: 18, max: 80 },
  gender: { type: String, enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'] },
  occupation: { type: String, enum: ['student', 'working', 'freelancer', 'other'] },
  bio: { type: String, maxlength: 500 },
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' },
  },
  budget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 50000 },
  },
  lifestyle: {
    smoking: { type: String, enum: ['yes', 'no', 'occasionally'], default: 'no' },
    drinking: { type: String, enum: ['yes', 'no', 'occasionally'], default: 'no' },
    pets: { type: String, enum: ['yes', 'no', 'allergic'], default: 'no' },
    sleepSchedule: { type: String, enum: ['early-bird', 'night-owl', 'flexible'], default: 'flexible' },
    cleanliness: { type: Number, min: 1, max: 5, default: 3 },
    workFromHome: { type: Boolean, default: false },
    cooking: { type: String, enum: ['always', 'sometimes', 'never'], default: 'sometimes' },
  },
  genderPreference: { type: String, enum: ['male', 'female', 'any'], default: 'any' },
  lookingFor: { type: String, enum: ['room', 'roommate', 'both'], default: 'both' },
  moveInDate: Date,
  photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
