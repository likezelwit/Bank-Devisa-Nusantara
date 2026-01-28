// --- FIREBASE IMPORT ---
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

// --- KONFIGURASI TAHAPAN ---
const MODES = {
    child: {
        name: "Anak (7-10 Tahun)",
        steps: [
            { id: 1, title: "01. Identitas Anak", fields: [
                { id: "inputNama", label: "Nama Lengkap", type: "text", placeholder: "NAMA LENGKAP", validate: "min3" },
                { id: "inputDOB_Display", label: "Tanggal Lahir", type: "text", readonly: true }
            ]},
            { id: 2, title: "02. Cita-Cita", fields: [
                { id: "jobType", label: "Cita-cita", type: "select", options: ["-- Pilih --", "Pelajar", "Dokter", "Pilot", "Ilmuwan", "Polisi", "Lainnya"] }
            ]},
            { id: 3, title: "03. Data Wali", fields: [
                { id: "waliName", label: "Nama Orang Tua/Wali", type: "text", placeholder: "Nama Wali", validate: "min3" },
                { id: "inputWA", label: "WhatsApp Wali", type: "tel", placeholder: "08xxxxxxxxxx", validate: "digit11-13" }
            ]},
            { id: 4, title: "04. Keamanan", fields: [
                { id: "inputPW", label: "6 Digit PIN", type: "password", maxlength: 6, validate: "len6" }
            ]},
            { id: 5, title: "05. Janji Nasabah", fields: [
                { id: "checkAgree", label: "Saya Janji Rajin Menabung", type: "checkbox", validate: "checked" }
            ]},
            { id: 6, title: "06. Lokasi", fields: [
                { id: "countrySelect", label: "Negara Domisili", type: "select", options: ["-- Pilih --", "Indonesia (IDR)", "Amerika Serikat (USD)", "Inggris (GBP)"], validate: "selected" }
            ]},
            { id: 7, title: "Finalisasi", isFinal: true }
        ]
    },
    teen: {
        name: "Remaja (11-17 Tahun)",
        steps: [
            { id: 1, title: "01. Identitas", fields: [
                { id: "inputNama", label: "Nama Lengkap", type: "text", placeholder: "NAMA ANDA", validate: "min3" },
                { id: "inputDOB_Display", label: "Tanggal Lahir", type: "text", readonly: true }
            ]},
            { id: 2, title: "02. Kontak", fields: [
                { id: "inputWA", label: "WhatsApp", type: "tel", placeholder: "08xxxxxxxxxx", validate: "digit11-13" },
                { id: "inputEmail", label: "Email", type: "email", placeholder: "nama@email.com", validate: "email" }
            ]},
            { id: 3, title: "03. Pendidikan", fields: [
                { id: "jobType", label: "Nama Sekolah", type: "text", placeholder: "SMA Negeri 1", validate: "min3" }
            ]},
            { id: 4, title: "04. Finansial", fields: [
                { id: "incomeSource", label: "Sumber Uang Saku", type: "select", options: ["-- Pilih --", "Orang Tua", "Hadiah", "Part Time", "Lainnya"], validate: "selected" }
            ]},
            { id: 5, title: "05. Kontak Darurat", fields: [
                { id: "emName", label: "Nama Penanggung Jawab", type: "text", placeholder: "Nama Orang Tua", validate: "min3" },
                { id: "emPhone", label: "No. HP Darurat", type: "tel", placeholder: "08xxxxxxxxxx", validate: "digit10-13" }
            ]},
            { id: 6, title: "06. Keamanan", fields: [
                { id: "inputPW", label: "6 Digit PIN", type: "password", maxlength: 6, validate: "len6" }
            ]},
            { id: 7, title: "07. Analisis Data", type: "loading", msg: "Menghubungkan ke Database Sekolah..." },
            { id: 8, title: "08. Konfirmasi", fields: [
                { id: "checkAgree", label: "Saya bertanggung jawab", type: "checkbox", validate: "checked" }
            ]},
            { id: 9, title: "09. Legalitas", fields: [
                { id: "checkLegal", label: "Setuju Syarat & Ketentuan", type: "checkbox", validate: "checked" }
            ]},
            { id: 10, title: "10. Lokasi", fields: [
                { id: "countrySelect", label: "Negara Domisili", type: "select", options: ["-- Pilih --", "Indonesia (IDR)", "Amerika Serikat (USD)", "Inggris (GBP)"], validate: "selected" }
            ]},
            { id: 11, title: "Finalisasi", isFinal: true }
        ]
    },
    adult: {
        name: "Dewasa (18+ Tahun)",
        steps: [
            { id: 1, title: "01. Identitas", fields: [
                { id: "inputNama", label: "Nama Lengkap KTP", type: "text", placeholder: "NAMA LENGKAP", validate: "min3" },
                { id: "inputDOB_Display", label: "Tanggal Lahir", type: "text", readonly: true }
            ]},
            { id: 2, title: "02. Kontak Utama", fields: [
                { id: "inputWA", label: "WhatsApp", type: "tel", placeholder: "08xxxxxxxxxx", validate: "digit11-13" },
                { id: "inputEmail", label: "Email", type: "email", placeholder: "nama@email.com", validate: "email" }
            ]},
            { id: 3, title: "03. Domisili", fields: [
                { id: "address", label: "Alamat Lengkap", type: "text", placeholder: "Jalan, No Rumah...", validate: "min5" }
            ]},
            { id: 4, title: "04. Profesi", fields: [
                { id: "jobType", label: "Pekerjaan", type: "text", placeholder: "Posisi & Perusahaan", validate: "min3" }
            ]},
            { id: 5, title: "05. Pendapatan", fields: [
                { id: "income", label: "Penghasilan Bulanan", type: "tel", placeholder: "Contoh: 10000000", validate: "digit" }
            ]},
            { id: 6, title: "06. Sumber Dana", fields: [
                { id: "incomeSource", label: "Sumber Dana", type: "select", options: ["-- Pilih --", "Gaji", "Usaha", "Investasi", "Warisan"], validate: "selected" }
            ]},
            { id: 7, title: "07. Tujuan Akun", fields: [
                { id: "accPurpose", label: "Tujuan Pembukaan", type: "select", options: ["-- Pilih --", "Transaksi", "Tabungan", "Bisnis"], validate: "selected" }
            ]},
            { id: 8, title: "08. Kontak Darurat", fields: [
                { id: "emName", label: "Nama Darurat", type: "text", validate: "min3" },
                { id: "emRelation", label: "Hubungan", type: "text", placeholder: "Keluarga", validate: "min3" }
            ]},
            { id: 9, title: "09. Keamanan 1", fields: [
                { id: "inputPW", label: "6 Digit PIN", type: "password", maxlength: 6, validate: "len6" }
            ]},
            { id: 10, title: "10. Keamanan 2", fields: [
                { id: "secQuestion", label: "Pertanyaan Rahasia", type: "text", placeholder: "Nama Ibu Kandung?", validate: "min3" }
            ]},
            { id: 11, title: "11. Background Check", type: "loading", msg: "Melakukan Sinkronisasi Database..." },
            { id: 12, title: "12. BI Checking", type: "loading", msg: "Analisis SLIK & Skor Kredit..." },
            { id: 13, title: "13. Konfirmasi", fields: [
                { id: "checkAgree", label: "Saya menyatakan data benar", type: "checkbox", validate: "checked" }
            ]},
            { id: 14, title: "14. Kepatuhan", fields: [
                { id: "checkCompliance", label: "Setujui Kebijakan AML", type: "checkbox", validate: "checked" }
            ]},
            { id: 15, title: "15. Lokasi", fields: [
                { id: "countrySelect", label: "Negara Domisili", type: "select", options: ["-- Pilih --", "Indonesia (IDR)", "Amerika Serikat (USD)", "Inggris (GBP)", "Singapura (SGD)", "Jepang (JPY)"], validate: "selected" }
            ]},
            { id: 16, title: "Finalisasi", isFinal: true }
        ]
    }
};

