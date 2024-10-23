// firebaseAdmin.js
const admin = require('firebase-admin');

// Firebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),  // 서비스 계정 JSON 파일 경로
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'graduate-aee1b.appspot.com',  // Firebase Storage 버킷
});

// Firebase Storage 버킷 생성
const bucket = admin.storage().bucket();

module.exports = { bucket };
