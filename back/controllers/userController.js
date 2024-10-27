const User = require('../models/User');
const Match = require('../models/Match');
const sendNotification = require('../services/notificationService'); // 알림 서비스 가져오기

// 매칭된 사용자 추천 로직
exports.getMatchedUsers = async (req, res) => {
  try {
    const currentUser = req.user; // JWT 인증으로부터 가져온 사용자 정보
    // 매칭 퍼센티지가 50% 이상인 사용자 검색
    const matches = await Match.find({ userId1: currentUser._id, matchPercentage: { $gt: 50 } })
      .populate('userId2', 'name department profilePicture'); // 사용자 프로필 정보 불러오기

    // 매칭된 사용자 정보 반환
    res.json(matches.map(match => match.userId2)); 
  } catch (err) {
    res.status(500).json({ error: '매칭된 사용자 정보를 가져오지 못했습니다.' });
  }
};

// 사용자 정보 조회
exports.getUserProfile = async (req, res) => {
  try {
    // 사용자 ID로 사용자 정보를 검색하되 비밀번호는 제외
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });

    res.json(user); // 사용자 정보 반환
  } catch (err) {
    res.status(500).json({ error: '사용자 정보를 가져오는 데 실패했습니다.' });
  }
};

// 매칭 요청
exports.sendMatchRequest = async (req, res) => {
  const { userId } = req.body; // 매칭 요청을 보낼 사용자 ID
  try {
    const currentUser = req.user; // 현재 로그인된 사용자 정보

    // 이미 매칭 요청이 있는지 확인
    const matchExists = await Match.findOne({ userId1: currentUser._id, userId2: userId });

    if (!matchExists) {
      // 새로운 매칭 요청 생성
      await Match.create({
        userId1: currentUser._id,
        userId2: userId,
        matchPercentage: 60 // 기본 매칭 퍼센티지 설정 (필요 시 변경)
      });

      // 매칭 요청 받은 사용자에게 알림 전송
      await sendNotification(userId, `${currentUser.name}님이 매칭을 요청했습니다.`);
    } else {
      return res.status(400).json({ message: '이미 매칭 요청이 존재합니다.' });
    }

    res.status(200).json({ message: '매칭 요청이 성공적으로 전송되었습니다.' });
  } catch (err) {
    res.status(500).json({ error: '매칭 요청 처리 중 오류가 발생했습니다.' });
  }
};

// 사용자 목록 조회 (홈 화면용)
exports.getUsers = async (req, res) => {
  try {
    // 모든 사용자 데이터를 반환
    const users = await User.find().select('name department profilePicture mbti');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '사용자 목록을 가져오는 중 오류가 발생했습니다.' });
  }
};