// --- GLOBAL VARIABLES ---
let currentMode = null; 
let currentStep = 1;
let isFlipLocked = false;
let finalDataReady = null;
let userDOB = ""; 

// --- AGE GATE LOGIC ---
window.checkAge = () => {
    const dobInput = document.getElementById('inputDOB').value;
    if(!dobInput) { alert("Harap pilih tanggal lahir!"); return; }
    
    userDOB = dobInput;
    const dob = new Date(dobInput);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) { age--; }

    if(age < 7) { alert("Maaf, usia minimal 7 tahun."); return; }
    
    // Tentukan Mode
    if(age >= 7 && age <= 10) currentMode = 'child';
    else if(age >= 11 && age <= 17) currentMode = 'teen';
    else currentMode = 'adult';

    document.getElementById('ageGate').style.display = 'none';
    document.getElementById('progressContainer').style.display = 'flex';
    initApp();
};

function initApp() {
    const config = MODES[currentMode];
    const formContent = document.getElementById('formContent');
    const circleWrapper = document.getElementById('circleWrapper');
    
    // 1. Build Progress Circles
    circleWrapper.innerHTML = '';
    for(let i=1; i<=config.steps.length; i++) {
        const c = document.createElement('div');
        c.className = 'circle';
        c.id = `circle-${i}`;
        c.innerText = i;
        circleWrapper.appendChild(c);
    }

    // 2. Build Steps HTML
    formContent.innerHTML = '';
    config.steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.id = `step${index + 1}`;
        
        if (step.isFinal) {
            // Clone Template
            const template = document.getElementById('finalStepTemplate');
            stepDiv.innerHTML = template.innerHTML;
            
            // SETUP LISTENERS KHUSUS UNTUK FINAL STEP
            const btnDownload = stepDiv.querySelector('.btn-download');
            const btnFlip = stepDiv.querySelector('.btn-flip-action');
            
            if(btnDownload) btnDownload.onclick = () => takeScreenshot(stepDiv);
            if(btnFlip) btnFlip.onclick = () => toggleFlip(stepDiv);
            
        } else if (step.type === 'loading') {
            // ID unik untuk elemen loading
            const loadId = `load-${step.id}`;
            const btnId = `btn-${step.id}`;
            const errId = `err-${step.id}`;

            stepDiv.innerHTML = `
                <h2>${step.title}</h2>
                <div class="loading-box">
                    <div class="spinner-large"></div>
                    <p id="${loadId}">${step.msg}</p>
                </div>
                <div id="${errId}" style="display:none; margin-top:15px;">
                    <button class="btn-alt" onclick="window.prevStep()">Perbaiki Data</button>
                </div>
                <button class="btn-primary" id="${btnId}" style="display:none" onclick="window.nextStep(${index + 2})">Lanjutkan</button>
            `;

            // Simpan referensi tombol ke dalam elemen step untuk diakses nanti
            stepDiv.dataset.nextBtnId = btnId;
            stepDiv.dataset.loadMsgId = loadId;
            stepDiv.dataset.errId = errId;
            
        } else {
            // Standard Form Step
            let fieldsHTML = '';
            step.fields.forEach(field => {
                let readonlyAttr = field.readonly ? 'readonly' : '';
                let valueAttr = field.id === 'inputDOB_Display' ? `value="${userDOB}"` : '';
                
                if(field.type === 'select') {
                    let opts = field.options.map(o => `<option value="${o}">${o}</option>`).join('');
                    fieldsHTML += `
                        <div class="input-group">
                            <label>${field.label}</label>
                            <select id="${field.id}" ${readonlyAttr}>${opts}</select>
                        </div>`;
                } else if (field.type === 'checkbox') {
                    fieldsHTML += `
                        <div class="agreement-box" style="text-align:left; margin-bottom:15px;">
                            <label class="check-label" style="display:flex; align-items:center; font-size:0.8rem; cursor:pointer;">
                                <input type="checkbox" id="${field.id}" style="width:20px; height:20px; margin-right:10px;"> 
                                ${field.label}
                            </label>
                        </div>`;
                } else {
                    fieldsHTML += `
                        <div class="input-group">
                            <label>${field.label}</label>
                            <input type="${field.type}" id="${field.id}" placeholder="${field.placeholder || ''}" ${valueAttr} ${readonlyAttr} ${field.maxlength ? `maxlength="${field.maxlength}"` : ''}>
                        </div>`;
                }
            });

            stepDiv.innerHTML = `
                <h2>${step.title}</h2>
                ${fieldsHTML}
                <div class="nav-buttons-split">
                    <button class="btn-primary btn-alt" onclick="window.prevStep()">< Kembali</button>
                    <button class="btn-primary" onclick="window.nextStep(${index + 2})">Lanjutkan</button>
                </div>
            `;
        }
        formContent.appendChild(stepDiv);
    });

    // Setup Input Listeners
    setupInputListeners();
    updateUI(1);
}

