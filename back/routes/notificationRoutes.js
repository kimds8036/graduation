const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // ObjectId 변환을 위해 mongoose 추가
const Notification = require('../models/notificationModel');
const User = require('../models/User'); // User 모델 가져오기


// 관심 알림 생성
router.post('/send-interest', async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;
    const sender = await User.findById(senderId).select('department name'); // 발신자의 학과 및 이름 조회
    // 오늘 날짜 범위 설정
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 동일한 사람에게 오늘 이미 관심을 보냈는지 확인
    const existingNotification = await Notification.findOne({
      senderId: new mongoose.Types.ObjectId(senderId),
      recipientId: new mongoose.Types.ObjectId(recipientId),
      notificationType: 'interest',
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingNotification) {
      return res.status(400).json({ error: '이미 관심표시를 한 상대입니다!' });
    }

    // 오늘 10명 이상에게 관심을 보냈는지 확인
    const sentCount = await Notification.countDocuments({
      senderId,
      notificationType: 'interest',
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (sentCount >= 10) {
      return res.status(400).json({ error: '하루에 10명까지 관심 표시가 가능합니다.' });
    }

    // 알림 생성
    const notification = new Notification({
      senderId: new mongoose.Types.ObjectId(senderId),
      recipientId: new mongoose.Types.ObjectId(recipientId),
      senderDepartment: sender.department, // 발신자 학과 (sender 정보를 통해 가져오기)
      notificationType: 'interest',
    });

    await notification.save();
    res.status(201).json({ message: '알림이 성공적으로 전송되었습니다.' });
  } catch (error) {
    console.error('알림 생성 오류:', error);
    res.status(500).json({ error: '알림 전송에 실패했습니다.' });
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