function nextStep(s) {
    if (s === 2 && document.getElementById('inputNama').value.trim() === "") {
        alert("Nama lengkap wajib diisi."); return;
    }
    if (s === 3 && document.getElementById('inputPW').value.length < 6) {
        alert("PIN harus 6 digit."); return;
    }
    updateUI(s);
}

function updateUI(s) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById('step' + s).classList.add('active');
    document.getElementById('progressLine').style.width = ((s - 1) / 3 * 100) + "%";
    document.querySelectorAll('.circle').forEach((c, i) => {
        if (i < s) c.classList.add('active');
    });
}

function generateFinal() {
    if (!document.getElementById('checkAgree').checked) {
        alert("Setujui persyaratan terlebih dahulu."); return;
    }

    const btn = document.getElementById('btnGenerate');
    btn.disabled = true;
    btn.innerText = "PROSES ENKRIPSI...";

    setTimeout(() => {
        const nama = document.getElementById('inputNama').value;
        const rand = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
        const formatted = ("0810" + rand).match(/.{1,4}/g).join(" ");

        document.getElementById('displayNo').innerText = formatted;
        document.getElementById('displayName').innerText = nama.toUpperCase();
        updateUI(4);
    }, 1500);
}

// FUNGSI SCREENSHOT AREA KARTU
function takeScreenshot() {
    const target = document.getElementById('captureArea');
    
    // Gunakan html2canvas untuk mengambil element spesifik
    html2canvas(target, {
        backgroundColor: null, // Agar background transparan jika border-radius ada
        scale: 2, // Meningkatkan kualitas gambar (HD)
        logging: false,
        useCORS: true
    }).then(canvas => {
        // Ubah hasil canvas menjadi URL Gambar
        const image = canvas.toDataURL("image/png");
        
        // Buat link download otomatis
        const link = document.createElement('a');
        link.download = 'BDN-Kartu-Pintar-' + document.getElementById('inputNama').value + '.png';
        link.href = image;
        link.click();
    });
}