function setupInputListeners() {
    const nama = document.getElementById('inputNama');
    if(nama) nama.addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, ""));
    
    const nums = ['inputNIK', 'inputWA', 'inputPW', 'income', 'emPhone'];
    nums.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', (e) => e.target.value = e.target.value.replace(/[^0-9]/g, ""));
    });
}

// --- NAVIGATION LOGIC ---
window.nextStep = async (targetStep) => {
    // Jika berpindah maju, validasi dulu
    if(targetStep > currentStep) {
        const isValid = await validateFields(currentStep);
        if(!isValid) return;
        
        // CEK KHUSUS: Apakah langkah SELANJUTNYA adalah Loading?
        const nextStepConfig = MODES[currentMode].steps[targetStep - 1]; // index 0-based
        
        if(nextStepConfig.type === 'loading') {
            // Kita pindah UI ke loading page
            currentStep = targetStep;
            updateUI(currentStep);
            // Jalankan simulasi loading
            runLoadingSimulation(currentStep);
            return; // STOP di sini
        }
    }
    
    // Pindah Normal
    currentStep = targetStep;
    updateUI(targetStep);

    // HANYA jalankan startSecureValidation jika ini adalah Step Terakhir (isFinal)
    if(currentStep === MODES[currentMode].steps.length) {
        startSecureValidation();
    }
};

