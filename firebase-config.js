// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyCl2vegFRzTqHf2gW-trjsSkIF18yE2Xww",
    authDomain: "uploader-file-ff6d0.firebaseapp.com",
    databaseURL: "https://uploader-file-ff6d0-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "uploader-file-ff6d0",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "425001263233",
    appId: "1:425001263233:web:a4bf49f398ec52e4086d80"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database();
