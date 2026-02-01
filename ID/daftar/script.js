import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- CONFIG ---
const SUPABASE_URL = 'https://ndopnxzbaygohzshqphi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3BueHpiYXlnb2h6c2hxcGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzM4ODQsImV4cCI6MjA3OTMwOTg4NH0.nZC5kOVJeMAtfXlwchokXK4FLtPkPoUrxPQUzrz2C8I';
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- STATE ---
let formData = {};
let currentStep = 0;
const totalSteps = 7;
let countdownInterval;

// --- GLOBAL FUNCTIONS (Attached to window for HTML onclick) ---
window.limitInput = (el, max) => {
    if (el.value.length > max) el.value = el.value.slice(0, max);
}

window.showToast = (msg, isError = false) => {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.innerText = msg;
    toast.style.background = isError ? 'var(--danger)' : 'var(--primary)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

window.selectGender = (val, el) => {
    document.querySelectorAll('.gender-option').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('genderInput').value = val;
}

window.updateCurrency = () => {
    const map = {
        'Indonesia': 'IDR (Rp)',
        'Malaysia': 'MYR (RM)',
        'Singapura': 'SGD ($)',
        'Amerika Serikat': 'USD ($)',
        'Jepang': 'JPY (¥)'
    };
    const country = document.getElementById('countrySelect').value;
    const display = document.getElementById('currencyDisplay');
    if(map[country]) {
        display.innerText = map[country];
        formData.currency = map[country];
    } else {
        display.innerText = '-';
    }
}

window.checkLegal = () => {
    const c1 = document.getElementById('check1').checked;
    const c2 = document.getElementById('check2').checked;
    const c3 = document.getElementById('check3').checked;
    document.getElementById('btnStep6').disabled = !(c1 && c2 && c3);
}

window.closeModal = () => {
    document.getElementById('kidsModal').style.display = 'none';
}

window.flipCard = () => {
    document.getElementById('cardElement').classList.toggle('flipped');
}

// --- CORE LOGIC ---

window.checkAge = () => {
    const dd = document.getElementById('dobDD').value;
    const mm = document.getElementById('dobMM').value;
    const yyyy = document.getElementById('dobYYYY').value;

    if (!dd || !mm || !yyyy || dd.length < 2 || mm.length < 2 || yyyy.length < 4) {
        return showToast("Mohon lengkapi tanggal lahir!", true);
    }

    const dob = new Date(`${yyyy}-${mm}-${dd}`);
    if(isNaN(dob.getTime())) return showToast("Tanggal tidak valid!", true);

    const age = new Date().getFullYear() - dob.getFullYear();
    
    // Simpan data DOB
    formData.dob = `${dd}/${mm}/${yyyy}`;
    formData.age = age;

    if (age < 7) {
        return showToast("Maaf, minimal usia 7 tahun.", true);
    }

    // Setup Progress Dots
    const header = document.getElementById('progressHeader');
    header.innerHTML = '';
    header.classList.remove('hidden');
    for(let i=1; i<=7; i++) {
        const dot = document.createElement('div');
        dot.className = `step-dot ${i===1 ? 'active' : ''}`;
        dot.innerText = i;
        dot.id = `dot-${i}`;
        header.appendChild(dot);
    }

    // Check Kids Mode
    if (age < 17) {
        document.getElementById('kidsModal').style.display = 'flex';
    }

    goToStep(1);
}

window.validateAndNext = (step) => {
    // Validasi per langkah
    if(step === 1) {
        const gender = document.getElementById('genderInput').value;
        const name = document.getElementById('fullName').value;
        const school = document.getElementById('schoolName').value;
        if(!gender || !name || !school) return showToast("Mohon lengkapi semua data!", true);
        formData.gender = gender;
        formData.name = name;
        formData.school = school;
    }
    else if(step === 2) {
        const teacher = document.getElementById('teacherName').value;
        const permit = document.getElementById('teacherPermit').value;
        const purpose = document.getElementById('cardPurpose').value;
        const manager = document.getElementById('cardManager').value;
        if(!teacher || !permit || !purpose || !manager) return showToast("Data belum lengkap!", true);
        formData.teacher = teacher;
        formData.permit = permit;
        formData.purpose = purpose;
        formData.manager = manager;
    }
    else if(step === 3) {
        if(!document.getElementById('countrySelect').value) return showToast("Pilih negara!", true);
        formData.country = document.getElementById('countrySelect').value;
    }
    else if(step === 4) {
        const p1 = document.getElementById('pinInput').value;
        const p2 = document.getElementById('pinConfirm').value;
        if(p1.length !== 6 || p2.length !== 6) return showToast("PIN harus 6 digit!", true);
        if(p1 !== p2) return showToast("Konfirmasi PIN tidak cocok!", true);
        formData.pin = p1;
    }
    else if(step === 6) {
        // Legal check handled by button disabled state
    }

    goToStep(step + 1);
}

function goToStep(stepIndex) {
    // Hide current
    document.querySelector('.wizard-step.active').classList.remove('active');
    
    // Update Progress Dots
    document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active', 'completed'));
    for(let i=1; i<stepIndex; i++) {
        document.getElementById(`dot-${i}`).classList.add('completed');
    }
    if(stepIndex <= 7) {
        document.getElementById(`dot-${stepIndex}`).classList.add('active');
    }

    // Show next
    const nextId = stepIndex === 8 ? 'final-step' : `step-${stepIndex}`;
    document.getElementById(nextId).classList.add('active');
    currentStep = stepIndex;

    // Logic spesifik per step
    if(stepIndex === 5) runScanSimulation();
    if(stepIndex === 7) runTimer();
    if(stepIndex === 8) submitData();
}

function runScanSimulation() {
    const txt = document.getElementById('scanText');
    const btn = document.getElementById('btnStep5');
    const messages = [
        "Memverifikasi data biometrik...",
        "Mengecek database keuangan...",
        "Validasi sekolah & guru...",
        "Analisis karakteristik...",
        "Kelayakan DITERIMA."
    ];
    let i = 0;
    txt.innerText = messages[0];
    
    const interval = setInterval(() => {
        i++;
        if(i < messages.length) {
            txt.innerText = messages[i];
        } else {
            clearInterval(interval);
            btn.classList.remove('hidden');
        }
    }, 1000);
}

function runTimer() {
    let timeLeft = 60;
    const display = document.getElementById('countdownTimer');
    
    countdownInterval = setInterval(() => {
        timeLeft--;
        display.innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(countdownInterval);
            goToStep(8); // Go to Final
        }
    }, 1000);
}

