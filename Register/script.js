let currentStep = 1;
const totalSteps = 8;

function nextStep(s) {
    // Validasi Identitas
    if (s === 2) {
        const nama = document.getElementById('inputNama').value.trim();
        const nik = document.getElementById('inputNIK').value.trim();
        if (nama === "" || nik.length < 16) return alert("Lengkapi Nama dan 16 digit NIK!");
    }
    
    // Validasi PIN
    if (s === 6) {
        if (document.getElementById('inputPW').value.length < 6) return alert("PIN harus 6 angka!");
    }

    currentStep = s;
    updateUI(s);

    if (s === 6) simulasiAnalisis();
}

function updateUI(s) {
    // Sembunyikan semua step
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    // Tampilkan step tujuan
    document.getElementById('step' + s).classList.add('active');

    // Update Progress Line
    const percent = ((s - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progressLine').style.width = percent + "%";

    // Update Circle visual
    document.querySelectorAll('.circle').forEach((c, i) => {
        if (i < s - 1) {
            c.classList.add('completed');
            c.innerHTML = "✓";
        } else if (i === s - 1) {
            c.classList.add('active');
            c.classList.remove('completed');
            c.innerHTML = i + 1;
        } else {
            c.classList.remove('active', 'completed');
            c.innerHTML = i + 1;
        }
    });
}

function simulasiAnalisis() {
    const status = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    setTimeout(() => { status.innerText = "Memeriksa riwayat finansial di BI/SLIK..."; }, 1500);
    setTimeout(() => { 
        status.innerHTML = "<b style='color:green'>VERIFIKASI BERHASIL</b><br>Skor Kredit: A+ (Sangat Layak)"; 
        btn.style.display = "block";
    }, 4000);
}

async function generateFinal() {
    if (!document.getElementById('checkAgree').checked) return alert("Setujui pernyataan!");

    const btn = document.getElementById('btnGenerate');
    btn.disabled = true; btn.innerText = "MENGIRIM DATA...";

    const nama = document.getElementById('inputNama').value;
    const pin = document.getElementById('inputPW').value;
    const rand = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    const fullNo = "0810" + rand;

    try {
        await db.collection("nasabah").add({
            nama: nama,
            nomor_kartu: fullNo,
            pin: pin,
            saldo: 0,
            tgl_daftar: new Date().toISOString()
        });

        document.getElementById('displayNo').innerText = fullNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = nama.toUpperCase();
        updateUI(8);
    } catch (e) {
        alert("Gagal koneksi server!");
        btn.disabled = false;
    }
}

function takeScreenshot() {
    html2canvas(document.getElementById('captureArea'), {scale: 3}).then(canvas => {
        const link = document.createElement('a');
        link.download = 'BDN-Card.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}
