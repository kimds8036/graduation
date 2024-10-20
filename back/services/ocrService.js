const axios = require('axios');

// 네이버 OCR로 사진 전송 및 정보 추출
const extractStudentCardInfo = async (base64Image) => {
  try {
    const response = await axios.post(
      process.env.OCR_API_URL, // .env 파일에 저장된 네이버 OCR API URL
      {
        images: [
          {
            format: 'jpeg',
            name: 'student_card',
            data: base64Image // Base64 인코딩된 이미지 데이터
          }
        ],
        requestId: 'sample_request_id',
        version: 'V2',
        timestamp: new Date().getTime(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-OCR-SECRET': process.env.NAVER_OCR_SECRET, // .env 파일에 저장된 네이버 OCR Secret
        },
      }
    );

    // OCR에서 추출된 데이터 처리
    const extractedData = response.data.images[0].fields.reduce((result, field) => {
      const fieldName = field.name; // OCR 템플릿에서 설정한 필드명
      const fieldValue = field.inferText; // 추출된 텍스트 값
      return {
        ...result,
        [fieldName]: fieldValue,
      };
    }, {});

    return extractedData;
  } catch (error) {
    console.error('OCR 처리 중 오류:', error);
    throw new Error('OCR 요청 실패');
  }
};

// module.exports를 통해 함수를 내보냄
module.exports = {
  extractStudentCardInfo,
};
