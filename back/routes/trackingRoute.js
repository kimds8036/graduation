const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking'); // Tracking 모델

// 동선 추적 시작
// 동선 추적 시작
router.post('/start-tracking', async (req, res) => {
  const { userId, location, day, timestamp } = req.body;

  try {
    console.log(`동선 추적 시작 요청 받음 - userId: ${userId}`);

    // 새 트래킹 기록 추가
    const routeData = {
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: timestamp || new Date(), // 클라이언트에서 받은 timestamp 사용, 없으면 현재 시간
      },
      day: day, // 클라이언트에서 받은 day 사용
    };

    // 새 동선 기록 추가
    const newTracking = new Tracking({ userId, routes: [routeData], startDate: new Date() });
    await newTracking.save();

    console.log(`저장된 동선 추적 데이터: ${JSON.stringify(newTracking)}`);
    res.status(200).json({ message: '동선 추적이 시작되었습니다.', trackingData: newTracking });
  } catch (error) {
    console.error('동선 추적 시작 중 오류:', error);
    res.status(500).json({ error: '동선 추적 시작 중 오류가 발생했습니다.' });
  }
});


// 동선 데이터 업데이트 (위도, 경도 및 시간 저장)
// 동선 데이터 업데이트 (위도, 경도 및 시간 저장)
router.post('/update-tracking', async (req, res) => {
  const { userId, latitude, longitude, timestamp, day } = req.body;

  // 위치 데이터 유효성 확인
  if (!latitude || !longitude) {
    return res.status(400).json({ error: '위도와 경도 값이 필요합니다.' });
  }

  try {
    const tracking = await Tracking.findOne({ userId });
    if (tracking) {
      const routeData = {
        location: {
          latitude: latitude,
          longitude: longitude,
          timestamp: timestamp || new Date(),
        },
        day: day,
      };
      tracking.routes.push(routeData); // 새로운 위치 데이터 추가
      await tracking.save();

      res.status(200).json({ message: '동선 데이터가 업데이트되었습니다.' });
    } else {
      res.status(404).json({ error: '해당 사용자에 대한 동선 추적 기록이 없습니다.' });
    }
  } catch (error) {
    console.error('동선 데이터 업데이트 중 오류:', error);
    res.status(500).json({ error: '동선 데이터 업데이트 중 오류가 발생했습니다.' });
  }
});

// 동선 추적 중지
// 동선 추적 중지
router.post('/stop-tracking', async (req, res) => {
  const { userId, location, timestamp, day } = req.body;

  try {
    console.log(`동선 추적 중지 요청 - userId: ${userId}`);

    const tracking = await Tracking.findOne({ userId });
    if (tracking) {
      const routeData = {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: timestamp || new Date(),
        },
        day: day,
      };
      tracking.routes.push(routeData); // 최종 동선 추가
      tracking.endDate = new Date();  // 추적이 끝난 날짜 저장
      await tracking.save();

      console.log(`동선 추적 중지 - userId: ${userId}`);
      res.status(200).json({ message: '동선 추적이 중지되었습니다.', trackingData: tracking });
    } else {
      res.status(404).json({ error: '해당 사용자에 대한 동선 추적 기록이 없습니다.' });
    }
  } catch (error) {
    console.error('동선 추적 중지 중 오류:', error);
    res.status(500).json({ error: '동선 추적 중지 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
