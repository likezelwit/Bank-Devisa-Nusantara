document.addEventListener('DOMContentLoaded', () => {
    console.log("BDN Main Portal 2026 - Educational Simulation Loaded.");

    // 1. CEK DISCLAIMER (SAAT PERTAMA KALI BUKA)
    // Menggunakan sessionStorage agar muncul lagi setiap sesi browser baru
    checkDisclaimer();
    
    // Jika sudah setuju di sesi ini, jalankan fitur lain
    if(sessionStorage.getItem('disclaimerAccepted')) {
        initAudioSystem();
        // Fitur Stats dihilangkan karena konten sudah statis edukasi
    }
});

// --- FUNGSI DISCLAIMER UTAMA ---
function checkDisclaimer() {
    const overlay = document.getElementById('disclaimer-overlay');
    const wrapper = document.getElementById('app-wrapper');
    const banner = document.getElementById('simulasiBanner');
    const checkbox = document.getElementById('agreeCheck');
    const btnContinue = document.getElementById('btnContinue');

    // Cek sessionStorage (Berbeda dengan localStorage: Reset saat browser tutup)
    if (sessionStorage.getItem('disclaimerAccepted')) {
        // Sembunyikan modal, tampilkan aplikasi dan banner
        overlay.style.display = 'none';
        wrapper.classList.remove('blurred-app');
        wrapper.style.pointerEvents = 'all';
        banner.style.display = 'block';
    } else {
        // Tampilkan modal, blur aplikasi
        overlay.style.display = 'flex';
        wrapper.classList.add('blurred-app');
        banner.style.display = 'none';
    }

    // Logic Checkbox & Button
    if(checkbox && btnContinue) {
        checkbox.addEventListener('change', function() {
            if(this.checked) {
                btnContinue.removeAttribute('disabled');
                btnContinue.classList.add('active');
            } else {
                btnContinue.setAttribute('disabled', 'true');
                btnContinue.classList.remove('active');
            }
        });

        // Logic Tombol Lanjutkan
        btnContinue.addEventListener('click', function() {
            if(checkbox.checked) {
                // Simpan status di sessionStorage (Hanya bertahan sesi ini)
                sessionStorage.setItem('disclaimerAccepted', 'true');
                
                // Animasi transisi keluar
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    wrapper.classList.remove('blurred-app');
                    wrapper.style.pointerEvents = 'all';
                    banner.style.display = 'block';
                    
                    // Jalankan fitur aplikasi setelah masuk
                    initAudioSystem();
                }, 300);
            }
        });
    }
}

// --- FUNGSI TUTUP BANNER ---
function closeBanner() {
    const banner = document.getElementById('simulasiBanner');
    if(banner) {
        banner.style.transform = "translateY(-100%)";
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300); 
    }
}

// --- AUDIO EXPERIENCE SYSTEM ---
function initAudioSystem() {
    const btn = document.getElementById('audioToggle');
    // Cek apakah tombol audio ada (sebagai fallback)
    if(!btn) return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let isMuted = true;

    btn.onclick = () => {
        isMuted = !isMuted;
        btn.innerText = isMuted ? "🔇" : "🔊";
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    };

    function playSound(type) {
        if (isMuted) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'hover') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        }
    }

    // Pilih elemen yang interaktif untuk efek suara
    const interactiveElements = document.querySelectorAll('.role-card, .btn-account, .logo');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('click', () => playSound('click'));
    });
}
