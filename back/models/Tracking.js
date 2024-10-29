const mongoose = require('mongoose');

// 스키마 정의
const trackingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // 사용자 ID
  day: { type: String, required: true },    // 요일
  time_data: { type: [String], required: true } // 경로 데이터, 배열로 변경할 수 있음
});

// Tracking 모델 정의
const Tracking = mongoose.model('Tracking', trackingSchema);

module.exports = Tracking;
