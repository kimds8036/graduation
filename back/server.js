const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // 로그인 및 회원가입 라우트
const ocrRoutes = require('./routes/ocrRoutes');    // OCR 라우트
const uploadRoutes = require('./routes/uploadRoutes');
const userRoute = require('./routes/userRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes');
const trackingRoute = require('./routes/trackingRoute'); 
const matchRoutes = require('./routes/matchRoutes');
const chatRoutes = require('./routes/chatRoutes');
const postRoutes = require('./routes/postRoutes'); // 게시글 라우트 분리
const profileRoutes = require('./routes/profile');






dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const server = http.createServer(app);
const io = socketIo(server);
 // JSON 요청을 처리할 수 있게 설정

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB 연결 성공'))
  .catch(err => console.error('MongoDB 연결 실패:', err));

// Redis 연결
const redisClient = redis.createClient({ url: process.env.REDIS_URI });
redisClient.connect()
  .then(() => console.log('Redis 연결 성공'))
  .catch(err => console.error('Redis 연결 실패:', err));

// OCR 요청이 들어오면 먼저 로그를 남기는 미들웨어
app.use('/api/ocr', (req, res, next) => {
  console.log('OCR 요청 수신:', req.body);  // 요청 데이터 로그 출력
  next();  // 다음 미들웨어 또는 라우트로 넘어감
});

// 라우트 설정
app.use('/api/auth', authRoutes);  // 로그인 및 회원가입 라우트
app.use('/api/ocr', ocrRoutes);    // OCR 라우트 연결
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tracking', trackingRoute); 
app.use('/api/chat', chatRoutes);
app.use('/api/writepost', postRoutes); // 게시글 라우트 설정
app.use(profileRoutes);


app.use('/api/matches', matchRoutes);




app.use('/api/users', userRoute);



io.on('connection', (socket) => {
  console.log('새로운 클라이언트가 연결되었습니다:', socket.id);

  socket.on('send-message', (messageData) => {
    // 메시지를 수신하면 다른 클라이언트에게 전송
    io.emit('receive-message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('클라이언트가 연결을 끊었습니다:', socket.id);
  });
  socket.on('connect', () => {
    console.log('소켓 연결 성공:', socket.id);
  });
  
});






// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

