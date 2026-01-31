// --- FIREBASE IMPORT ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "wifist-d3588"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- KONFIGURASI TAHAPAN (RAMAH ANAK) ---
const MODES = {
    child: {
        name: "Si Kecil (7-10 Tahun)",
        steps: [
            { id: 1, title: "01. Identitas Kamu", fields: [
                { id: "inputNama", label: "Nama Panggilan Kamu", type: "text", placeholder: "Contoh: Budi", validate: "min3" },
                { id: "inputDOB_Display", label: "Tanggal Lahir", type: "text", readonly: true }
            ]},
            { id: 2, title: "02. Kontak Orang Tua", fields: [
                { id: "noHpOrtu", label: "No. HP Mama/Papa", type: "tel", placeholder: "0812xxxxxxx", validate: "digit10-13" },
                { id: "emailMain", label: "Email Orang Tua", type: "email", placeholder: "contoh@gmail.com", validate: "email" }
            ]},
            { id: 3, title: "03. Kode Akses (Rahasia)", fields: [
                { id: "codeAkses", label: "Buat 6 Digit Kode Ajaib", type: "password", maxlength: 6, validate: "len6" }
            ]},
            { id: 4, title: "04. Persetujuan", type: "final" }
        ]
    },
    teen: {
        name: "Remaja (11-17 Tahun)",
        steps: [
            { id: 1, title: "01. Identitas", fields: [
                { id: "inputNama", label: "Nama Lengkap", type: "text", placeholder: "Nama Panggilan", validate: "min3" },
                { id: "inputDOB_Display", label: "Tanggal Lahir", type: "text", readonly: true }
            ]},
            { id: 2, title: "02. Pendidikan & Kontak", fields: [
                { id: "namaSekolah", label: "Nama Sekolah", type: "text", placeholder: "SD Negeri 1", validate: "min3" },
                { id: "noHpOrtu", label: "No. HP Keluarga", type: "tel", placeholder: "0812xxxxxxx", validate: "digit10-13" }
            ]},
            { id: 3, title: "03. Mau Jadi Apa?", fields: [
                { id: "citaCita", label: "Cita-cita", type: "select", options: ["-- Pilih --", "Pelajar", "Content Creator", "Ilmuwan", "Lainnya"] }
            ]},
            { id: 4, title: "04. Data Diri", fields: [
                { id: "sumberDuit", label: "Duit Saku Dari", type: "select", options: ["-- Pilih --", "Orang Tua", "Hadiah", "Tabungan", "Usaha"] }
            ]},
            { id: 5, title: "05. Kode Keamanan", fields: [
                { id: "codeAkses", label: "6 Digit Kode Ajaib", type: "password", maxlength: 6, validate: "len6" }
            ]},
            { id: 6, title: "06. Selesai", type: "final" }
        ]
    },
    adult: {
        name: "Dewasa (18+ Tahun)",
        steps: [
            { id: 1, title: "01. Data Diri", fields: [
                { id: "inputNama", label: "Nama Lengkap", type: "text", placeholder: "Nama Asli/Fiktif", validate: "min3" },
                { id: "inputDOB_Display", label: "Tanggal Lahir", type: "text", readonly: true }
            ]},
            { id: 2, title: "02. Kontak Utama", fields: [
                { id: "emailMain", label: "Email Anda", type: "email", placeholder: "email@kamu.com", validate: "email" },
                { id: "noHpOrtu", label: "No. HP Anda", type: "tel", placeholder: "0812xxxxxxxx", validate: "digit10-13" }
            ]},
            { id: 3, title: "03. Alamat", fields: [
                { id: "alamatLengkap", label: "Alamat Rumah", type: "text", placeholder: "Jl. Merdeka No. 10...", validate: "min5" }
            ]},
            { id: 4, title: "04. Pekerjaan", fields: [
                { id: "pekerjaan", label: "Pekerjaan Saat Ini", type: "text", placeholder: "Pelajar / Mahasiswa / Karyawan", validate: "min3" }
            ]},
            { id: 5, title: "05. Kode Keamanan", fields: [
                { id: "codeAkses", label: "6 Digit Kode Akses", type: "password", maxlength: 6, validate: "len6" }
            ]},
            { id: 6, title: "06. Selesai", type: "final" }
        ]
    }
};

