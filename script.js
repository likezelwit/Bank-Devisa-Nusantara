// Contoh Logika Interaktif Sederhana
document.addEventListener('DOMContentLoaded', () => {
    const recoveryBtn = document.getElementById('btn-recovery');

    recoveryBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert("Layanan Pemulihan Akses sedang dalam tahap pemeliharaan sistem. Silakan hubungi cabang terdekat.");
    });

    console.log("Sistem Bank Devisa Nusantara Berhasil Dimuat.");
});
