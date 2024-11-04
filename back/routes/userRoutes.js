const express = require('express');
const { getMatchedUsers, getUserProfile, getUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

// 사용자 목록 가져오기 (홈 화면에서 사용)
router.get('/users', getUsers);

// 특정 사용자 학과와 MBTI 정보 가져오기

router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  
  // 요청받은 userId를 로그로 출력
  console.log(`사용자 정보 요청: userId = ${userId}`);

  try {
    // userId를 사용하여 사용자 정보 조회
    const user = await User.findById(userId).select('department mbti profileImageUrl');
    
    // 사용자를 찾지 못한 경우
    if (!user) {
      console.log(`사용자 정보 없음: userId = ${userId}`);
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 조회된 사용자 정보를 로그로 출력
    console.log(`사용자 정보 조회 성공:`, {
      department: user.department,
      mbti: user.mbti,
      profileImageUrl: user.profileImageUrl,
    });
    
    // 클라이언트에 사용자 정보 응답
    res.status(200).json(user);
  } catch (error) {
    // 오류 발생 시 로그 출력
    console.error('사용자 정보 조회 오류:', error);
    res.status(500).json({ error: '사용자 정보를 가져오는 중 오류 발생' });
  }
});

// 매칭된 사용자 정보 가져오기
router.get('/matches', authMiddleware, getMatchedUsers);

// 특정 사용자 프로필 정보 가져오기
router.get('/:id', authMiddleware, getUserProfile);

// 현재 로그인된 사용자의 정보 가져오기
router.get('/me', authMiddleware, async (req, res) => {
  try {
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