// --- GLOBAL VARIABLES ---
let currentMode = null; 
let currentStep = 1;
let isFlipLocked = false;
let finalDataReady = null;
let userDOB = ""; 
let sessionToken = ""; 
let formData = {}; 

// --- FUNGSI TAMPILAN ---
window.checkAge = async () => {
    const dd = document.getElementById('dobDD').value;
    const mm = document.getElementById('dobMM').value;
    const yyyy = document.getElementById('dobYYYY').value;

    if(dd.length < 2 || mm.length < 2 || yyyy.length < 4) {
        alert("Mohon isi tanggal lahir dengan lengkap (DD/MM/YYYY).");
        return;
    }

    const dobString = `${yyyy}-${mm}-${dd}`;
    const dob = new Date(dobString);
    
    if(isNaN(dob.getTime())) {
        alert("Format tanggal salah.");
        return;
    }

    userDOB = dobString;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) { age--; }

    // Menentukan mode berdasarkan umur
    if(age >= 7 && age <= 10) currentMode = 'child';
    else if(age >= 11 && age <= 17) currentMode = 'teen';
    else if(age >= 18) currentMode = 'adult';
    else { alert("Maaf, minimal umur pendaftaran adalah 7 tahun."); return; }

    sessionToken = 'USR-' + Math.random().toString(36).substr(2, 12).toUpperCase();

    document.getElementById('step-0').style.display = 'none';
    document.getElementById('wizardContent').style.display = 'block';
    document.getElementById('progressBar-top').style.display = 'block';

    initApp();
};

function initApp() {
    const config = MODES[currentMode];
    const stepTitle = document.getElementById('stepTitle');
    const stepFields = document.getElementById('stepFields');
    
    // Update Title
    const currentStepConfig = config.steps[currentStep - 1];
    stepTitle.innerText = currentStepConfig.title;
    
    // Update Progress Bar
    const totalSteps = config.steps.length;
    const progress = ((currentStep) / totalSteps) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Handle Final Reveal
    if (currentStepConfig.type === 'final') {
        document.getElementById('wizardContent').style.display = 'none';
        document.getElementById('progressBar-top').style.display = 'none';
        document.getElementById('finalStep').style.display = 'block';
        
        // Start Generation
        generateCard();
    } else {
        // Build Fields
        let fieldsHTML = '';
        currentStepConfig.fields.forEach(field => {
            let readonlyAttr = '';
            if (field.readonly) readonlyAttr = 'readonly';
            
            if (field.id === 'inputDOB_Display') {
                fieldsHTML += `
                    <div class="form-field-group">
                        <label>${field.label}</label>
                        <input type="${field.type}" id="${field.id}" value="${userDOB}" ${readonlyAttr} class="custom-input">
                    </div>`;
            } else if (field.type === 'select') {
                let opts = field.options.map(o => {
                    return `<option value="${o}">${o}</option>`;
                }).join('');
                fieldsHTML += `
                    <div class="form-field-group">
                        <label>${field.label}</label>
                        <select id="${field.id}" class="custom-select">
                            <option value="" disabled selected>-- Pilih --</option>
                            ${opts}
                        </select>
                    </div>`;
            } else if (field.type === 'password') {
                 fieldsHTML += `
                    <div class="form-field-group">
                        <label>${field.label}</label>
                        <input type="${field.type}" id="${field.id}" placeholder="${field.placeholder || ''}" maxlength="${field.maxlength}" class="custom-input">
                    </div>`;
            } else {
                 fieldsHTML += `
                    <div class="form-field-group">
                        <label>${field.label}</label>
                        <input type="${field.type}" id="${field.id}" placeholder="${field.placeholder || ''}" class="custom-input">
                    </div>`;
            }
        });

        stepFields.innerHTML = fieldsHTML;

        // Set Button States
        document.getElementById('btnPrev').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
        document.getElementById('btnNext').innerText = currentStep === totalSteps ? "Selesai" : "Lanjut";
    }
}

