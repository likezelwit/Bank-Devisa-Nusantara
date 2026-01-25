import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// KONFIGURASI PUSAT (Firebase Lo)
const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "wifist-d3588"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.BDNPay = {
    apiKey: null,

    // 1. Fungsi Inisialisasi
    init: function(key) {
        this.apiKey = key;
        console.log("BDN Gateway Ready dengan Key: " + key);
    },

    // 2. Fungsi Munculin Pop-up Bayar
    openPayment: async function(data) {
        // Cek dulu apakah API Key terdaftar di Firebase lo
        const mSnap = await get(ref(db, `merchants/${this.apiKey}`));
        if (!mSnap.exists()) {
            alert("Error: API Key BDN tidak valid!");
            return;
        }

        const merchant = mSnap.val();

        // Buat Overlay & Pop-up via JS biar praktis
        const overlay = document.createElement('div');
        overlay.id = "bdn-overlay";
        overlay.innerHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;">
                <div style="background:white;padding:30px;border-radius:20px;width:90%;max-width:400px;text-align:center;">
                    <h2 style="margin:0;color:#0f172a;">BDN<span>.</span> PAY</h2>
                    <p style="font-size:14px;color:#64748b;">Membayar ke: <b>${merchant.namaToko}</b></p>
                    <hr style="opacity:0.2">
                    <h3 style="margin:20px 0;">Rp ${data.amount.toLocaleString()}</h3>
                    
                    <input type="text" id="bdn-card" placeholder="Nomor Kartu 0810" style="width:100%;padding:12px;margin-bottom:10px;border-radius:8px;border:1px solid #ddd;">
                    <input type="password" id="bdn-pin" placeholder="PIN 6 Digit" maxlength="6" style="width:100%;padding:12px;margin-bottom:20px;border-radius:8px;border:1px solid #ddd;">
                    
                    <button id="bdn-confirm" style="width:100%;padding:15px;background:#0f172a;color:white;border:none;border-radius:12px;font-weight:bold;cursor:pointer;">Bayar Sekarang</button>
                    <button id="bdn-cancel" style="width:100%;margin-top:10px;background:none;border:none;color:#94a3b8;cursor:pointer;">Batalkan</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Logic Tombol Bayar
        document.getElementById('bdn-confirm').onclick = async () => {
            const cardNo = document.getElementById('bdn-card').value;
            const pin = document.getElementById('bdn-pin').value;
            const btn = document.getElementById('bdn-confirm');

            btn.innerText = "Memproses...";
            btn.disabled = true;

            try {
                const uSnap = await get(ref(db, `nasabah/${cardNo}`));
                if (uSnap.exists()) {
                    const user = uSnap.val();
                    if (String(user.pin) === String(pin) && user.saldo >= data.amount) {
                        // Potong Saldo
                        const saldoBaru = user.saldo - data.amount;
                        await update(ref(db, `nasabah/${cardNo}`), { saldo: saldoBaru });
                        
                        alert("Pembayaran Berhasil!");
                        location.reload(); // Selesai
                    } else {
                        alert("PIN salah atau Saldo kurang!");
                    }
                } else {
                    alert("Kartu tidak ditemukan!");
                }
            } catch (e) {
                alert("Sistem Error!");
            }
            btn.innerText = "Bayar Sekarang";
            btn.disabled = false;
        };

        document.getElementById('bdn-cancel').onclick = () => overlay.remove();
    }
};
