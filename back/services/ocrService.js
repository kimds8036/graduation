const axios = require('axios');

exports.processStudentCardOCR = async (image) => {
  const url = 'https://naverocr.api.url';  // Naver OCR API 엔드포인트
  const headers = { 'X-Naver-Client-Id': 'your-client-id', 'X-Naver-Client-Secret': 'your-client-secret' };

  try {
    const response = await axios.post(url, { image }, { headers });
    const { name, department, studentId } = response.data;  // 학생 정보 추출
    return { name, department, studentId };
  } catch (err) {
    throw new Error('OCR 실패');
  }
};
