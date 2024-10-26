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
      console.error('No file uploaded');
      return res.status(400).send('No file uploaded.');
    }

    console.log(`File received: ${file.originalname}, size: ${file.size}`);

    // Firebase Storage에 파일 업로드
    const blob = bucket.file(`profileImages/${Date.now()}_${file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,  // 파일의 MIME 타입 설정
      },
    });

    blobStream.on('error', (err) => {
      console.error('Blob stream error during upload:', err);
      return res.status(500).send({ error: 'Unable to upload image to Firebase Storage.', details: err.message });
    });

    blobStream.on('finish', async () => {
      try {
        // Public URL 생성
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

        console.log('File successfully uploaded to Firebase Storage. Public URL:', publicUrl);
        res.status(200).send({ downloadURL: publicUrl });
      } catch (error) {
        console.error('Error generating public URL:', error);
        res.status(500).send({ error: 'Error generating public URL.', details: error.message });
      }
    });

    // 업로드 프로세스 시작
    blobStream.end(file.buffer);
    console.log('Upload process started');
  } catch (error) {
    console.error('Unexpected error during file upload:', error);
    res.status(500).send({ error: 'Unexpected error occurred during file upload.', details: error.message });
  }
});

module.exports = router;
