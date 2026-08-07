// js/config.js

// Cấu hình kết nối Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDTQeojG01YfuQEqA5SQNL0UaFB6mMTKVQ",
    authDomain: "quanlytaichinh-2fdb9.firebaseapp.com",
    databaseURL: "https://quanlytaichinh-2fdb9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quanlytaichinh-2fdb9",
    storageBucket: "quanlytaichinh-2fdb9.firebasestorage.app",
    messagingSenderId: "434569527448",
    appId: "1:434569527448:web:a4667beb66a570bcaed0ed"
};

// Khởi tạo ứng dụng Firebase nếu chưa tồn tại
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Khởi tạo các dịch vụ và biến toàn cục dùng chung cho ứng dụng
const db = firebase.database();
const auth = firebase.auth();
let txRef = null;
let catRef = null;
let currentUser = null;