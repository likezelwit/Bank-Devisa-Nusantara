// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.x/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.x/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
  authDomain: "wifist-d3588.firebaseapp.com",
  projectId: "wifist-d3588",
  storageBucket: "wifist-d3588.firebasestorage.app",
  messagingSenderId: "460842291436",
  appId: "1:460842291436:web:f82e6f0c7fc668fc72d5c9",
  databaseURL: "https://wifist-d3588-default-rtdb.firebaseio.com" // Tambahkan ini!
};

// Inisialisasi
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export agar bisa dipakai di Checkout & Konfirmasi
export { db };
