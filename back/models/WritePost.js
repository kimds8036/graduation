const mongoose = require('mongoose');

// 게시글 스키마 정의
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  gender: String,
  startTime: String,
  endTime: String,
  numberOfPeople: { type: Number, required: true }, // 필수값 설정
  currentParticipants: { type: Number, default: 0 }, // 기본값 설정
  recommendations: { type: Number, default: 0 },
}, { timestamps: true }); // 자동 생성 시간 포함

module.exports = mongoose.model('WritePost', postSchema);