window.prevStep = () => {
    if(currentStep > 1) {
        currentStep--;
        updateUI(currentStep);
    }
};

function updateUI(s) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    const activeStep = document.getElementById(`step${s}`);
    if(activeStep) {
        activeStep.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const totalSteps = MODES[currentMode].steps.length;
    const percent = totalSteps > 1 ? ((s - 1) / (totalSteps - 1)) * 100 : 100;
    document.getElementById('progressLine').style.width = percent + "%";

    document.querySelectorAll('.circle').forEach((c, i) => {
        c.classList.remove('active', 'completed');
        if (i < s - 1) { c.classList.add('completed'); c.innerHTML = "✓"; }
        else if (i === s - 1) { c.classList.add('active'); c.innerHTML = i + 1; }
        else { c.innerHTML = i + 1; }
    });
}

// --- VALIDATION LOGIC ---
async function validateFields(stepIndex) {
    const stepConfig = MODES[currentMode].steps[stepIndex - 1];
    if(!stepConfig.fields) return true;

    for(let field of stepConfig.fields) {
        const el = document.getElementById(field.id);
        if(!el) continue;
        let val = el.value.trim();

        if(field.validate === "min3") {
            if(val.length < 3) { alert(`${field.label} minimal 3 karakter!`); return false; }
        }
        if(field.validate === "min5") {
            if(val.length < 5) { alert(`${field.label} terlalu singkat!`); return false; }
        }
        if(field.validate === "len6") {
            if(val.length !== 6) { alert(`${field.label} harus 6 digit!`); return false; }
        }
        if(field.validate === "digit11-13") {
            if(val.length < 11 || val.length > 13) { alert(`${field.label} harus 11-13 digit!`); return false; }
        }
        if(field.validate === "digit10-13") {
            if(val.length < 10 || val.length > 13) { alert(`${field.label} tidak valid!`); return false; }
        }
        if(field.validate === "digit") {
            if(!/^\d+$/.test(val) || val.length === 0) { alert(`${field.label} harus angka!`); return false; }
        }
        if(field.validate === "email") {
            if(!val.includes('@') || !val.includes('.')) { alert(`Email tidak valid!`); return false; }
        }
        if(field.validate === "checked") {
            if(!el.checked) { alert(`Harap centang "${field.label}"!`); return false; }
        }
        if(field.validate === "selected") {
            if(val === "" || val.includes("-- Pilih")) { alert(`Harap pilih ${field.label}!`); return false; }
        }
        
        if(field.id === 'inputNama') {
            if(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/.test(val)) {
                alert("Nama tidak boleh mengandung angka atau simbol!");
                return false;
            }
        }
    }
    return true;
}