// --- NAVIGASI ---
window.nextStep = async () => {
    // Validasi Field
    const config = MODES[currentMode];
    const currentStepConfig = config.steps[currentStep - 1];
    
    if (currentStepConfig.fields) {
        for(let field of currentStepConfig.fields) {
            const el = document.getElementById(field.id);
            if(field.validate === "min3" && el.value.length < 3) { alert("Nama harus diisi minimal 3 huruf ya!"); return; }
            if(field.validate === "len6" && el.value.length !== 6) { alert("Kode harus persis 6 digit rahasia!"); return; }
            if(field.validate === "digit10-13") { 
                if(el.value.length < 10 || el.value.length > 13) { alert("No HP kurang tepat!"); return; }
                if(!el.value.startsWith('08')) { alert("Harus pakai prefix 08xx!"); return; }
            }
            if(field.validate === "email" && !el.value.includes('@')) { alert("Email harus ada simbol @ ya!"); return; }
            if(field.validate === "selected" && (el.value === "" || el.value.includes("-- Pilih"))) { alert("Silakan pilih salah satu opsi!"); return; }
        }
    }

    // Simpan Data ke Variable Lokal sementara
    currentStepConfig.fields.forEach(field => {
        if(field.id) formData[field.id] = document.getElementById(field.id).value;
    });

    currentStep++;
    initApp();
};

window.prevStep = () => {
    if(currentStep > 1) {
        currentStep--;
        initApp();
    }
};

// --- GENERASI KARTU ---
async function generateCard() {
    const generateBtn = document.getElementById('btnDownload');
    const flipBtn = document.getElementById('btnFlip');
    const cardNumberDisplay = document.querySelector('.card-number-display');
    const cardNameDisplay = document.querySelector('.card-name-display');
    const cvvDisplay = document.querySelector('.cvv-code-display');
    
    generateBtn.style.display = 'none';
    flipBtn.style.display = 'block';

    // 1. Generate Number Fiktif (Random tapi Pola Indonesia)
    const prefix = "0812"; 
    const mid = Math.floor(10000000 + Math.random() * 90000000).toString();
    const last = Math.floor(1000 + Math.random() * 9000).toString();
    const cardNumber = `${prefix}-${mid}-${last}`;
    
    // Format dengan spasi
    const formattedCardNumber = cardNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
    
    const nama = formData['inputNama'];
    const code = formData['codeAkses'];

    // Animasi Efek "Hack"
    const interval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 9999999999).toString().substring(0, 16);
        cardNumberDisplay.innerText = randomNum;
    }, 50);

    setTimeout(() => {
        clearInterval(interval);
        cardNumberDisplay.innerText = formattedCardNumber;
        cardNameDisplay.innerText = nama.toUpperCase();
        cvvDisplay.innerText = code;
    }, 2500);

    // Simpan ke Firebase
    const userData = {
        mode: currentMode,
        ...formData,
        dob: userDOB,
        created_at: Date.now()
    };

    await set(ref(db, 'registrasi/' + sessionToken), userData);
    
    // Aktifkan Tombol Download
    generateBtn.style.display = 'block';
    generateBtn.innerHTML = '<i class="fas fa-download"></i> Simpan Gambar Kartu';
}

// --- DOWNLOAD & FLIP ---
window.takeScreenshot = () => {
    const area = document.querySelector('.card-preview');
    const btn = document.getElementById('btnDownload');
    
    btn.innerText = "Memproses...";
    
    html2canvas(area, {
        scale: 3, 
        backgroundColor: null, 
        useCORS: true, 
        logging: false 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-Card-${formData['inputNama']}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        btn.innerText = '<i class="fas fa-download"></i> Simpan Gambar Kartu';
    });
};

window.toggleFlip = () => {
    const card = document.querySelector('.card-inner-ref');
    card.classList.toggle('is-flipped');
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // Cek apakah ada parameter URL
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('m'); // child, teen, adult
    
    if (modeParam && ['child', 'teen', 'adult'].includes(modeParam)) {
        currentMode = modeParam;
        document.getElementById('step-0').style.display = 'none';
        document.getElementById('wizardContent').style.display = 'block';
        document.getElementById('progressBar-top').style.display = 'block';
        initApp();
    }
});