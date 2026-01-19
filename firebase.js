// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
  authDomain: "wifist-d3588.firebaseapp.com",
  projectId: "wifist-d3588",
  storageBucket: "wifist-d3588.firebasestorage.app",
  messagingSenderId: "460842291436",
  appId: "1:460842291436:web:f82e6f0c7fc668fc72d5c9"
};

// Inisialisasi Firebase (cek agar tidak inisialisasi dua kali)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global variable agar bisa dipakai di script lain
const db = firebase.firestore();
