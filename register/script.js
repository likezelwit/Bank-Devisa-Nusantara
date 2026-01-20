import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "wifist-d3588",
    storageBucket: "wifist-d3588.firebasestorage.app",
    messagingSenderId: "460842291436",
    appId: "1:460842291436:web:f82e6f0c7fc668fc72d5c9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentStep = 1;
const totalSteps = 8;

// Jadikan global agar bisa dipanggil dari HTML
window.nextStep = function(s) {
    if (s === 2) {
        if (document.getElementById('inputNama').value.trim().length < 3) return alert("Isi Nama Lengkap!");
        if (document.getElementById('inputNIK').value.length < 16) return alert("NIK 16 digit!");
    } else if (s === 6) {
        if (document.getElementById('inputPW').value.length < 6) return alert("PIN 6 digit!");
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
}

function simulasiAnalisis() {
    const status = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    setTimeout(() => status.innerText = "Sinkronisasi BI-Checking...", 1500);
    setTimeout(() => {
        status.innerHTML = "<b style='color:green'>TERVERIFIKASI</b>";
        btn.style.display = "block";
    }, 3000);
}

document.getElementById('btnGenerate').addEventListener('click', async () => {
    if (!document.getElementById('checkAgree').checked) return alert("Setujui syarat!");
    
    // Generate nomor kartu 16 digit (awalan 0810)
    const fullNo = "0810" + Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    
    updateUI(8);
    startQueue(fullNo);
});

function startQueue(cardNo) {
    let progress = 0;
    const fillBar = document.getElementById('fillBar');
    const qStatus = document.getElementById('queueStatus');

    const interval = setInterval(() => {
        progress += 2;
        fillBar.style.width = progress + "%";
        
        if (progress > 80) qStatus.innerText = "Menerbitkan Kartu...";
        else if (progress > 40) qStatus.innerText = "Enkripsi Data...";

        if (progress >= 100) {
            clearInterval(interval);
            saveToRealtime(cardNo);
        }
    }, 100);
}

async function saveToRealtime(cardNo) {
    const nama = document.getElementById('inputNama').value.toUpperCase();
    const pin = document.getElementById('inputPW').value;

    try {
        // SIMPAN KE REALTIME DATABASE (Folder Nasabah)
        await set(ref(db, 'nasabah/' + cardNo), {
            nama: nama,
            pin: pin,
            saldo: 500000, // Saldo awal otomatis
            cardStatus: "Platinum Active",
            nik: document.getElementById('inputNIK').value
        });

        // Tampilkan ke Kartu
        document.getElementById('displayNo').innerText = cardNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = nama;
        
        revealCard();
    } catch(e) { alert("Gagal Simpan Database!"); }
}

function revealCard() {
    document.getElementById('processingArea').style.display = 'none';
    document.getElementById('finalReveal').style.display = 'block';
    
    setTimeout(() => document.getElementById('rev1').style.opacity = 1, 500);
    setTimeout(() => document.getElementById('rev2').style.opacity = 1, 1000);
    setTimeout(() => {
        document.getElementById('rev3').style.opacity = 1;
        document.getElementById('captureArea').style.opacity = 1;
        document.getElementById('captureArea').style.transform = "scale(1)";
        document.getElementById('btnDownload').style.display = "block";
    }, 1500);
}

window.takeScreenshot = function() {
    html2canvas(document.getElementById('captureArea')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Kartu-BDN.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
