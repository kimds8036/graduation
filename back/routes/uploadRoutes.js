// uploadRoute.js
const express = require('express');
const { bucket } = require('../firebaseAdmin');
const multer = require('multer');  // 파일 업로드를 처리하기 위한 multer 라이브러리 사용

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });  // 메모리에서 파일 처리

// 이미지 업로드 API
router.post('/uploadProfileImage', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send('No file uploaded.');
    }

    const blob = bucket.file(`profileImages/${Date.now()}_${file.originalname}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      res.status(500).send({ error: 'Unable to upload image.' });
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).send({ downloadURL: publicUrl });  // 업로드 후 URL 반환
    });

    blobStream.end(file.buffer);  // 업로드 프로세스 시작
  } catch (error) {
    res.status(500).send({ error: 'Something went wrong.' });
  }
});

module.exports = router;