// --- LOADING SIMULATION ---
function runLoadingSimulation(stepIndex) {
    const stepDiv = document.getElementById(`step${stepIndex}`);
    const statusEl = document.getElementById(stepDiv.dataset.loadMsgId);
    const btnNext = document.getElementById(stepDiv.dataset.nextBtnId);
    const errAct = document.getElementById(stepDiv.dataset.errId);
    
    statusEl.innerText = "Menganalisis data...";
    
    setTimeout(() => {
        const isSuccess = Math.random() > 0.1; 
        if(isSuccess) {
            statusEl.innerHTML = `<b style="color:#22c55e">VERIFIED [OK]</b>`;
            btnNext.style.display = "flex";
        } else {
            statusEl.innerHTML = `<b style="color:red">CONNECTION FAILED</b>`;
            errAct.style.display = "block";
        }
    }, 2000);
}

// --- FINAL GENERATION LOGIC ---
async function startSecureValidation() {
    const activeStepDiv = document.getElementById(`step${currentStep}`);
    const timerDisplay = activeStepDiv.querySelector('.timer-display');
    const processingArea = activeStepDiv.querySelector('.processing-area');
    
    let timeLeft = 120;

    try {
        timerDisplay.innerText = "Memulai sinkronisasi data...";
        
        // Validasi Nama
        if(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/.test(document.getElementById('inputNama').value)) {
            throw new Error("Data Nama Tidak Valid.");
        }

        // Generate No Kartu
        const prefix = "0810";
        let isUnique = false;
        let generatedNo = "";
        
        const snapshot = await get(child(ref(db), 'nasabah'));
        const dbData = snapshot.exists() ? snapshot.val() : {};

        while (!isUnique) {
            const mid = Math.floor(10000000 + Math.random() * 90000000).toString();
            const last = Math.floor(1000 + Math.random() * 9000).toString();
            generatedNo = prefix + mid + last;
            if (!dbData[generatedNo]) { isUnique = true; }
        }

        finalDataReady = {
            cardNo: generatedNo,
            cvv: Math.floor(Math.random() * 899 + 100)
        };

    } catch (err) {
        alert("Gagal memproses: " + err.message);
        window.location.reload();
        return;
    }

    const countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft > 90) timerDisplay.innerText = `Menghubungkan ke Server Pusat... (${timeLeft}s)`;
        else if (timeLeft > 60) timerDisplay.innerText = `Memverifikasi Identitas & BI Checking... (${timeLeft}s)`;
        else if (timeLeft > 30) timerDisplay.innerText = `Menyusun Kunci Enkripsi Kartu... (${timeLeft}s)`;
        else timerDisplay.innerText = `Finalisasi Pencetakan Digital... (${timeLeft}s)`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            finalRevealProcess(activeStepDiv);
        }
    }, 1000);
}

