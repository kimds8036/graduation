const express = require('express');
const { extractStudentCardInfo } = require('../services/ocrService'); // OCR 서비스 함수 가져오기
const router = express.Router();

// OCR 요청을 처리하는 라우트
router.post('/ocr', async (req, res) => {
  const { base64Image } = req.body;

  try {
    const ocrData = await extractStudentCardInfo(base64Image); // OCR 서비스 호출
    res.json({ success: true, data: ocrData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'OCR 처리 중 오류 발생' });
  }
});

module.exports = router;
