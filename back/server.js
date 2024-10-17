const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// Redis 연결
const redisClient = redis.createClient({ url: process.env.REDIS_URI });
redisClient.connect()
  .then(() => console.log('Redis 연결 성공'))
  .catch(err => console.error('Redis 연결 실패:', err));

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
