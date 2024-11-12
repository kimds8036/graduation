const express = require('express');
const router = express.Router();

// 프로필 업데이트 라우트
router.post('/api/updateProfile', async (req, res) => {
  const { userId, mbti, gender, categories, profilePicture } = req.body;

  try {
    // users는 데이터베이스 모델을 가정
    await users.updateOne(
      { _id: userId },
      {
        $set: {
          mbti,
          gender,
          categories,
          profilePicture
        }
      }
    );
    res.status(200).json({ message: '프로필이 성공적으로 업데이트되었습니다' });
  } catch (error) {
    res.status(500).json({ error: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
