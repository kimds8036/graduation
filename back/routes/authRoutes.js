const express = require('express');
const { login, autoLogin, signup } = require('../controllers/authController');
const router = express.Router();

// 로그인
router.post('/login', login);

// 자동 로그인
router.post('/auto-login', autoLogin);


router.post('/signup', signup);


module.exports = router;
