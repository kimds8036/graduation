// 필요한 모듈 불러오기
const express = require('express');
const bcrypt = require('bcryptjs');  // 비밀번호 비교를 위해 bcrypt 사용
const jwt = require('jsonwebtoken');  // JWT 토큰 생성
const User = require('../models/User');  // User 모델 가져오기

const router = express.Router();

// 로그인 라우트
router.post('/login', async (req, res) => {
  const { id, password } = req.body;

  try {
    // 1. 사용자가 입력한 아이디로 사용자 검색
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });
    }

    // 2. 입력된 비밀번호와 저장된 해시된 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // 3. 비밀번호가 맞으면 JWT 토큰 생성
    const token = jwt.sign(
      { _id: user._id, id: user.id },  // 토큰에 _id와 id를 모두 포함
      process.env.JWT_SECRET,  // 시크릿 키 (환경 변수로 설정해야 안전함)
      { expiresIn: '1h' }  // 토큰 유효 기간
    );

    // 4. 성공적으로 로그인했으므로 토큰과 _id 반환
    res.json({ token, _id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;
