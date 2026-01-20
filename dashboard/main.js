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

// Ambil nomor rekening dari login (localStorage)
const loggedAcc = localStorage.getItem('nomorKartu') || "88201234";

function checkBalance() {
    const userRef = ref(db, 'nasabah/' + loggedAcc);
    
    // onValue membuat tampilan update otomatis jika saldo berubah di database
    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Format rekening: 8820 1234 5678
            document.getElementById('displayAcc').innerText = loggedAcc.replace(/(.{4})/g, '$1 ').trim();
            
            // Format Rupiah
            const formattedSaldo = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(data.saldo || 0);
            
            document.getElementById('displaySaldo').innerText = formattedSaldo;
        } else {
            document.getElementById('displaySaldo').innerText = "Account Error";
        }
    });
}

checkBalance();
