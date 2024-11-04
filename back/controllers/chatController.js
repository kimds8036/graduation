// controllers/chatController.js
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User'); // 유저 모델 import


// 채팅방 가져오기 또는 생성
exports.getOrCreateChatRoom = async (req, res) => {
  const { user1, user2 } = req.body;
  try {
    let chatRoom = await ChatRoom.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 }
      ]
    });
    
    if (!chatRoom) {
      chatRoom = await ChatRoom.create({ user1, user2 });
    }
    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: '채팅방 생성 또는 가져오기 실패' });
  }
};

// 사용자의 채팅방 목록 가져오기
exports.getChatRooms = async (req, res) => {
  const { userId } = req.params;
  try {
    const chatRooms = await ChatRoom.find({
      $or: [{ user1: userId }, { user2: userId }]
    }).sort({ createdAt: -1 });

    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: '채팅방 목록 가져오기 실패' });
  }
};

// 기존 메시지 목록 가져오기
exports.getMessages = async (req, res) => {
  const { senderId, recipientId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId, recipientId },
        { senderId: recipientId, recipientId: senderId }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: '메시지 가져오기 실패' });
  }
};

// 메시지 전송
exports.sendMessage = async (req, res) => {
  const { senderId, recipientId, message } = req.body;
  try {
    const newMessage = await Message.create({ senderId, recipientId, message });
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: '메시지 전송 실패' });
  }
};

// 채팅방 목록 가져오기 (최신 메시지와 상태 포함)
exports.getChatRoomsWithLastMessage = async (req, res) => {
  const { userId } = req.params;
  try {
    const chatRooms = await ChatRoom.find({
      $or: [{ user1: userId }, { user2: userId }]
    }).sort({ createdAt: -1 });

    const roomsWithLastMessage = await Promise.all(
      chatRooms.map(async (room) => {
        // 상대방 ID 식별
        const otherUserId = room.user1 === userId ? room.user2 : room.user1;

        // 상대방 학과 정보와 프로필 이미지 URL 조회
        const otherUser = await User.findById(otherUserId).select('department profileImageUrl');
        
        // 가장 최근 메시지 가져오기
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: room.user1, recipientId: room.user2 },
            { senderId: room.user2, recipientId: room.user1 }
          ]
        }).sort({ timestamp: -1 });
        
        // 읽지 않은 메시지 개수 가져오기
        const unread = await Message.countDocuments({
          recipientId: userId,
          senderId: otherUserId,
          read: false
        });

        return {
          roomId: room._id,
          userName: otherUser?.department || '학과 정보 없음', // 학과 이름 표시
          profileImageUrl: otherUser?.profileImageUrl || '',  // 프로필 이미지 URL 추가
          _id: otherUserId, // 상대방 ID 추가
          lastMessage: lastMessage ? lastMessage.message : '',
          date: lastMessage ? lastMessage.timestamp : room.createdAt,
          unread,
        };
      })
    );

    res.json(roomsWithLastMessage);
  } catch (error) {
    console.error('채팅방 목록 가져오기 실패:', error);
    res.status(500).json({ error: '채팅방 목록 가져오기 실패' });
  }
};
