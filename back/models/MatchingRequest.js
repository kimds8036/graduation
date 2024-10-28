const mongoose = require('mongoose');

const matchingRequestSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    requestDate: { type: Date, default: Date.now },
    declineDate: { type: Date, default: null },
});

const MatchingRequest = mongoose.model('MatchingRequest', matchingRequestSchema);

module.exports = MatchingRequest;
