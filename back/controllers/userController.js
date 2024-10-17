const User = require('../models/User');
const Match = require('../models/Match');

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
