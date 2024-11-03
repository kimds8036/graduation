const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // ObjectId 변환을 위해 mongoose 추가
const Notification = require('../models/notificationModel');
const User = require('../models/User'); // User 모델 가져오기
const MatchingRequest = require('../models/MatchingRequest'); // 매칭 요청 모델 가져오기

// 알림 메시지 생성 함수
const generateNotificationMessage = async (notificationType, senderId) => {
    try {
        const sender = await User.findById(senderId);
        if (!sender) {
            throw new Error('해당 사용자를 찾을 수 없습니다.');
        }
        const senderDepartment = sender.department || '알 수 없음';

        switch (notificationType) {
            case 'interest':
                return `${senderDepartment} 학우가 관심을 보냈습니다!`;
            case 'message':
                return `${senderDepartment} 학우에게서 새로운 메시지가 도착했습니다.`;
            case 'send_match_request':
                return `${senderDepartment} 학우에게서 온 매칭요청이 있습니다! `;
            case 'match_accept':
                return `${senderDepartment} 학우가 매칭 요청을 수락했습니다! `;
            case 'match_decline':
                return `${senderDepartment} 학우가 매칭 요청을 거절했습니다! `;
            case 'post_member_join':
                return `게시글 멤버가 결성되었습니다. (학과: ${senderDepartment})`;
            default:
                return '새로운 알림이 있습니다.';
        }
    } catch (error) {
        console.error('Error generating notification message:', error);
        return '새로운 알림이 있습니다.';
    }
};

