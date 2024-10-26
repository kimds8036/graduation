const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();  // .env 파일 로드

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(
    path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS || './graduate-aee1b-firebase-adminsdk-sbmkl-7dad473f04.json')
  ),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'graduate-aee1b.appspot.com',
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
