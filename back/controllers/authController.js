const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require('redis');
const { processStudentCardOCR } = require('../services/ocrService');

// Redis 클라이언트 생성
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.connect();

// 로그인
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });

    // JWT 토큰 생성
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Redis에 세션 저장 (자동 로그인용)
    await redisClient.set(`session:${user._id}`, token);
    await redisClient.expire(`session:${user._id}`, 86400);  // 1일 후 만료

    res.status(200).json({ token, message: '로그인 성공' });
  } catch (err) {
    res.status(500).json({ error: '로그인 실패' });
  }
};

// 자동 로그인
exports.autoLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    res.status(200).json({ user, message: '자동 로그인 성공' });
  } catch (err) {
    res.status(500).json({ error: '자동 로그인 실패' });
  }
};


exports.signup = async (req, res) => {
  const { username, password, image } = req.body;
  try {
    // 학생증 이미지로부터 정보 추출 (OCR)
    const { name, department, studentId } = await processStudentCardOCR(image);

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = await User.create({
      username,
      password: hashedPassword,
      name,
      department,
      studentId
    });

    res.status(201).json({ message: '회원가입 성공', user: newUser });
  } catch (err) {
    res.status(500).json({ error: '회원가입 실패' });
  }
};