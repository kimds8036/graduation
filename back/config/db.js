const mongoose = require('mongoose');
const redis = require('redis');

// MongoDB 연결
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB 연결 성공');
  } catch (err) {
    console.error('MongoDB 연결 실패', err);
  }
};

// Redis 연결
const redisClient = redis.createClient({ url: 'redis://localhost:6379' });

redisClient.connect()
  .then(() => console.log('Redis 연결 성공'))
  .catch((err) => console.error('Redis 연결 실패', err));

module.exports = { connectDB, redisClient };
