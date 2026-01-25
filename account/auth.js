import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "wifist-d3588"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- AUTO REDIRECT JIKA SUDAH LOGIN ---
if (localStorage.getItem('isAuth') === 'true' && localStorage.getItem('userCard')) {
    window.location.href = 'MyAccount/index.html';
}

let currentPin = "";
let userData = null;

// STEP 1: VERIFIKASI KARTU & CVV
document.getElementById('btnNext').onclick = async () => {
    const cardInput = document.getElementById('cardNo').value.replace(/\s/g, '');
    const cvvInput = document.getElementById('cvv').value.trim();
    const btn = document.getElementById('btnNext');
    const err1 = document.getElementById('err1');
    
    if (cardInput.length < 10 || cvvInput.length < 3) {
        err1.innerText = "Data tidak lengkap!";
        return;
    }

    btn.innerText = "Mengecek...";
    btn.disabled = true;

    try {
        const snap = await get(child(ref(db), `nasabah/${cardInput}`));
        if (snap.exists()) {
            let data = snap.val();
            const dbCvv = data.cvv || data.CVV; 

            if (dbCvv !== undefined && String(dbCvv) === String(cvvInput)) {
                userData = data;
                document.getElementById('step1').classList.add('hidden');
                document.getElementById('step2').classList.remove('hidden');
            } else {
                err1.innerText = "Kode CVV salah!";
            }
        } else {
            err1.innerText = "Nomor kartu tidak terdaftar!";
        }
    } catch (e) { 
        err1.innerText = "Kesalahan koneksi!"; 
    } finally {
        btn.innerText = "Verifikasi Kartu";
        btn.disabled = false;
    }
};

// PIN LOGIC (NUMPAD)
window.press = (num) => {
    if (currentPin.length < 6) {
        currentPin += num;
        updateDots();
    }
};

window.clr = () => {
    currentPin = "";
    updateDots();
};

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        i < currentPin.length ? dot.classList.add('active') : dot.classList.remove('active');
    });
}

// STEP 2: VERIFIKASI PIN & AKTIVASI
document.getElementById('btnPin').onclick = async () => {
    if (!userData) return;
    
    const dbPin = userData.pin || userData.PIN;
    const cardNo = document.getElementById('cardNo').value.replace(/\s/g, '');
    const btnOk = document.getElementById('btnPin');
    
    if (dbPin !== undefined && currentPin === String(dbPin)) {
        btnOk.innerText = "...";
        btnOk.disabled = true;
        
        try {
            // SET STATUS DI DATABASE MENJADI ACTIVE
            await update(ref(db, `nasabah/${cardNo}`), {
                MyAccount: "active",
                lastLogin: new Date().toISOString()
            });

            // SIMPAN DI LOCAL STORAGE
            localStorage.setItem('isAuth', 'true');
            localStorage.setItem('userCard', cardNo);
            
            window.location.href = 'MyAccount/index.html';
        } catch (e) {
            alert("Gagal sinkronisasi keamanan!");
            btnOk.innerText = "OK";
            btnOk.disabled = false;
        }
    } else {
        document.getElementById('err2').innerText = "PIN salah!";
        clr();
    }
};
