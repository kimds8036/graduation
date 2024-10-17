const fetch = require('node-fetch');

exports.getKakaoAccessToken = async (req, res) => {
  const { code } = req.body; // 클라이언트에서 받은 Authorization Code

  try {
    const response = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&client_id=YOUR_REST_API_KEY&redirect_uri=YOUR_REDIRECT_URI&code=${code}`,
    });

    const json = await response.json();
    const accessToken = json.access_token;

    if (accessToken) {
      // Access Token을 받아온 후, 클라이언트로 전달하거나 세션 처리
      res.status(200).json({ accessToken });
    } else {
      res.status(400).json({ message: 'Failed to get Access Token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
