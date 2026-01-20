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

const checkBtn = document.getElementById('checkBtn');
const cardInput = document.getElementById('cardInput');
const errorMsg = document.getElementById('errorMsg');
const inputView = document.getElementById('inputView');
const resultView = document.getElementById('resultView');

checkBtn.addEventListener('click', async () => {
    const cardNumber = cardInput.value.trim();

    if (cardNumber === "") {
        showError("Nomor kartu tidak boleh kosong!");
        return;
    }

    checkBtn.innerText = "MENCARI...";
    checkBtn.disabled = true;

    try {
        const userRef = ref(db, 'nasabah/' + cardNumber);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Isi Data ke Tampilan Hasil
            document.getElementById('saldoValue').innerText = new Intl.NumberFormat('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0
            }).format(data.saldo || 0);
            
            document.getElementById('ownerName').innerText = data.nama || "Nasabah BDN";

            // Switch View
            inputView.style.display = "none";
            resultView.style.display = "block";
        } else {
            showError("Nomor kartu tidak terdaftar!");
        }
    } catch (e) {
        showError("Koneksi gagal. Coba lagi.");
    } finally {
        checkBtn.innerText = "CEK SALDO SEKARANG";
        checkBtn.disabled = false;
    }
});

function showError(msg) {
    errorMsg.innerText = msg;
    errorMsg.style.display = "block";
    setTimeout(() => { errorMsg.style.display = "none"; }, 3000);
}

window.resetView = () => {
    resultView.style.display = "none";
    inputView.style.display = "block";
    cardInput.value = "";
};
