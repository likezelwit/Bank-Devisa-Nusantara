function nextStep(s) {
    // Validasi Step 1: Nama
    if (s === 2 && document.getElementById('inputNama').value.trim() === "") {
        return alert("Otoritas Ditolak: Nama lengkap wajib diisi sesuai identitas!");
    }
    // Validasi Step 5: PIN (Karena di HTML kamu Step 5 adalah PIN)
    if (s === 6) {
        const pin = document.getElementById('inputPW').value;
        if (pin.length < 6 || isNaN(pin)) {
            return alert("Otoritas Ditolak: PIN harus terdiri dari 6 digit angka!");
        }
    }
    updateUI(s);
}

function updateUI(s) {
    // 1. Switch Active Step
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + s).classList.add('active');

    // 2. Update Progress Line (Ada 8 step, jadi pembaginya 7 gap)
    const progressPercent = ((s - 1) / 7) * 100;
    document.getElementById('progressLine').style.width = progressPercent + "%";

    // 3. Update Circles
    document.querySelectorAll('.circle').forEach((circle, i) => {
        const stepNum = i + 1;
        circle.innerText = stepNum; // Memastikan angka muncul di lingkaran

        if (stepNum < s) {
            circle.classList.add('completed');
            circle.classList.remove('active');
            circle.innerHTML = "✓"; // Kasih centang kalau sudah lewat
        } else if (stepNum === s) {
            circle.classList.add('active');
            circle.classList.remove('completed');
            circle.innerText = stepNum;
        } else {
            circle.classList.remove('active', 'completed');
            circle.innerText = stepNum;
        }
    });

    // Scroll ke atas otomatis setiap ganti step biar gak bingung di HP
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function generateFinal() {
    if (!document.getElementById('checkAgree').checked) {
        return alert("Otoritas Ditolak: Anda harus menyetujui seluruh persyaratan layanan!");
    }
    
    const btn = document.getElementById('btnGenerate');
    btn.disabled = true; 
    btn.innerText = "MENGAMANKAN DATA KE DATABASE PUSAT...";

    const nama = document.getElementById('inputNama').value;
    const pin = document.getElementById('inputPW').value;
    
    // Generate nomor kartu 0810 + 12 digit acak
    const rand = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    const fullNumber = "0810" + rand;

    try {
        // Simpan ke Firebase (db diambil dari firebase.js di root)
        await db.collection("nasabah").add({
            nama_lengkap: nama,
            nomor_kartu: fullNumber,
            pin_keamanan: pin,
            saldo: 0,
            status: "Aktif",
            tgl_daftar: new Date().toISOString()
        });

        // Tampilkan hasil di Step 8
        const formattedNumber = fullNumber.match(/.{1,4}/g).join(" ");
        document.getElementById('displayNo').innerText = formattedNumber;
        document.getElementById('displayName').innerText = nama.toUpperCase();
        
        updateUI(8);
    } catch (e) {
        console.error(e);
        alert("Kegagalan Sistem: Gagal menyambung ke server pusat!");
        btn.disabled = false;
        btn.innerText = "Terbitkan Sekarang";
    }
}

function takeScreenshot() {
    const card = document.getElementById('captureArea');
    const btn = document.querySelector('.btn-screenshot');
    btn.innerText = "MENGAMBIL GAMBAR...";
    
    html2canvas(card, { 
        scale: 3, // Kualitas super tajam
        backgroundColor: null,
        borderRadius: 20
    }).then(canvas => {
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `BDN-CARD-${timestamp}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        btn.innerText = "📸 Simpan Gambar";
    });
}