async function finalRevealProcess(stepDiv) {
    const processingArea = stepDiv.querySelector('.processing-area');
    const finalReveal = stepDiv.querySelector('.final-reveal');
    
    processingArea.style.display = 'none';
    finalReveal.style.display = 'block';
    stepDiv.querySelector('.card-scene').classList.add('final-glow');

    const { cardNo, cvv } = finalDataReady;
    const cardFormatted = cardNo.match(/.{1,4}/g).join(" ");
    
    // Ambil data dari form
    const nama = document.getElementById('inputNama').value;
    const countryRaw = document.getElementById('countrySelect')?.value || "Indonesia (IDR)";
    const pin = document.getElementById('inputPW')?.value || "000000";
    
    // --- KONVERSI NEGARA KE KODE (ID, US, GB, SG, JP) ---
    let countryCode = "ID"; // Default
    if (countryRaw.includes("Indonesia")) countryCode = "ID";
    else if (countryRaw.includes("Amerika")) countryCode = "US";
    else if (countryRaw.includes("Inggris")) countryCode = "GB";
    else if (countryRaw.includes("Singapura")) countryCode = "SG";
    else if (countryRaw.includes("Jepang")) countryCode = "JP";

    // Update UI Kartu
    stepDiv.querySelector('.display-no').innerText = cardFormatted;
    stepDiv.querySelector('.display-name').innerText = nama;
    stepDiv.querySelector('.cvv-display').innerText = cvv;

    // Generate ID Unik
    const uniqueNasabahId = 'NAS-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // --- KONSTRUKSI DATA FIREBASE ---
    const nasabahData = {
        activeVariant: "Platinum",     
        cardStatus: "Active",           
        CodeQR: "",                     
        MyAccount: "active",            
        created_at: new Date().toISOString(), 
        
        nasabah_id: uniqueNasabahId,
        nama: nama,
        cardNo: cardNo,
        cvv: cvv,
        dob: userDOB,
        pin: pin,
        country: countryCode, // SIMPAN KODE NEGARA (ID, US, dll)
        
        // Logika saldo tetap berdasarkan nama negara asli
        saldo: countryRaw === 'Indonesia (IDR)' ? 100000 : 10,
        
        tgl_daftar: new Date().toISOString()
    };

    // TAMBAHAN: Cari dan masukkan field lain
    const fieldsToCheck = [
        'inputWA', 'inputEmail', 'jobType', 'income', 'incomeSource', 
        'accPurpose', 'waliName', 'emName', 'emRelation', 'emPhone', 'address', 'secQuestion'
    ];

    fieldsToCheck.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value && el.value.trim() !== "") {
            if(id === 'inputWA') nasabahData.noHp = el.value;
            else if(id === 'inputEmail') nasabahData.email = el.value;
            else if(id === 'jobType') nasabahData.pekerjaan = el.value;
            else if(id === 'income') nasabahData.pendapatan = el.value;
            else if(id === 'incomeSource') nasabahData.sumberDana = el.value;
            else if(id === 'accPurpose') nasabahData.tujuanAkun = el.value;
            else if(id === 'waliName') nasabahData.namaWali = el.value;
            else if(id === 'emName') nasabahData.kontakDarurat = el.value;
            else if(id === 'emRelation') nasabahData.hubunganDarurat = el.value;
            else if(id === 'emPhone') nasabahData.noHpDarurat = el.value;
            else if(id === 'address') nasabahData.alamat = el.value;
            else if(id === 'secQuestion') nasabahData.pertanyaanRahasia = el.value;
        }
    });

    try {
        // Simpan ke Firebase
        await set(ref(db, 'nasabah/' + cardNo), nasabahData);
        
        sessionStorage.setItem('userCard', cardNo);
        sessionStorage.setItem('isAuth', 'true');
    } catch (e) { 
        console.error(e);
        alert("Koneksi terputus saat menyimpan!");
    }

    // --- PERBAIKAN: PANGGIL FUNGSI RASIO DEFAULT SAAT PERTAMA KALI MUNCUL ---
    // Ini memastikan ukuran font belakang kartu (CVV) benar saat muncul pertama kali
    // Default ID-1
    changeCardRatio('ID-1', 1.586, '85.60 × 53.98 mm');

    // Animasi Reveal
    const revs = stepDiv.querySelectorAll('.reveal-text');
    for(let i=0; i<revs.length; i++) {
        await new Promise(r => setTimeout(r, 600));
        revs[i].classList.add('show');
    }
}

