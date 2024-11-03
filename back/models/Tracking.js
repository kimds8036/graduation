const mongoose = require('mongoose');

// 스키마 객체 초기화
const trackingSchemaFields = {
  userId: { type: String, required: true }, // 사용자 ID
  day: { type: String, required: true }     // 요일
};

// `Time_00`부터 `Time_287`까지 필드를 동적으로 추가
for (let i = 0; i <= 287; i++) {
  const timeKey = `Time_${String(i).padStart(2, '0')}`;
  trackingSchemaFields[timeKey] = { type: String };
}

// 스키마 정의
const trackingSchema = new mongoose.Schema(trackingSchemaFields);

// Tracking 모델 정의
const Tracking = mongoose.model('Tracking', trackingSchema);

module.exports = Tracking;
