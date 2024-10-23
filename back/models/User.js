const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  department: String,
  studentId: { type: String, required: true, unique: true },  // 학번 고유 필드
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mbti: { type: String },  // MBTI 필드 추가
  profileImageUrl: { type: String },  // 프로필 이미지 URL 필드 추가
  isAutoLogin: { type: Boolean, default: false }  // 자동 로그인 여부
});

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
