function nextStep(s) {
    // 1. Validasi Nama (Step 1)
    if (s === 2) {
        const nama = document.getElementById('inputNama').value.trim();
        // Regex: Hanya huruf dan spasi, minimal 3 karakter
        const namaRegex = /^[a-zA-Z\s]{3,50}$/;
        
        if (nama === "") return alert("Otoritas Ditolak: Nama lengkap wajib diisi!");
        if (!namaRegex.test(nama)) {
            return alert("Otoritas Ditolak: Nama hanya boleh berisi huruf dan minimal 3 karakter (tanpa simbol/angka)!");
        }
    }

    // 2. Validasi Nomor WhatsApp/Telepon (Step 2)
    if (s === 3) {
        const telp = document.querySelector('#step2 input').value.trim();
        
        if (telp === "") return alert("Otoritas Ditolak: Nomor telepon wajib diisi!");
        
        // Logika Kode Negara
        const isIndo = telp.startsWith('08') || telp.startsWith('62');
        const isUS = telp.startsWith('1');
        const isSingapore = telp.startsWith('65');
        
        if (!isIndo && !isUS && !isSingapore) {
            return alert("Otoritas Ditolak: Kode negara tidak didukung atau format nomor tidak valid!");
        }

        // Cek panjang nomor (rata-rata 7-15 digit internasional)
        if (telp.length < 7 || telp.length > 15 || isNaN(telp)) {
            return alert("Otoritas Ditolak: Digit nomor telepon tidak valid!");
        }
    }

    // 3. Validasi Field Kosong Otomatis (Cek semua input di step saat ini)
    const currentStepDiv = document.getElementById('step' + (s - 1));
    const inputs = currentStepDiv.querySelectorAll('input, select');
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value.trim() === "") allFilled = false;
    });

    if (!allFilled) return alert("Otoritas Ditolak: Harap lengkapi semua data pada kolom yang tersedia!");

    // 4. Validasi PIN (Step 5 menuju 6)
    if (s === 6) {
        const pin = document.getElementById('inputPW').value;
        if (pin.length < 6 || isNaN(pin)) {
            return alert("Otoritas Ditolak: PIN harus terdiri dari 6 digit angka rahasia!");
        }
    }

    updateUI(s);
}

function updateUI(s) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + s).classList.add('active');

    const progressPercent = ((s - 1) / 7) * 100;
    document.getElementById('progressLine').style.width = progressPercent + "%";

    document.querySelectorAll('.circle').forEach((circle, i) => {
        const stepNum = i + 1;
        if (stepNum < s) {
            circle.classList.add('completed');
            circle.classList.remove('active');
            circle.innerHTML = "✓";
        } else if (stepNum === s) {
            circle.classList.add('active');
            circle.classList.remove('completed');
            circle.innerText = stepNum;
        } else {
            circle.classList.remove('active', 'completed');
            circle.innerText = stepNum;
        }
    });

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
    
    const rand = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    const fullNumber = "0810" + rand;

    try {
        await db.collection("nasabah").add({
            nama_lengkap: nama,
            nomor_kartu: fullNumber,
            pin_keamanan: pin,
            saldo: 0,
            status: "Aktif",
            tgl_daftar: new Date().toISOString()
        });

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
    html2canvas(card, { 
        scale: 3, 
        backgroundColor: null,
        borderRadius: 20
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-CARD-${document.getElementById('inputNama').value}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}
