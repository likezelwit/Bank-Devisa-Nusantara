import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "wifist-d3588"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentPin = "";
let userData = null;

// STEP 1: VERIFIKASI KARTU & CVV
document.getElementById('btnNext').onclick = async () => {
    const cardInput = document.getElementById('cardNo').value.replace(/\s/g, '');
    const cvvInput = document.getElementById('cvv').value.trim();
    const btn = document.getElementById('btnNext');
    const err1 = document.getElementById('err1');
    
    if (cardInput.length < 16) {
        err1.innerText = "Nomor kartu harus 16 digit!";
        return;
    }

    btn.innerText = "Mengecek...";
    btn.disabled = true;
    err1.innerText = "";

    try {
        const snap = await get(child(ref(db), `nasabah/${cardInput}`));
        
        if (snap.exists()) {
            const data = snap.val();
            
            // Safety Check: Pastikan field cvv ada di Firebase
            if (data.cvv !== undefined && data.cvv !== null) {
                // Konversi keduanya ke string untuk perbandingan aman
                if (data.cvv.toString() === cvvInput.toString()) {
                    userData = data;
                    document.getElementById('step1').classList.add('hidden');
                    document.getElementById('step2').classList.remove('hidden');
                } else {
                    err1.innerText = "Kode CVV salah!";
                }
            } else {
                err1.innerText = "Data CVV tidak ditemukan di akun ini.";
            }
        } else {
            err1.innerText = "Nomor kartu tidak terdaftar!";
        }
    } catch (e) { 
        console.error(e);
        err1.innerText = "Gagal terhubung ke database."; 
    } finally {
        btn.innerText = "Verifikasi Kartu";
        btn.disabled = false;
    }
};

// STEP 2: PIN LOGIC
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

document.getElementById('btnPin').onclick = () => {
    const err2 = document.getElementById('err2');
    
    // Safety Check: Pastikan field pin ada di Firebase
    if (userData && userData.pin !== undefined) {
        if (currentPin === userData.pin.toString()) {
            sessionStorage.setItem('isAuth', 'true');
            sessionStorage.setItem('userCard', document.getElementById('cardNo').value.replace(/\s/g, ''));
            window.location.href = 'main.html';
        } else {
            err2.innerText = "PIN salah!";
            clr();
        }
    } else {
        err2.innerText = "Data PIN tidak ditemukan.";
    }
};
