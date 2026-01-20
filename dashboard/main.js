import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "wifist-d3588",
    appId: "1:460842291436:web:f82e6f0c7fc668fc72d5c9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Pastikan ID ini SAMA PERSIS dengan yang ada di HTML kamu
const checkBtn = document.getElementById('checkBtn');
const cardInput = document.getElementById('cardInput');
const inputView = document.getElementById('inputView');
const resultView = document.getElementById('resultView');

checkBtn.addEventListener('click', async () => {
    const cardNumber = cardInput.value.trim();

    if (!cardNumber) {
        alert("Masukkan nomor kartu!");
        return;
    }

    try {
        const userRef = ref(db, 'nasabah/' + cardNumber);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Format Rupiah
            const formatted = new Intl.NumberFormat('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0
            }).format(data.saldo || 0);

            // Update UI
            document.getElementById('saldoValue').innerText = formatted;
            document.getElementById('ownerName').innerText = data.nama || "Nasabah BDN";

            // Pindah Tampilan
            inputView.style.display = "none";
            resultView.style.display = "block";
        } else {
            alert("Nomor kartu tidak ditemukan!");
        }
    } catch (e) {
        console.error(e);
        alert("Terjadi kesalahan koneksi.");
    }
});

// Pasang fungsi reset ke window agar bisa dipanggil onclick di HTML
window.resetView = () => {
    resultView.style.display = "none";
    inputView.style.display = "block";
    cardInput.value = "";
};
