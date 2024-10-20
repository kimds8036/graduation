const User = require('../models/User');
const Match = require('../models/Match');
const sendNotification = require('../services/notificationService'); // 알림 기능 추가

// 사용자 매칭 추천 로직
exports.getMatchedUsers = async (req, res) => {
  try {
    const currentUser = req.user; // JWT 인증으로부터 가져온 사용자 정보
    const matches = await Match.find({ userId1: currentUser._id, matchPercentage: { $gt: 50 } })
      .populate('userId2', 'name department profilePicture'); // 프로필 정보 불러오기

    res.json(matches.map(match => match.userId2)); // 매칭된 사용자 반환
  } catch (err) {
    res.status(500).json({ error: '매칭된 사용자 정보를 가져오지 못했습니다.' });
  }
};

// 사용자 정보 조회
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // 비밀번호 제외하고 정보 반환
    if (!user) return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: '사용자 정보를 가져오는 데 실패했습니다.' });
  }
};

// 매칭 요청
exports.sendMatchRequest = async (req, res) => {
  const { userId } = req.body; // 매칭 요청을 보낼 사용자 ID
  try {
    // 매칭 요청 처리 로직 (필요한 경우 매칭 데이터 생성)
    const currentUser = req.user; // 현재 사용자 정보
    const matchExists = await Match.findOne({ userId1: currentUser._id, userId2: userId });

    if (!matchExists) {
      // 새로운 매칭 요청 생성
      await Match.create({
        userId1: currentUser._id,
        userId2: userId,
        matchPercentage: 60 // 임의의 매칭 퍼센티지
      });

      // 매칭 요청 받은 사용자에게 알림 전송
      await sendNotification(userId, `${currentUser.name}님이 매칭을 요청했습니다.`);
    }

    res.status(200).json({ message: '매칭 요청 성공 및 알림 전송' });
  } catch (err) {
    res.status(500).json({ error: '매칭 요청 실패' });
  }
};
