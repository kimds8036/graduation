const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

// 로그인 관련 라우트
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
