// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware'); // 인증 미들웨어 추가

// 사용자의 채팅방 목록 가져오기
router.get('/get-chat-rooms/:userId', chatController.getChatRooms);

// 특정 사용자와의 채팅방 가져오기 또는 생성
router.post('/get-or-create-chat-room', chatController.getOrCreateChatRoom);


router.get('/get-chat-rooms-with-last-message/:userId', chatController.getChatRoomsWithLastMessage);

// 메시지 목록 가져오기
router.get('/get-messages/:senderId/:recipientId', chatController.getMessages);

// 메시지 전송
router.post('/send-message', chatController.sendMessage);

module.exports = router;
