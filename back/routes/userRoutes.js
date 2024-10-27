const express = require('express');
const { getMatchedUsers, getUserProfile, getUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');  // 위에서 만든 User 모델 불러오기
const bcrypt = require('bcryptjs'); // 비밀번호 암호화에 사용

const router = express.Router();


// 사용자 목록 가져오기 (홈 화면에서 사용)
router.get('/users', getUsers); // 이 부분 추가

// 매칭된 사용자 정보 가져오기
router.get('/matches', authMiddleware, getMatchedUsers);

// 특정 사용자 프로필 정보 가져오기
router.get('/:id', authMiddleware, getUserProfile);




// 현재 로그인된 사용자의 정보 가져오기
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
