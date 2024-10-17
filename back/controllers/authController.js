const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 회원가입
exports.register = async (req, res) => {
  const { username, password, name, department, studentId } = req.body;
  try {
    const user = new User({ username, password, name, department, studentId });
    await user.save();
    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    res.status(500).json({ error: '회원가입 실패' });
  }
};

// 로그인
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: '사용자 없음' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: '비밀번호 불일치' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: '로그인 실패' });
  }
};
