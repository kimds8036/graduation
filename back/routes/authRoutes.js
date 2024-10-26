const express = require('express');
const { login, autoLogin, signup } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // bcrypt 모듈 추가
const User = require('../models/User'); // 사용자 모델 임포트
const router = express.Router();

// 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // username으로 사용자 찾기
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: '아이디가 존재하지 않습니다.' });
    }

    // 비밀번호 검증 (비밀번호 비교 로직 추가)
    const isMatch = await bcrypt.compare(password, user.password); // 비밀번호 비교
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 생성 (user._id를 payload로 포함)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 로그인 성공 시 token과 함께 사용자 정보를 반환
    res.json({
      token,          // JWT 토큰
      _id: user._id,  // 사용자 ObjectId
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 자동 로그인
router.post('/auto-login', autoLogin);

// 회원가입
router.post('/signup', signup);

module.exports = router;
