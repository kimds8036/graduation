const fetchRecommendedProfiles = async () => {
    try {
      const response = await axiosInstance.get('/user/matches');
      setProfiles(response.data); // 추천된 사용자 리스트를 상태로 설정
    } catch (error) {
      console.log('추천 프로필 불러오기 실패:', error);
    }
  };
  
  const sendMatchRequest = async (userId) => {
    try {
      await axiosInstance.post(`/user/match-request`, { userId });
      // 매칭 요청 전송 후 UI 처리
    } catch (error) {
      console.log('매칭 요청 실패:', error);
    }
  };
  