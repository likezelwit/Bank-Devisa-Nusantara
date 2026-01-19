// firebase.js (di folder utama)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.12/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.10.12/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.firebaseio.com",
    projectId: "wifist-d3588",
    storageBucket: "wifist-d3588.firebasestorage.app",
    messagingSenderId: "460842291436",
    appId: "1:460842291436:web:f82e6f0c7fc668fc72d5c9"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
