import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "wifist-d3588",
    appId: "1:460842291436:web:f82e6f0c7fc668fc72d5c9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Ambil nomor kartu dari localStorage (didapat saat login)
const loggedAcc = localStorage.getItem('nomorKartu') || "88201234"; 

function fetchUserData() {
    const userRef = ref(db, 'nasabah/' + loggedAcc);
    
    // Gunakan onValue agar saldo terupdate secara otomatis (real-time) tanpa refresh
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Update UI
            document.getElementById('userName').innerText = data.nama || "Nasabah BDN";
            document.getElementById('accNumberDisplay').innerText = "Acc: " + loggedAcc.replace(/(.{4})/g, '$1 ');
            document.getElementById('userBalance').innerText = "Rp " + (data.saldo || 0).toLocaleString('id-ID');
            
            // Update Status Kartu
            if (data.cardStatus === "Active") {
                document.getElementById('activeCardName').innerText = data.activeVariant;
                document.getElementById('cardStatus').innerText = "Status: Terverifikasi";
                document.getElementById('membershipBadge').innerText = "ELITE MEMBER";
                document.getElementById('membershipBadge').style.background = "#b5985a";
            }
        } else {
            alert("Sesi berakhir, silakan login kembali.");
            window.location.href = "../"; 
        }
    });
}

window.logout = () => {
    localStorage.clear();
    window.location.href = "../";
};

fetchUserData();
