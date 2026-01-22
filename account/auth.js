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
    const card = document.getElementById('cardNo').value;
    const cvv = document.getElementById('cvv').value;
    
    try {
        const snap = await get(child(ref(db), `nasabah/${card}`));
        if (snap.exists() && snap.val().cvv === cvv) {
            userData = snap.val();
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
        } else {
            document.getElementById('err1').innerText = "Data kartu atau CVV salah!";
        }
    } catch (e) { alert("Koneksi gagal!"); }
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
    if (currentPin === userData.pin) {
        sessionStorage.setItem('isAuth', 'true');
        sessionStorage.setItem('userCard', userData.nomor_kartu);
        window.location.href = 'main.html';
    } else {
        document.getElementById('err2').innerText = "PIN Salah!";
        clr();
    }
};
