document.addEventListener('DOMContentLoaded', () => {
    console.log("Bank Devisa Nusantara - Core System Active.");

    const recoveryBtn = document.getElementById('btn-recovery');
    
    if(recoveryBtn) {
        recoveryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Animasi sederhana daripada sekadar alert
            recoveryBtn.style.opacity = "0.5";
            setTimeout(() => {
                alert("SISTEM INFORMASI: Layanan Pemulihan Akses saat ini hanya tersedia di Kantor Cabang BDN terdekat.");
                recoveryBtn.style.opacity = "1";
            }, 300);
        });
    }
});
