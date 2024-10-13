const express = require('express');
const { getKakaoAccessToken } = require('../controllers/authController');
const router = express.Router();

// POST 요청으로 Authorization Code를 받아 Kakao Access Token을 요청
router.post('/kakao/login', getKakaoAccessToken);

module.exports = router;
