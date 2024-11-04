const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String },
  department: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },  // 학번 고유 필드
  username: { type: String, required: true}, 
  password: { type: String, required: true },
  mbti: { type: String },  // MBTI 필드 추가
  profileImageUrl: { type: String },  // 프로필 이미지 URL 필드 추가
  isAutoLogin: { type: Boolean, default: false },  // 자동 로그인 여부
  categories: [{ type: String }], // 선택된 카테고리를 배열로 추가

  
});

// 비밀번호 해싱 미들웨어
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // 비밀번호가 수정되지 않은 경우

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