// 관심 알림 생성
router.post('/send-interest', async (req, res) => {
    try {
        const { senderId, recipientId } = req.body;
        const sender = await User.findById(senderId).select('department name');

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingNotification = await Notification.findOne({
            senderId: new mongoose.Types.ObjectId(senderId),
            recipientId: new mongoose.Types.ObjectId(recipientId),
            notificationType: 'interest',
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingNotification) {
            return res.status(400).json({ error: '이미 관심표시를 한 상대입니다!' });
        }

        const sentCount = await Notification.countDocuments({
            senderId,
            notificationType: 'interest',
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        if (sentCount >= 10) {
            return res.status(400).json({ error: '하루에 10명까지 관심 표시가 가능합니다.' });
        }

        const notification = new Notification({
            senderId: new mongoose.Types.ObjectId(senderId),
            recipientId: new mongoose.Types.ObjectId(recipientId),
            senderDepartment: sender.department,
            notificationType: 'interest',
        });

        await notification.save();
        res.status(201).json({ message: '알림이 성공적으로 전송되었습니다.' });
    } catch (error) {
        console.error('알림 생성 오류:', error);
        res.status(500).json({ error: '알림 전송에 실패했습니다.' });
    }
});

// 수신자의 알림 가져오기
router.get('/:recipientId', async (req, res) => {
    const { recipientId } = req.params;

    try {
        console.log('검색하려는 recipientId:', recipientId);

        const recipientObjectId = new mongoose.Types.ObjectId(recipientId);
        const notifications = await Notification.find({ recipientId: recipientObjectId }).sort({ createdAt: -1 });

        console.log('서버에서 반환된 알림:', notifications);

        // 각 알림에 대해 메시지를 생성
        const notificationsWithMessages = await Promise.all(
            notifications.map(async (notification) => {
                const message = await generateNotificationMessage(notification.notificationType, notification.senderId);
                return {
                    ...notification.toObject(),
                    message, // 생성된 메시지를 추가
                };
            })
        );

        // 생성된 메시지를 포함한 알림 반환
        res.status(200).json(notificationsWithMessages);
    } catch (error) {
        console.error('알림 조회 오류:', error);
        res.status(500).json({ error: '알림을 불러오는 데 실패했습니다.' });
    }
});

// 수신자의 모든 읽지 않은 알림을 읽음 처리
router.put('/mark-all-as-read/:recipientId', async (req, res) => {
    const { recipientId } = req.params;

    try {
        const recipientObjectId = new mongoose.Types.ObjectId(recipientId);
        await Notification.updateMany(
            { recipientId: recipientObjectId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ message: '모든 알림이 읽음 처리되었습니다.' });
    } catch (error) {
        console.error('모든 알림 읽음 처리 오류:', error);
        res.status(500).json({ error: '모든 알림 읽음 처리에 실패했습니다.' });
    }
});

// 매칭 요청 생성
// 매칭 요청 생성
// 매칭 요청 생성
// 매칭 요청 생성
router.post('/send-match-request', async (req, res) => {
    try {
        const { senderId, recipientId, overrideDeclined } = req.body; // overrideDeclined 추가

        // 발신자 정보 확인
        const sender = await User.findById(senderId).select('department name');
        if (!sender) {
            return res.status(400).json({ error: '발신자 정보를 찾을 수 없습니다.' });
        }

        // 기존 매칭 요청 확인
        let existingRequest = await MatchingRequest.findOne({
            $or: [
                { senderId, recipientId },
                { senderId: recipientId, recipientId: senderId }
            ]
        });

        if (existingRequest) {
            if (existingRequest.status === 'accepted') {
                return res.status(400).json({ error: '이미 매칭이 수락된 사용자입니다.' });
            }

            if (existingRequest.status === 'pending') {
                return res.status(400).json({ error: '이미 매칭 요청이 진행 중입니다.' });
            }

            // 거절된 경우
            if (existingRequest.status === 'declined') {
                const oneWeekLater = new Date(existingRequest.declineDate);
                oneWeekLater.setDate(oneWeekLater.getDate() + 7);
                
                if (new Date() < oneWeekLater && !overrideDeclined) {
                    // 1주일이 지나지 않았고, 사용자가 확인을 안 했다면 에러 반환
                    return res.status(400).json({ error: '거절하신 상대입니다. 1주일 뒤 매칭이 가능합니다.' });
                }

                if (overrideDeclined) {
                    // 사용자가 확인 팝업에서 "요청하기"를 선택한 경우, 상태를 `pending`으로 변경
                    existingRequest.status = 'pending';
                    existingRequest.declineDate = undefined; // 이전 거절 날짜 초기화
                    await existingRequest.save();

                    // 알림 메시지 생성
                    const message = await generateNotificationMessage('send_match_request', senderId);

                    // 알림 생성
                    const notification = new Notification({
                        senderId: new mongoose.Types.ObjectId(senderId),
                        recipientId: new mongoose.Types.ObjectId(recipientId),
                        message,
                        notificationType: 'send_match_request',
                    });

                    await notification.save();
                    return res.status(201).json({ message: '매칭 요청이 성공적으로 전송되었습니다.' });
                }
            }
        }

        // 새로운 매칭 요청 생성
        const matchingRequest = new MatchingRequest({
            senderId,
            recipientId,
            status: 'pending',
        });
        await matchingRequest.save();

        // 알림 메시지 생성
        const message = await generateNotificationMessage('send_match_request', senderId);

        // 알림 생성
        const notification = new Notification({
            senderId: new mongoose.Types.ObjectId(senderId),
            recipientId: new mongoose.Types.ObjectId(recipientId),
            message,
            notificationType: 'send_match_request',
        });

        await notification.save();
        res.status(201).json({ message: '매칭 요청이 성공적으로 전송되었습니다.' });
    } catch (error) {
        console.error('매칭 요청 생성 오류:', error);
        res.status(500).json({ error: '매칭 요청 전송에 실패했습니다.' });
    }
});

// 매칭 요청 응답
// 매칭 요청 응답
router.put('/respond-match-request', async (req, res) => {
    try {
        const { senderId, recipientId, status } = req.body;

        // ObjectId로 변환
        const senderObjectId = new mongoose.Types.ObjectId(senderId);
        const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

        // 매칭 요청을 찾음
        const request = await MatchingRequest.findOne({
            senderId: recipientObjectId,  // 바뀌어야 할 부분: senderId는 알림 데이터의 recipientId로 설정
            recipientId: senderObjectId
        });
        

        if (!request) {
            console.error(`매칭 요청을 찾을 수 없습니다. senderId: ${senderId}, recipientId: ${recipientId}`); // 오류 로그 추가
            return res.status(404).json({ error: '해당 매칭 요청을 찾을 수 없습니다.' });
        }

        // 상태 업데이트
        request.status = status;
        if (status === 'declined') {
            request.declineDate = new Date(); // 거절 날짜 업데이트
        }

        await request.save(); // 변경 사항 저장

        // 알림 생성 또는 업데이트
        const notificationMessage = status === 'accepted' ? 
            `${request.senderDepartment} 학우가 매칭 요청을 수락했습니다!` :
            `${request.senderDepartment} 학우가 매칭 요청을 거절했습니다!`;

        const notification = new Notification({
            senderId: senderObjectId,
            recipientId: recipientObjectId,
            message: notificationMessage,
            notificationType: status === 'accepted' ? 'match_accept' : 'match_decline',
        });

        await notification.save(); // 알림 저장

        res.status(200).json({ message: `매칭 요청이 ${status}되었습니다.` });
    } catch (error) {
        console.error('매칭 요청 응답 오류:', error); // 기존 로그
        res.status(500).json({ error: '매칭 요청 처리에 실패했습니다.' });
    }
});



// 매칭 요청 조회
// 매칭 요청 정보 조회 라우트
// 매칭 요청 정보 조회 라우트
// 서버 코드
router.get('/match-request/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;
        console.log(`알림 ID: ${notificationId}를 사용하여 매칭 요청 정보를 조회합니다.`);

        const notification = await Notification.findById(notificationId).populate('senderId', 'name department mbti profileImageUrl');
        
        if (!notification) {
            console.error('해당 알림을 찾을 수 없습니다.');
            return res.status(404).json({ error: '해당 알림을 찾을 수 없습니다.' });
        }

        const request = await MatchingRequest.findOne({
            senderId: notification.senderId._id,
            recipientId: notification.recipientId
        });

        if (!request) {
            return res.status(404).json({ error: '해당 매칭 요청을 찾을 수 없습니다. 이전 요청이 만료되었을 수 있습니다.' });
        }

        let message = '';
        if (request.status === 'declined') {
            const oneWeekLater = new Date(request.declineDate);
            oneWeekLater.setDate(oneWeekLater.getDate() + 7);

            if (new Date() < oneWeekLater) {
                return res.status(400).json({ error: '거절된 요청입니다. 1주일 후에 다시 매칭을 시도할 수 있습니다.' });
            }
            message = '이제 매칭 요청을 다시 시도할 수 있습니다.';
        } else if (request.status === 'accepted') {
            return res.status(400).json({ error: '이미 매칭된 사용자입니다. 이 매칭 요청은 만료되었습니다.' });
        }

        res.status(200).json({
            _id: notification.senderId._id,
            name: notification.senderId.name,
            department: notification.senderId.department,
            mbti: notification.senderId.mbti,
            profileImageUrl: notification.senderId.profileImageUrl,
            status: request.status,
            message
        });
    } catch (error) {
        console.error('매칭 요청 정보 조회 오류:', error);
        res.status(500).json({ error: '매칭 요청 정보를 가져오는 데 오류가 발생했습니다.' });
    }
});



module.exports = router;
