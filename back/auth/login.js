import axiosInstance from '../utils/axiosInstance'; // 설정한 axios 인스턴스 불러오기

const handleLogin = async (username, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { username, password });
    const { token } = response.data;
    await storeToken(token); // JWT 토큰 저장
    // 로그인 성공 후 홈 화면으로 이동
  } catch (error) {
    console.log('로그인 실패:', error);
  }
};
