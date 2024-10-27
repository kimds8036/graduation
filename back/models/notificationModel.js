const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notificationType: { type: String, default: 'interest' },  // 알림 종류
  read: { type: Boolean, default: false },  // 읽음 여부
}, { timestamps: true });


module.exports = mongoose.model('Notification', notificationSchema);