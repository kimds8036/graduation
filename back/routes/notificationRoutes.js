const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // ObjectId 변환을 위해 mongoose 추가
const Notification = require('../models/notificationModel');

// 관심 알림 생성
router.post('/send-interest', async (req, res) => {
  try {
    const { senderId, recipientId, message } = req.body;
    
    // senderId와 recipientId를 ObjectId로 변환
    const notification = new Notification({
      senderId: mongoose.Types.ObjectId(senderId), // senderId를 ObjectId로 변환
      recipientId: mongoose.Types.ObjectId(recipientId), // recipientId를 ObjectId로 변환
      message,
    });
    await notification.save();
    
    res.status(201).json({ message: '알림이 성공적으로 생성되었습니다.' });
  } catch (error) {
    console.error('알림 생성 오류:', error);
    res.status(500).json({ error: '알림 생성에 실패했습니다.' });
  }
});


// 수신자의 알림 가져오기
router.get('/:recipientId', async (req, res) => {
  const { recipientId } = req.params;

  try {
    console.log('검색하려는 recipientId:', recipientId);

    // recipientId를 ObjectId로 변환할 때 new 키워드 추가
    const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

    // recipientId 필드에 대해 ObjectId로 필터링하여 알림 검색
    const notifications = await Notification.find({ recipientId: recipientObjectId }).sort({ createdAt: -1 });
    
    console.log('서버에서 반환된 알림:', notifications);

    res.status(200).json(notifications);
  } catch (error) {
    console.error('알림 조회 오류:', error);
    res.status(500).json({ error: '알림을 불러오는 데 실패했습니다.' });
  }
});



// 수신자의 모든 읽지 않은 알림을 읽음 처리
// 수신자의 모든 읽지 않은 알림을 읽음 처리
router.put('/mark-all-as-read/:recipientId', async (req, res) => {
  const { recipientId } = req.params;

  try {
    // recipientId를 ObjectId로 변환
    const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

    // recipientId에 해당하는 모든 읽지 않은 알림을 읽음 처리
    await Notification.updateMany(
      { recipientId: recipientObjectId, read: false },  // 읽지 않은 알림 필터링
      { $set: { read: true } }  // read 필드를 true로 업데이트
    );

    res.status(200).json({ message: '모든 알림이 읽음 처리되었습니다.' });
  } catch (error) {
    console.error('모든 알림 읽음 처리 오류:', error);
    res.status(500).json({ error: '모든 알림 읽음 처리에 실패했습니다.' });
  }
});

module.exports = router;