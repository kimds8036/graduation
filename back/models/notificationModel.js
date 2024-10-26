// models/notificationModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderName: { type: String, required: true },  // 보낸 사람 또는 관련된 학과 이름
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // 받는 사람 (로그인된 사용자)
  message: { type: String, required: true },  // 알림 메시지
  read: { type: Boolean, default: false },  // 알림을 읽었는지 여부
  createdAt: { type: Date, default: Date.now },  // 알림 생성 시간
});

module.exports = mongoose.model('Notification', notificationSchema);
