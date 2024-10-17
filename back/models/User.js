const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  department: String,
  studentId: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAutoLogin: { type: Boolean, default: false }
});

// 비밀번호 해싱
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
