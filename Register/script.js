function nextStep(s) {
    if (s === 2) {
        if (document.getElementById('inputNama').value.trim() === "") {
            alert("Sistem membutuhkan nama lengkap untuk proses verifikasi."); return;
        }
    }
    if (s === 3) {
        if (document.getElementById('inputPW').value.length < 6) {
            alert("PIN keamanan harus terdiri dari 6 digit angka."); return;
        }
    }
    updateUI(s);
}

function updateUI(s) {
    // Sembunyikan semua step
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    // Tampilkan step yang diminta
    document.getElementById('step' + s).classList.add('active');

    // Update Progress Bar
    const progress = ((s - 1) / 3) * 100;
    document.getElementById('progressLine').style.width = progress + "%";

    // Update Circle Color
    document.querySelectorAll('.circle').forEach((circle, idx) => {
        if (idx < s) circle.classList.add('active');
    });
}

function generateFinal() {
    if (!document.getElementById('checkAgree').checked) {
        alert("Anda harus menyetujui syarat & ketentuan layanan."); return;
    }

    const btn = document.getElementById('btnGenerate');
    btn.disabled = true;
    btn.innerText = "MENGHUBUNGI SERVER PUSAT...";

    // Simulasi Proses Bank (1.5 detik)
    setTimeout(() => {
        const nama = document.getElementById('inputNama').value;
        const randomNumbers = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
        const fullCard = "0810" + randomNumbers;
        
        // Format Tampilan Nomor (XXXX XXXX XXXX XXXX)
        const formatted = fullCard.match(/.{1,4}/g).join(" ");

        document.getElementById('displayNo').innerText = formatted;
        document.getElementById('displayName').innerText = nama.toUpperCase();

        updateUI(4);
    }, 1500);
}
