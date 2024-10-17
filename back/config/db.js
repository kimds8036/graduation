const mongoose = require('mongoose');
const redis = require('redis');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1); // 실패 시 서버 종료
  }
};

const connectRedis = async () => {
  try {
    const client = redis.createClient({ url: process.env.REDIS_URI });
    await client.connect();
    console.log('Redis 연결 성공');
  } catch (error) {
    console.error('Redis 연결 실패:', error);
    process.exit(1); // 실패 시 서버 종료
  }
};

module.exports = { connectMongoDB, connectRedis };
