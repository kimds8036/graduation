const express = require('express');
const { getMatchedUsers, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');  // 위에서 만든 User 모델 불러오기
 // 인증 미들웨어 임포트

const bcrypt = require('bcryptjs');



const router = express.Router();

// 매칭된 사용자 정보 가져오기
router.get('/matches', authMiddleware, getMatchedUsers);

// 특정 사용자 프로필 정보 가져오기
router.get('/:id', authMiddleware, getUserProfile);

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
  
  router.get('/me', authMiddleware, async (req, res) => {
    try {
      // req.user는 authMiddleware에서 추가된 사용자 정보
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
      res.json({
        id: user._id,
        username: user.username,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
  });


module.exports = router;
