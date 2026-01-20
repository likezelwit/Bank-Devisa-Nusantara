import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "wifist-d3588",
    storageBucket: "wifist-d3588.firebasestorage.app",
    messagingSenderId: "460842291436",
    appId: "1:460842291436:web:f82e6f0c7fc668fc72d5c9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.setAmount = (val) => {
    document.getElementById('topupAmount').value = val;
}

const processBtn = document.getElementById('processBtn');
const finalConfirm = document.getElementById('finalConfirm');
const pinModal = document.getElementById('pinModal');

processBtn.addEventListener('click', () => {
    const acc = document.getElementById('targetAcc').value;
    const amt = document.getElementById('topupAmount').value;
    if(!acc || !amt) return alert("Lengkapi data!");
    pinModal.style.display = "flex";
});

finalConfirm.addEventListener('click', async () => {
    const acc = document.getElementById('targetAcc').value;
    const amt = Number(document.getElementById('topupAmount').value);
    const pin = document.getElementById('securePin').value;
    const errorDiv = document.getElementById('errorMsg');

    try {
        const userRef = ref(db, 'nasabah/' + acc);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            if(data.pin === pin) {
                const saldoBaru = (data.saldo || 0) + amt;
                await update(userRef, { saldo: saldoBaru });
                
                alert("DEPOSIT BERHASIL! Saldo Anda sekarang: Rp " + saldoBaru.toLocaleString());
                location.reload();
            } else {
                errorDiv.innerText = "PIN Salah!";
            }
        } else {
            errorDiv.innerText = "Rekening tidak ditemukan!";
        }
    } catch (e) {
        errorDiv.innerText = "Error Koneksi.";
    }
});

window.closeModal = () => pinModal.style.display = "none";