// --- FITUR BARU: RASIO KARTU ---
window.changeCardRatio = (type, ratio, dimensionText) => {
    const cardScene = document.getElementById('cardScene');
    const ratioInfo = document.getElementById('ratioInfo');
    const buttons = document.querySelectorAll('.btn-ratio');

    // 1. Update UI Buttons
    if (event && event.target) {
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    // 2. Update Text Dimensi
    if(ratioInfo) ratioInfo.innerText = `Dimensi Fisik: ${dimensionText}`;

    // 3. Set atribut data-ratio agar CSS max-width berubah (CR-90/100 jadi besar)
    if(cardScene) {
        cardScene.style.aspectRatio = `${ratio} / 1`;
        cardScene.setAttribute('data-ratio', type);
    }

    // Minimalisir Text: Sesuaikan font size agar proporsional
    const baseRatio = 1.586;
    let scaleFactor = 1;

    if (ratio < baseRatio) {
        // Kotak (CR-90, CR-100) -> Area lebih tinggi/lebar, text bisa sedikit membesar agar terisi penuh
        scaleFactor = 1.1; 
    } else {
        // Gepeng (CR-79) -> Text harus mengecil sedikit biar muut
        scaleFactor = 0.95;
    }
    
    // Terapkan ke elemen kartu dalam stepDiv aktif
    const activeStepDiv = document.getElementById(`step${currentStep}`);
    if(activeStepDiv) {
        // --- DEPAN ---
        const cardNumber = activeStepDiv.querySelector('.card-number');
        const nameDisplay = activeStepDiv.querySelector('.name-display');
        const bankName = activeStepDiv.querySelector('.bank-name');
        
        if(cardNumber) cardNumber.style.fontSize = `${1.3 * scaleFactor}rem`;
        if(nameDisplay) nameDisplay.style.fontSize = `${0.9 * scaleFactor}rem`; 
        if(bankName) bankName.style.fontSize = `${0.7 * scaleFactor}rem`;

        // --- BELAKANG (CVV, TERMS) ---
        // Kita override style inline CSS dari file .css agar mengikuti rasio
        const cvvLabel = activeStepDiv.querySelector('.cvv-area span'); // Label "CVV"
        const cvvCode = activeStepDiv.querySelector('.cvv-code');
        const cardTerms = activeStepDiv.querySelector('.card-terms');

        if(cvvLabel) cvvLabel.style.fontSize = `${2.0 * scaleFactor}vw`; 
        if(cvvCode) cvvCode.style.fontSize = `${6.0 * scaleFactor}vw`;
        if(cardTerms) cardTerms.style.fontSize = `${7.5 * scaleFactor}px`;
    }
};

// --- UTILITIES ---
window.toggleFlip = (stepDiv) => {
    if (isFlipLocked) { alert("Tunggu 5 detik..."); return; }
    const card = stepDiv.querySelector('.card-inner-ref');
    card.classList.toggle('is-flipped');
    isFlipLocked = true;
    const flipBtn = stepDiv.querySelector('.btn-flip-action');
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

window.takeScreenshot = (stepDiv) => {
    const area = stepDiv.querySelector('.capture-area');
    const btn = stepDiv.querySelector('.btn-download');
    btn.innerText = "MENGUNDUH...";
    
    // Penting: html2canvas akan menangkap rasio CSS saat ini.
    html2canvas(area, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: null,
        logging: false 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-CARD-${document.getElementById('inputNama').value}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        btn.innerText = "📸 SIMPAN GAMBAR KARTU";
    });
};
