document.addEventListener('DOMContentLoaded', () => {
    console.log("BDN Main Portal - All Systems Synchronized.");

    // Menangani link agar memberikan feedback jika folder belum dibuat
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === "#") {
                e.preventDefault();
                alert("Modul ini sedang dalam pemeliharaan rutin. Silakan coba beberapa saat lagi.");
            }
        });
    });
});
