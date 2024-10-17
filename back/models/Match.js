const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  userId1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchPercentage: { type: Number, required: true }, // 동선 일치 비율
  createdAt: { type: Date, default: Date.now }
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
