const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tracking 스키마
const trackingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  routes: [{
    _id: false, // 서브 문서에서 자동으로 _id를 생성하지 않도록 설정
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      timestamp: { type: Date, required: true }
    },
    day: { type: String, required: true }
  }],
  startDate: { type: Date, required: true },
  endDate: { type: Date }
});

// Tracking 모델 생성
const Tracking = mongoose.model('Tracking', trackingSchema);
module.exports = Tracking;