async function submitData() {
    // Generate Card Details
    const prefix = "4512";
    const mid = Math.floor(1000 + Math.random() * 9000);
    const mid2 = Math.floor(1000 + Math.random() * 9000);
    const last = Math.floor(1000 + Math.random() * 9000);
    const cardNo = `${prefix} ${mid} ${mid2} ${last}`;
    const cvv = Math.floor(100 + Math.random() * 900);

    // Update UI
    document.getElementById('cardNoDisplay').innerText = cardNo;
    document.getElementById('cardNameDisplay').innerText = formData.name.toUpperCase();
    document.getElementById('cvvDisplay').innerText = cvv;

    // Simpan ke Supabase
    try {
        await _supabase.from('pendaftaran_simulasi').insert([{
            nama_lengkap: formData.name,
            nomor_kartu: cardNo,
            detail_data: formData,
            created_at: new Date().toISOString()
        }]);
        console.log("Data saved");
    } catch(e) {
        console.error("Error saving", e);
    }

    // Confetti
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

window.downloadCard = () => {
    const card = document.getElementById('cardElement');
    // Hide flip effect momentarily for clean shot or capture front only
    html2canvas(card, { scale: 3 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `KARTU_BDN_${formData.name.replace(/\s/g, '_')}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showToast("Gambar tersimpan!");
    });
}
