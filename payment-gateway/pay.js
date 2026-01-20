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

// Simulasi Data Pembayaran (Misal dikirim lewat URL: ?amount=500000)
const urlParams = new URLSearchParams(window.location.search);
const totalHarga = urlParams.get('amount') || "1250000"; // Default jika tidak ada
document.getElementById('totalAmount').innerText = Number(totalHarga).toLocaleString('id-ID');

const payBtn = document.getElementById('payBtn');
const errorMsg = document.getElementById('errorMessage');

payBtn.addEventListener('click', async () => {
    const accNum = document.getElementById('accNumber').value;
    const pinInput = document.getElementById('accPin').value;

    if(!accNum || !pinInput) {
        showError("Lengkapi nomor rekening dan PIN!");
        return;
    }

    payBtn.innerText = "Memproses...";
    payBtn.disabled = true;

    try {
        const userRef = ref(db, 'nasabah/' + accNum);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            
            // Verifikasi PIN & Saldo
            if (data.pin !== pinInput) {
                showError("PIN Salah!");
            } else if (data.saldo < totalHarga) {
                showError("Saldo Tidak Mencukupi!");
            } else {
                // Proses Potong Saldo
                const saldoBaru = data.saldo - Number(totalHarga);
                await update(userRef, { saldo: saldoBaru });

                // Tampilkan Sukses
                document.getElementById('successModal').style.display = "flex";
                setTimeout(() => {
                    window.location.href = "https://google.com"; // Ganti dengan URL toko asal
                }, 3000);
            }
        } else {
            showError("Nomor Rekening Tidak Ditemukan!");
        }
    } catch (e) {
        showError("Gangguan Koneksi.");
    } finally {
        payBtn.innerText = "Bayar Sekarang";
        payBtn.disabled = false;
    }
});

function showError(msg) {
    errorMsg.innerText = msg;
    errorMsg.style.display = "block";
    setTimeout(() => { errorMsg.style.display = "none"; }, 3000);
}
