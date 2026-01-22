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
    // .replace(/\s/g, '') berfungsi menghapus spasi jika nasabah copy-paste nomor kartu
    const card = document.getElementById('cardNo').value.replace(/\s/g, '');
    const cvv = document.getElementById('cvv').value;
    const btn = document.getElementById('btnNext');
    const err1 = document.getElementById('err1');
    
    if (card.length < 16) {
        err1.innerText = "Nomor kartu harus 16 digit!";
        return;
    }

    btn.innerText = "Mengecek...";
    btn.disabled = true;

    try {
        const snap = await get(child(ref(db), `nasabah/${card}`));
        
        if (snap.exists()) {
            const data = snap.val();
            
            // PERBAIKAN: Gunakan .toString() karena di Firebase CVV kamu adalah Number
            if (data.cvv.toString() === cvv.toString()) {
                userData = data;
                document.getElementById('step1').classList.add('hidden');
                document.getElementById('step2').classList.remove('hidden');
            } else {
                err1.innerText = "CVV tidak sesuai!";
            }
        } else {
            err1.innerText = "Nomor kartu tidak terdaftar!";
        }
    } catch (e) { 
        console.error(e);
        err1.innerText = "Gagal terhubung ke server."; 
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
        if (i < currentPin.length) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

document.getElementById('btnPin').onclick = () => {
    const err2 = document.getElementById('err2');
    
    // PERBAIKAN: Gunakan .toString() karena di Firebase PIN kamu adalah "000000" (Number)
    if (currentPin === userData.pin.toString()) {
        sessionStorage.setItem('isAuth', 'true');
        // Simpan nomor kartu tanpa spasi untuk query di main.html
        sessionStorage.setItem('userCard', document.getElementById('cardNo').value.replace(/\s/g, ''));
        window.location.href = 'main.html';
    } else {
        err2.innerText = "PIN yang Anda masukkan salah!";
        clr();
    }
};
