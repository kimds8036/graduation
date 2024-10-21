const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') }); // .env 파일 경로를 절대 경로로 지정

// 네이버 OCR로 사진 전송 및 정보 추출
const extractStudentCardInfo = async (base64Image) => {
  try {
    // API 호출 전에 로그 추가
    console.log("API 호출 시작:");
    console.log("API URL:", process.env.OCR_API_URL);
    console.log("헤더:", { 'X-OCR-SECRET': process.env.NAVER_OCR_SECRET });
    console.log("이미지 데이터:", base64Image ? "이미지 있음" : "이미지 없음");

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
        templateId: process.env.TEMPLATE_ID // 템플릿 ID 추가
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-OCR-SECRET': process.env.NAVER_OCR_SECRET, // .env 파일에 저장된 네이버 OCR Secret
        },
        timeout: 100 // 타임아웃을 10초로 설정
      }
    );

    console.log("API 호출 성공:", response.data);

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
    // 에러 로그 추가
    console.error("OCR 처리 중 오류:", error.message);
    if (error.response) {
      console.error("서버 응답:", error.response.data);
    } else if (error.request) {
      console.error("요청이 서버에 도달하지 못함:", error.request);
    } else {
      console.error("오류:", error.message);
    }
    throw new Error('OCR 요청 실패');
  }
};

module.exports = {
  extractStudentCardInfo,
};
