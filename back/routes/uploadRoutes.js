const express = require('express');
const router = express.Router();
const { storage } = require('../config/firebaseConfig'); // 백엔드에서 Firebase 설정 불러오기

router.post('/uploadProfileImage', async (req, res) => {
  try {
    const { imageUri } = req.body;
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const imageName = `profileImages/${Date.now()}.jpg`;
    const ref = storage.ref().child(imageName);
    const snapshot = await ref.put(blob);

    const downloadURL = await snapshot.ref.getDownloadURL();
    res.json({ success: true, downloadURL });
  } catch (error) {
    res.status(500).json({ success: false, message: '이미지 업로드 실패', error });
  }
});

module.exports = router;
