const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // bcrypt 모듈 불러오기
const User = require('../models/User'); // User 모델 불러오기
const redis = require('redis');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();



// Redis 클라이언트 생성
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });
redisClient.connect(); // Redis 연결

// 로그인 라우트
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 사용자를 찾음
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`사용자를 찾을 수 없습니다: ${username}`);
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // DB에 저장된 해시된 비밀번호 로그 출력
    console.log(`DB에 저장된 해시된 비밀번호: ${user.password}`);

    // 비밀번호 검증 (입력된 비밀번호와 해시된 비밀번호 비교)
    const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('비밀번호가 일치하지 않습니다.');
        return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
      }
    
    // 입력된 비밀번호와 해시된 비밀번호 비교 로그 출력
    console.log(`입력된 비밀번호: ${password} (비교 대상: ${user.password})`);

    if (!isMatch) {
      console.log('비밀번호가 일치하지 않습니다.');
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 생성
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, _id: user._id });
  } catch (err) {
    console.error('로그인 오류:', err);
    res.status(500).json({ error: '로그인 실패' });
  }
});
// 자동 로그인 라우트
router.post('/autoLogin', authMiddleware, async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Redis에서 세션 확인
    const redisToken = await redisClient.get(`session:${decoded.id}`);
    if (!redisToken || redisToken !== token) {
      return res.status(401).json({ message: '세션이 만료되었습니다. 다시 로그인해 주세요.' });
    }

    // 사용자 찾기
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    res.status(200).json({ user, message: '자동 로그인 성공' });
  } catch (err) {
    console.error('자동 로그인 오류:', err);
    res.status(500).json({ error: '자동 로그인 실패' });
  }
});

// 회원가입 라우트
router.post('/signup', async (req, res) => {
  const { name, username, password, department, studentId, mbti, profileImageUrl } = req.body;

  try {
    // 중복된 아이디 또는 학번 체크
    const existingUser = await User.findOne({ $or: [{ username }, { studentId }] });
    if (existingUser) {
      console.error('이미 존재하는 아이디 또는 학번:', existingUser);
      return res.status(400).json({ error: '아이디 또는 학번이 이미 존재합니다.' });
    }

    // 새로운 사용자 생성
    const newUser = new User({
      name,
      username,
      password,
      department,
      studentId,
      mbti,
      profileImageUrl,
    });

    // 사용자 저장
    await newUser.save();
    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});


router.post('/test-bcrypt', (req, res) => {
  const inputPassword = 'aaa'; // 사용자가 입력한 비밀번호
  const hashedPassword = '$2a$10$8WPaWN5zdsBTmETAQ40mveG7eONbprO68KOmq5m1uNu4lacQ2bqWy'; // DB에 저장된 해시된 비밀번호

  bcrypt.compare(inputPassword, hashedPassword, (err, result) => {
    if (err) {
      console.error('비교 오류:', err);
      return res.status(500).json({ error: '비교 중 오류가 발생했습니다.' });
    } else {
      console.log('비밀번호 비교 결과:', result); // true일 경우 일치, false일 경우 불일치
      return res.status(200).json({ message: `비교 결과: ${result}` });
    }
  });
});


module.exports = router;
