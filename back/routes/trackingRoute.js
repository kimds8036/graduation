const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking'); // Tracking 모델
const { ObjectId } = require('mongoose').Types;

// 동선 추적 시작
router.post('/start-tracking', async (req, res) => {
  const { userid, location, day, timestamp } = req.body;

  try {
    console.log(`동선 추적 시작 요청 받음 - userid: ${userid}`);

    // 새 트래킹 기록 추가
    const routeData = {
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: timestamp || new Date(),
      },
      day: day,
    };

    const newTracking = new Tracking({ userid, routes: [routeData], startDate: new Date() });
    await newTracking.save();

    console.log(`저장된 동선 추적 데이터: ${JSON.stringify(newTracking)}`);
    res.status(200).json({ message: '동선 추적이 시작되었습니다.', trackingData: newTracking });
  } catch (error) {
    console.error('동선 추적 시작 중 오류:', error);
    res.status(500).json({ error: '동선 추적 시작 중 오류가 발생했습니다.' });
  }
});

// 동선 데이터 업데이트
router.post('/update-tracking', async (req, res) => {
  const { userid, latitude, longitude, timestamp, day } = req.body;

  console.log(`동선 업데이트 요청 받음 - userid: ${userid}, latitude: ${latitude}, longitude: ${longitude}`);
  
  if (!latitude || !longitude) {
    console.warn('위도와 경도 값이 없습니다.');
    return res.status(400).json({ error: '위도와 경도 값이 필요합니다.' });
  }

  try {
    const tracking = await Tracking.findOne({ userid });
    if (tracking) {
      console.log(`기존 추적 데이터 발견 - userid: ${userid}`);
      const routeData = {
        location: {
          latitude: latitude,
          longitude: longitude,
          timestamp: timestamp || new Date(),
        },
        day: day,
      };
      tracking.routes.push(routeData);
      await tracking.save();

      console.log(`동선 업데이트 완료 - userid: ${userid}`);
      res.status(200).json({ message: '동선 데이터가 업데이트되었습니다.' });
    } else {
      console.warn(`추적 기록 없음 - userid: ${userid}`);
      res.status(404).json({ error: '해당 사용자에 대한 동선 추적 기록이 없습니다.' });
    }
  } catch (error) {
    console.error('동선 데이터 업데이트 중 오류:', error);
    res.status(500).json({ error: '동선 데이터 업데이트 중 오류가 발생했습니다.' });
  }
});

// 동선 추적 중지
router.post('/stop-tracking', async (req, res) => {
  const { userid, location, timestamp, day } = req.body;

  try {
    console.log(`동선 추적 중지 요청 - userid: ${userid}`);

    const tracking = await Tracking.findOne({ userid });
    if (tracking) {
      const routeData = {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: timestamp || new Date(),
        },
        day: day,
      };
      tracking.routes.push(routeData);
      tracking.endDate = new Date();
      await tracking.save();

      console.log(`동선 추적 중지 - userid: ${userid}`);
      res.status(200).json({ message: '동선 추적이 중지되었습니다.', trackingData: tracking });
    } else {
      console.warn(`추적 기록 없음 - userid: ${userid}`);
      res.status(404).json({ error: '해당 사용자에 대한 동선 추적 기록이 없습니다.' });
    }
  } catch (error) {
    console.error('동선 추적 중지 중 오류:', error);
    res.status(500).json({ error: '동선 추적 중지 중 오류가 발생했습니다.' });
  }
});

// 최대 일치율 범위 찾기 함수 (최소 2시간 범위)
async function compareRoutes(user1Id, user2Id) {
  console.log(`compareRoutes 호출 - user1Id: ${user1Id}, user2Id: ${user2Id}`);
  
  // 해당 사용자 아이디에 대한 트래킹 문서 수 확인
  const user1DataCount = await Tracking.countDocuments({ userid: user1Id });
  const user2DataCount = await Tracking.countDocuments({ userid: user2Id });
  console.log(`user1Id (${user1Id})의 문서 수: ${user1DataCount}, user2Id (${user2Id})의 문서 수: ${user2DataCount}`);

  const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  let bestMatch = { day: null, matchPercentage: 0, bestStart: null, bestEnd: null };

  for (const targetDay of daysOfWeek) {
    const user1Data = await Tracking.findOne({ userid: user1Id, day: targetDay });
    const user2Data = await Tracking.findOne({ userid: user2Id, day: targetDay });

    if (!user1Data || !user2Data) {
      continue;
    }

    const parseTimeData = (timedata) => {
      return timedata.map((entry) => {
        const [time, latitude, longitude] = entry.match(/([\d:]+), latitude: ([\d.]+), longitude: ([\d.]+)/).slice(1);
        return { time, latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
      });
    };

    const user1Routes = parseTimeData(user1Data.time_data);
    const user2Routes = parseTimeData(user2Data.time_data);
    
    const matchResults = [];
    const TOLERANCE = 0.0005;

    user1Routes.forEach(user1Route => {
      user2Routes.forEach(user2Route => {
        if (user1Route.time === user2Route.time) {
          const latDiff = Math.abs(user1Route.latitude - user2Route.latitude);
          const lonDiff = Math.abs(user1Route.longitude - user2Route.longitude);
    
          if (latDiff <= TOLERANCE && lonDiff <= TOLERANCE) {
            matchResults.push(user1Route.time);
          }
        }
      });
    });

    const matchResultForDay = calculateBestMatchInterval(matchResults, targetDay);

    if (matchResultForDay.matchPercentage >= 5 && matchResultForDay.matchPercentage > bestMatch.matchPercentage) {
      bestMatch = matchResultForDay;
    }
  }

  console.log(`compareRoutes 결과: ${JSON.stringify(bestMatch)}`);
  return bestMatch;
}

function calculateBestMatchInterval(matchResults, targetDay) {
  const totalMatches = matchResults.length;
  const totalTimeSlots = matchResults.length;

  const matchPercentage = totalTimeSlots > 0 ? (totalMatches / totalTimeSlots) * 100 : 0;

  return {
    day: targetDay,
    matchPercentage: matchPercentage,
    bestStart: null,
    bestEnd: null
  };
}

// 동선 비교 API 엔드포인트
router.get('/compare-routes/:user1Id/:user2Id', async (req, res) => {
  const { user1Id, user2Id } = req.params;
  console.log(`compare-routes 요청 - user1Id: ${user1Id}, user2Id: ${user2Id}`);

  try {
    const result = await compareRoutes(user1Id, user2Id);
    if (result.matchPercentage >= 1) {
      console.log(`일치율 결과 - matchPercentage: ${result.matchPercentage}`);
      res.json(result);
    } else {
      console.log('일치율 1% 미만으로 의미 있는 일치 없음');
      res.json({ message: 'No significant match found' });
    }
  } catch (error) {
    console.error('동선 비교 중 오류:', error);
    res.status(500).json({ error: 'Error comparing routes' });
  }
});

module.exports = router;
