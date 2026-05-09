const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  initiator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  score: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'matched', 'rejected'], default: 'pending' },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

matchSchema.index({ users: 1 });

module.exports = mongoose.model('Match', matchSchema);
