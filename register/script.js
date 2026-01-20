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

// Tambahkan ke window agar tombol HTML bisa akses
window.nextStep = (s) => {
    if (s === 2) {
        if (document.getElementById('inputNama').value.trim().length < 3) return alert("Isi Nama Lengkap!");
        if (document.getElementById('inputNIK').value.length < 16) return alert("NIK harus 16 digit!");
    } else if (s === 6) {
        if (document.getElementById('inputPW').value.length < 6) return alert("PIN wajib 6 digit!");
    }
    currentStep = s;
    updateUI(s);
    if (s === 6) simulasiAnalisis();
}

function updateUI(s) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + s).classList.add('active');
    const percent = ((s - 1) / 7) * 100;
    document.getElementById('progressLine').style.width = percent + "%";
}

function simulasiAnalisis() {
    const status = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    setTimeout(() => status.innerText = "Sinkronisasi BI-Checking...", 1500);
    setTimeout(() => {
        status.innerHTML = "<b style='color:green'>IDENTITAS TERVERIFIKASI</b>";
        btn.style.display = "block";
    }, 3500);
}

window.generateFinal = async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Setujui pernyataan!");
    
    const btn = document.getElementById('btnGenerate');
    btn.disabled = true;
    btn.innerText = "MENGECEK DATABASE...";

    const nik = document.getElementById('inputNIK').value;
    
    try {
        // Cek duplikat di Realtime Database
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `nasabah`));
        let exists = false;
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let card in data) {
                if (data[card].nik === nik) { exists = true; break; }
            }
        }

        if (exists) {
            alert("NIK Anda sudah terdaftar!");
            location.reload();
        } else {
            updateUI(8);
            runQueue();
        }
    } catch(e) { alert("Error: " + e.message); btn.disabled = false; }
}

function runQueue() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        document.getElementById('fillBar').style.width = progress + "%";
        document.getElementById('timerDisplay').innerText = `Estimasi: ${Math.ceil((100 - progress)/2)} Detik`;

        if (progress >= 100) {
            clearInterval(interval);
            finalRevealProcess();
        }
    }, 100);
}

async function finalRevealProcess() {
    document.getElementById('processingArea').style.display = 'none';
    document.getElementById('finalReveal').style.display = 'block';

    setTimeout(() => document.getElementById('rev1').classList.add('show'), 500);
    setTimeout(() => document.getElementById('rev2').classList.add('show'), 1500);
    setTimeout(() => document.getElementById('rev3').classList.add('show'), 2500);
    
    const cardNo = "0810" + Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    await saveToRealtime(cardNo);

    setTimeout(() => {
        const card = document.getElementById('captureArea');
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
        document.getElementById('btnDownload').style.display = "block";
    }, 3500);
}

async function saveToRealtime(cardNo) {
    const nama = document.getElementById('inputNama').value.toUpperCase();
    try {
        await set(ref(db, 'nasabah/' + cardNo), {
            nama: nama,
            nik: document.getElementById('inputNIK').value,
            pin: document.getElementById('inputPW').value,
            saldo: 50000, // Saldo bonus daftar
            status: "PLATINUM"
        });
        document.getElementById('displayNo').innerText = cardNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = nama;
    } catch(e) { console.error(e); }
}

window.takeScreenshot = () => {
    html2canvas(document.getElementById('captureArea')).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-KARTU.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}
