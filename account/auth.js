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

document.getElementById('btnNext').onclick = async () => {
    const cardInput = document.getElementById('cardNo').value.replace(/\s/g, '');
    const cvvInput = document.getElementById('cvv').value.trim();
    const btn = document.getElementById('btnNext');
    const err1 = document.getElementById('err1');
    
    btn.innerText = "Mengecek...";
    btn.disabled = true;

    try {
        const snap = await get(child(ref(db), `nasabah/${cardInput}`));
        
        if (snap.exists()) {
            let data = snap.val();
            
            // DEBUG: Lihat di console (F12) isi data sebenarnya
            console.log("Struktur data dari Firebase:", data);

            // Jika datanya terbungkus ID unik (bertingkat), kita ambil level dalamnya
            if (!data.cvv && typeof data === 'object') {
                const firstKey = Object.keys(data)[0];
                data = data[firstKey];
            }

            // Pengecekan ekstra aman
            const dbCvv = data.cvv || data.CVV; // Cek kedua kemungkinan penulisan

            if (dbCvv !== undefined && dbCvv !== null) {
                if (String(dbCvv) === String(cvvInput)) {
                    userData = data;
                    document.getElementById('step1').classList.add('hidden');
                    document.getElementById('step2').classList.remove('hidden');
                } else {
                    err1.innerText = "Kode CVV salah!";
                }
            } else {
                err1.innerText = "Field 'cvv' tidak ditemukan di database!";
            }
        } else {
            err1.innerText = "Nomor kartu tidak terdaftar!";
        }
    } catch (e) { 
        console.error("Error Detail:", e);
        err1.innerText = "Terjadi kesalahan sistem."; 
    } finally {
        btn.innerText = "Verifikasi Kartu";
        btn.disabled = false;
    }
};

// PIN LOGIC (window agar bisa diakses onclick HTML)
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
    if (!userData) return;
    
    const dbPin = userData.pin || userData.PIN;
    
    if (dbPin !== undefined) {
        if (currentPin === String(dbPin)) {
            sessionStorage.setItem('isAuth', 'true');
            sessionStorage.setItem('userCard', document.getElementById('cardNo').value.replace(/\s/g, ''));
            window.location.href = 'main.html';
        } else {
            document.getElementById('err2').innerText = "PIN salah!";
            clr();
        }
    } else {
        alert("Data PIN tidak ditemukan di database!");
    }
};
