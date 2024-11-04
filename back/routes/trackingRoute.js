const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking'); // Tracking 모델
const { ObjectId } = require('mongoose').Types;

// 동선 추적 시작
router.post('/start-tracking', async (req, res) => {
  const { userid, location, day, timestamp } = req.body;

  // 기본값 설정: userId와 day가 없을 때 "unknown_user"와 현재 요일을 기본으로 설정
  const userId = userid || "unknown_user";
  const trackingDay = day || new Date().toLocaleDateString('ko-KR', { weekday: 'long' });

  try {
    console.log(`동선 추적 시작 요청 받음 - userId: ${userId}`);

    // `Time_00`에 첫 위치 데이터를 저장
    const routeData = {
      userId,
      day: trackingDay,
      Time_00: `latitude: ${location?.latitude || 0}, longitude: ${location?.longitude || 0}, timestamp: ${timestamp || new Date()}`
    };

    // 새로운 추적 데이터 생성
    const newTracking = new Tracking(routeData);
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
  const { userid, location, timestamp } = req.body;

  if (!location || !timestamp) {
    return res.status(400).json({ error: '위치와 타임스탬프 정보가 필요합니다.' });
  }

  try {
    // 시간에 따라 `Time_` 필드 지정
    const currentTimeIndex = Math.floor((new Date(timestamp).getHours() * 60 + new Date(timestamp).getMinutes()) / 5);
    const timeKey = `Time_${String(currentTimeIndex).padStart(2, '0')}`;

    // 업데이트할 데이터
    const updateData = {};
    updateData[timeKey] = `latitude: ${location.latitude}, longitude: ${location.longitude}, timestamp: ${timestamp}`;

    // 기존 추적 데이터 찾고 업데이트
    const tracking = await Tracking.findOneAndUpdate(
      { userId: userid, day: new Date().toLocaleDateString('ko-KR', { weekday: 'long' }) },
      { $set: updateData },
      { new: true, upsert: true }
    );

    console.log(`동선 업데이트 완료 - userId: ${userid}, 시간 키: ${timeKey}`);
    res.status(200).json({ message: '동선 데이터가 업데이트되었습니다.', trackingData: tracking });
  } catch (error) {
    console.error('동선 데이터 업데이트 중 오류:', error);
    res.status(500).json({ error: '동선 데이터 업데이트 중 오류가 발생했습니다.' });
  }
});
// 동선 추적 중지
// 동선 추적 중지
// 동선 추적 중지
router.post('/stop-tracking', async (req, res) => {
  const { userid, location, timestamp } = req.body;

  try {
    const trackingDay = new Date().toLocaleDateString('ko-KR', { weekday: 'long' });

    // 시간에 따라 `Time_` 필드 지정
    const currentTimeIndex = Math.floor((new Date(timestamp).getHours() * 60 + new Date(timestamp).getMinutes()) / 5);
    const timeKey = `Time_${String(currentTimeIndex).padStart(2, '0')}`;

    if (!userid) {
      // userId가 없는 경우에도 종료 메시지를 반환
      console.warn('userId가 없어 강제 종료 처리됨');
      return res.status(200).json({ message: 'userId가 없지만 동선 추적이 강제 중지되었습니다.' });
    }

    // 추적 데이터 업데이트
    const updateData = {};
    updateData[timeKey] = `latitude: ${location.latitude}, longitude: ${location.longitude}, timestamp: ${timestamp}`;

    const tracking = await Tracking.findOneAndUpdate(
      { userId: userid, day: trackingDay },
      { $set: updateData, endDate: new Date() },
      { new: true }
    );

    if (tracking) {
      console.log(`동선 추적 중지 완료 - userId: ${userid}`);
      res.status(200).json({ message: '동선 추적이 중지되었습니다.', trackingData: tracking });
    } else {
      console.warn(`추적 기록 없음 - userId: ${userid}`);
      res.status(200).json({ message: '추적 기록이 없어도 강제 중지되었습니다.' });
    }
  } catch (error) {
    console.error('동선 추적 중지 중 오류:', error);
    res.status(500).json({ error: '동선 추적 중지 중 오류가 발생했습니다.' });
  }
});




async function compareRoutes(user1Id, user2Id) {
  console.log(`compareRoutes 호출 - user1Id: ${user1Id}, user2Id: ${user2Id}`);
  
  const user1Data = await Tracking.findOne({ userid: user1Id });
  const user2Data = await Tracking.findOne({ userid: user2Id });

  if (!user1Data || !user2Data) {
    console.log("사용자 데이터가 없습니다.");
    return { matchPercentage: 0, bestStart: null, bestEnd: null };
  }

  const TOLERANCE = 0.00005;
  let matchResults = [];
  let comparisonCount = 0;

  for (let i = 0; i <= 287; i++) {
    const timeKey = `Time_${String(i).padStart(2, '0')}`;
    
    if (user1Data[timeKey] && user2Data[timeKey]) {
      comparisonCount++;
  
      const [time1, lat1, lon1] = user1Data[timeKey].split(', ');
      const latitude1 = parseFloat(lat1.split(': ')[1]);
      const longitude1 = parseFloat(lon1.split(': ')[1]);
  
      const [time2, lat2, lon2] = user2Data[timeKey].split(', ');
      const latitude2 = parseFloat(lat2.split(': ')[1]);
      const longitude2 = parseFloat(lon2.split(': ')[1]);
  
      const latDiff = Math.abs(latitude1 - latitude2);
      const lonDiff = Math.abs(longitude1 - longitude2);
  
      const formattedTime = convertTimeKeyToTime(timeKey);
  
      if (latDiff <= TOLERANCE && lonDiff <= TOLERANCE) {
        console.log(`일치 - 시간: ${formattedTime}, 위치1: (latitude: ${latitude1}, longitude: ${longitude1}), 위치2: (latitude: ${latitude2}, longitude: ${longitude2})`);
        matchResults.push(timeKey);
      } 
    }
  }

  console.log(`총 비교한 시간의 갯수: ${comparisonCount}`);
  
  const matchPercentage = Math.round((matchResults.length / comparisonCount) * 100);

  const bestMatchInterval = calculateBestMatchInterval(matchResults, user1Data.day, 3); // 3은 15분 단위
  
  const bestStart = bestMatchInterval.bestStart ? convertTimeKeyToTime(bestMatchInterval.bestStart) : null;
  const bestEnd = bestMatchInterval.bestEnd ? convertTimeKeyToTime(bestMatchInterval.bestEnd) : null;

  console.log(`compareRoutes 결과: 일치율: ${matchPercentage}%, 일치 범위: ${bestStart} ~ ${bestEnd}`);

  if (matchPercentage >= 50 && matchPercentage <= 70) {
    console.log(`일치율이 50% ~ 70%입니다: ${matchPercentage}%`);
  }

  return { matchPercentage, bestStart, bestEnd };
}

function calculateBestMatchInterval(matchResults, targetDay, intervalSize) {
  const intervals = [];
  let startTime = null;
  let endTime = null;

  matchResults.forEach((time, index) => {
    if (startTime === null) startTime = time;
    endTime = time;

    if (index === matchResults.length - 1 || getTimeDifference(matchResults[index], matchResults[index + 1]) > intervalSize * 5) {
      intervals.push({ start: startTime, end: endTime });
      startTime = null;
      endTime = null;
    }
  });

  if (intervals.length === 0) {
    return { day: targetDay, matchPercentage: 0, bestStart: null, bestEnd: null };
  }

  const longestInterval = intervals.reduce((max, interval) => 
    getTimeDifference(interval.start, interval.end) > getTimeDifference(max.start, max.end) ? interval : max, intervals[0]);
  const totalTimeSlots = matchResults.length;
  const matchedTimeSlots = intervals.reduce((sum, interval) => sum + getTimeDifference(interval.start, interval.end) / 5, 0);

  const matchPercentage = totalTimeSlots > 0 ? (matchedTimeSlots / totalTimeSlots) * 100 : 0;

  return { day: targetDay, matchPercentage: matchPercentage, bestStart: longestInterval.start, bestEnd: longestInterval.end };
}

function convertTimeKeyToTime(timeKey) {
  const index = parseInt(timeKey.split('_')[1], 10);
  const hours = String(Math.floor(index / 12)).padStart(2, '0');
  const minutes = String((index % 12) * 5).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getTimeDifference(time1, time2) {
  const [hours1, minutes1] = time1.split(":").map(Number);
  const [hours2, minutes2] = time2.split(":").map(Number);
  return Math.abs((hours2 * 60 + minutes2) - (hours1 * 60 + minutes1));
}

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

// 동선 비교 및 지도 표시 API 엔드포인트
// 동선 비교 및 지도 표시 API 엔드포인트
router.get('/get-overlapping-routes/:user1Id/:user2Id', async (req, res) => {
  const { user1Id, user2Id } = req.params;
  console.log(`get-overlapping-routes 요청 - user1Id: ${user1Id}, user2Id: ${user2Id}`);

  try {
    const user1Data = await Tracking.findOne({ userid: user1Id });
    const user2Data = await Tracking.findOne({ userid: user2Id });

    if (!user1Data || !user2Data) {
      console.log("사용자 데이터가 없습니다.");
      return res.json({ message: 'User data not found', overlap: [] });
    }

    const TOLERANCE = 0.00005;
    let matchResults = [];
    let overlapCoordinates = [];
    let comparisonCount = 0;

    // 모든 시간대 (00:00 ~ 23:55) 비교
    for (let i = 0; i <= 287; i++) {
      const timeKey = `Time_${String(i).padStart(2, '0')}`;
      
      if (user1Data[timeKey] && user2Data[timeKey]) {
        comparisonCount++;
  
        const [time1, lat1, lon1] = user1Data[timeKey].split(', ');
        const latitude1 = parseFloat(lat1.split(': ')[1]);
        const longitude1 = parseFloat(lon1.split(': ')[1]);

        const [time2, lat2, lon2] = user2Data[timeKey].split(', ');
        const latitude2 = parseFloat(lat2.split(': ')[1]);
        const longitude2 = parseFloat(lon2.split(': ')[1]);

        const latDiff = Math.abs(latitude1 - latitude2);
        const lonDiff = Math.abs(longitude1 - longitude2);

        if (latDiff <= TOLERANCE && lonDiff <= TOLERANCE) {
          matchResults.push(timeKey);
          overlapCoordinates.push({
            time: convertTimeKeyToTime(timeKey),
            latitude: latitude1,
            longitude: longitude1
          });
        }
      }
    }

    // 전체 시간대 일치 퍼센트 계산
    const totalMatchPercentage = Math.round((matchResults.length / comparisonCount) * 100);

    // 일치 구간의 첫 번째와 마지막 시간 계산
    const firstMatch = matchResults[0];
    const lastMatch = matchResults[matchResults.length - 1];

    // 일치 구간에 해당하는 비교 횟수 계산 (예: 14:30부터 15:20까지)
    const intervalStartIndex = parseInt(firstMatch.split('_')[1], 10);
    const intervalEndIndex = parseInt(lastMatch.split('_')[1], 10);
    const intervalComparisonCount = intervalEndIndex - intervalStartIndex + 1;

    // 일치 구간 퍼센트 계산
    const intervalPercentage = Math.round((matchResults.length / intervalComparisonCount) * 100);

    const bestStart = firstMatch ? convertTimeKeyToTime(firstMatch) : null;
    const bestEnd = lastMatch ? convertTimeKeyToTime(lastMatch) : null;

    console.log(`전체 시간대 일치율: ${totalMatchPercentage}%`);
    console.log(`일치 구간 일치율: ${intervalPercentage}%`);

    res.json({
      totalMatchPercentage,      // 전체 시간대 일치 퍼센트
      intervalMatchPercentage: intervalPercentage, // 일치 구간 퍼센트
      bestStart,
      bestEnd,
      overlapCoordinates,
      day: user1Data.day
    });
  } catch (error) {
    console.error('겹치는 동선 조회 중 오류:', error);
    res.status(500).json({ error: 'Error fetching overlapping routes' });
  }
});

module.exports = router;





