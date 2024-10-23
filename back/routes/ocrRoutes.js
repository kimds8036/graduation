const express = require('express');
const { extractStudentCardInfo } = require('../services/ocrService'); // OCR 서비스 함수 가져오기
const router = express.Router();

// OCR 요청을 처리하는 라우트 (POST 요청 처리)
router.post('/', async (req, res) => {
  const { base64Image } = req.body;

  if (!base64Image) {
    return res.status(400).json({ success: false, message: '이미지가 제공되지 않았습니다.' });
  }

  try {
    console.log('OCR 요청 수신: 이미지를 처리 중입니다.'); // 로그: 요청 수신
    
    // OCR 서비스 호출
    const ocrData = await extractStudentCardInfo(base64Image);

    console.log('OCR 처리 완료: ', ocrData); // 로그: 처리 완료
    res.json({ success: true, data: ocrData });

  } catch (error) {
    console.error('OCR 처리 중 오류:', error.message); // 오류 로그
    console.error(error.stack); // 스택 추적 정보 로그

    // 클라이언트에 상태 코드와 오류 메시지 응답
    res.status(500).json({
      success: false,
      message: 'OCR 처리 중 오류 발생',
      error: error.message  // 클라이언트에 오류 메시지 전달
    });
  }
});

module.exports = router;
