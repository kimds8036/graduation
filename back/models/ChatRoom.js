// models/ChatRoom.js
const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  user1: { type: String, required: true }, // 첫 번째 사용자 ID
  user2: { type: String, required: true }, // 두 번째 사용자 ID
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
