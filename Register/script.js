function goStep2() {
    const nama = document.getElementById('inputNama').value;
    const pw = document.getElementById('inputPW').value;

    if (nama === "" || pw.length < 6) {
        alert("Otoritas Ditolak: Mohon lengkapi Nama dan 6 digit PIN Keamanan.");
        return;
    }

    // Simulasi Generate Nomor Kartu 0810
    let randomNum = "";
    for(let i = 0; i < 12; i++) {
        randomNum += Math.floor(Math.random() * 10);
    }
    const fullNumber = "0810" + randomNum;
    const formatted = fullNumber.match(/.{1,4}/g).join(" ");

    // Update Tampilan
    document.getElementById('displayNo').innerText = formatted;
    document.getElementById('displayName').innerText = nama.toUpperCase();

    // Pindah Step
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    
    // Update Progress Bar
    document.querySelectorAll('.circle')[1].classList.add('active');
    document.getElementById('progressLine').style.width = "100%";

    console.log("Log: Kartu berhasil diterbitkan untuk " + nama);
}
