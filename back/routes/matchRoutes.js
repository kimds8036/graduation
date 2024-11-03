const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const MatchingRequest = require('../models/MatchingRequest'); // matchingrequests 컬렉션을 사용하는 모델

// 매칭된 사용자 목록 조회 API
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(`매칭된 사용자 목록 조회 요청 - 요청된 userId: ${userId}`);

  try {
    // userId를 ObjectId로 변환
    let objectId;
    try {
      objectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      console.log('userId를 ObjectId로 변환하는 중 오류 발생:', error);
      return res.status(400).json({ error: '유효하지 않은 사용자 ID입니다.' });
    }

    console.log(`DB에서 매칭된 사용자 조회 시작 - userId: ${userId}`);

    // 일주일 전 날짜 계산
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 매칭된 사용자 조회 조건 (1주일 내 거절된 요청 제외)
    const matches = await MatchingRequest.find({
      $or: [
        { senderId: objectId, status: 'accepted' },
        { recipientId: objectId, status: 'accepted' },
        {
          senderId: objectId,
          status: 'declined',
          declineDate: { $lt: oneWeekAgo } // 거절된지 1주일이 지난 경우만 포함
        },
        {
          recipientId: objectId,
          status: 'declined',
          declineDate: { $lt: oneWeekAgo } // 거절된지 1주일이 지난 경우만 포함
        }
      ]
    });

    console.log(`DB 조회 완료 - 매칭된 사용자 수: ${matches.length}`);

    if (matches.length === 0) {
      console.log('매칭된 사용자가 없습니다.');
    } else {
      matches.forEach(match => {
        console.log(`매칭 항목 - matchId: ${match._id}, senderId: ${match.senderId}, recipientId: ${match.recipientId}, status: ${match.status}`);
      });
    }

    // 매칭된 사용자 ID 목록 생성
    const matchedUserIds = matches.map(match => {
      const matchedUserId = match.senderId.toString() === userId ? match.recipientId : match.senderId;
      console.log(`매칭된 사용자 ID - matchId: ${match._id}, matchedUserId: ${matchedUserId}`);
      return matchedUserId;
    });

    console.log(`최종 매칭된 사용자 ID 목록: ${JSON.stringify(matchedUserIds)}`);
    res.status(200).json({ matchedUserIds });
  } catch (error) {
    console.error('매칭된 사용자 목록을 가져오는 중 오류:', error);
    res.status(500).json({ error: '매칭된 사용자 목록을 가져오지 못했습니다.' });
  }
});

module.exports = router;
