const express = require('express');
const router = express.Router();
const WritePost = require('../models/WritePost'); // 게시글 모델 import

// 게시글 생성
router.post('/', (req, res) => {
  const newPost = new WritePost(req.body);
  newPost.save()
    .then(() => res.status(201).json({ message: '게시글이 성공적으로 저장되었습니다.' }))
    .catch(err => res.status(400).json({ error: '게시글 저장 중 오류가 발생했습니다.', details: err }));
});

// 게시글 목록 가져오기 - 추천 순 정렬 기능 추가
router.get('/', (req, res) => {
  const sortBy = req.query.sort || 'createdAt';
  const order = req.query.order === 'desc' ? -1 : 1;
  const limit = parseInt(req.query.limit) || 10;

  WritePost.find({})
    .sort({ [sortBy]: order })
    .limit(limit)
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ error: '게시글 목록을 가져오는 중 오류가 발생했습니다.', details: err }));
});

// 게시글 추천/추천 취소
router.post('/:id/recommend', (req, res) => {
  const postId = req.params.id;
  const { isRecommending } = req.body;

  WritePost.findById(postId)
    .then(post => {
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      if (isRecommending) {
        post.recommendations = (post.recommendations || 0) + 1;
      } else if (post.recommendations > 0) {
        post.recommendations -= 1;
      }

      return post.save();
    })
    .then(updatedPost => res.status(200).json(updatedPost))
    .catch(err => res.status(500).json({ error: '추천 상태 업데이트 중 오류가 발생했습니다.', details: err }));
});

// 참여하기 요청 핸들러
router.patch('/:id/join', (req, res) => {
  const postId = req.params.id;

  WritePost.findById(postId)
    .then(post => {
      if (!post) {
        return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      }

      if (post.currentParticipants >= post.numberOfPeople) {
        return res.status(400).json({ error: '모집 인원이 모두 찼습니다.' });
      }

      post.currentParticipants += 1;

      return post.save();
    })
    .then(updatedPost => res.status(200).json(updatedPost))
    .catch(err => res.status(500).json({ error: '참여 상태 업데이트 중 오류가 발생했습니다.', details: err }));
});

module.exports = router;
