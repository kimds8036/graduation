const express = require('express');
const { getMatchedUsers, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 매칭된 사용자 정보 가져오기
router.get('/matches', authMiddleware, getMatchedUsers);

// 특정 사용자 프로필 정보 가져오기
router.get('/:id', authMiddleware, getUserProfile);

module.exports = router;
