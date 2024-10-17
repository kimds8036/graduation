const redis = require('redis');
const redisClient = redis.createClient({ url: process.env.REDIS_URI });

exports.sendNotification = async (userId, message) => {
  try {
    await redisClient.connect();
    // 사용자에게 알림 전송 (Redis를 사용한 예시)
    await redisClient.publish(userId, message);
    console.log('알림 전송 성공:', message);
  } catch (err) {
    console.error('알림 전송 실패:', err);
  } finally {
    redisClient.disconnect();
  }
};
