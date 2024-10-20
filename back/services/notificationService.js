const redis = require('redis');

// Redis 클라이언트 생성
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });

// Redis 연결
redisClient.connect()
  .then(() => console.log('Redis 연결 성공'))
  .catch((err) => console.error('Redis 연결 실패:', err));

// 알림 전송 함수
const sendNotification = async (userId, message) => {
  try {
    // 특정 사용자에게 알림을 전송하는 Pub/Sub 채널 사용
    await redisClient.publish(`notifications:${userId}`, message);
    console.log(`알림 전송 성공: ${message}`);
  } catch (err) {
    console.error('알림 전송 실패:', err);
  }
};

module.exports = sendNotification;
