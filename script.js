document.addEventListener('DOMContentLoaded', () => {
    console.log("BDN Main Portal 2026 - Educational Simulation Loaded.");

    // 1. CEK DISCLAIMER (SAAT PERTAMA KALI BUKA)
    checkDisclaimer();
    
    // Jika sudah setuju, jalankan fitur lain
    if(localStorage.getItem('disclaimerAccepted')) {
        initStatsSystem();
        initAudioSystem();
        handleEmptyLinks();
        handlePrivacyLink();
    }
});

// --- FUNGSI DISCLAIMER UTAMA ---
function checkDisclaimer() {
    const overlay = document.getElementById('disclaimer-overlay');
    const wrapper = document.getElementById('app-wrapper');
    const banner = document.getElementById('simulasiBanner');
    const checkbox = document.getElementById('agreeCheck');
    const btnContinue = document.getElementById('btnContinue');

    // Cek apakah user sudah setuju sebelumnya
    if (localStorage.getItem('disclaimerAccepted')) {
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
                // Simpan status agar tidak muncul lagi
                localStorage.setItem('disclaimerAccepted', 'true');
                
                // Animasi transisi keluar
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    wrapper.classList.remove('blurred-app');
                    wrapper.style.pointerEvents = 'all';
                    banner.style.display = 'block';
                    
                    // Jalankan fitur aplikasi setelah masuk
                    initStatsSystem();
                    initAudioSystem();
                    handleEmptyLinks();
                    handlePrivacyLink();
                }, 300);
            }
        });
    }
}

// --- 1. STATISTIK SYSTEM (REAL & FAKE) ---
function initStatsSystem() {
    const checkDb = setInterval(() => {
        if (window.firebaseDB) {
            clearInterval(checkDb);
            const db = window.firebaseDB;
            
            import("https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js").then(({ onValue, ref }) => {
                const nasabahRef = ref(db, 'nasabah');
                
                onValue(nasabahRef, (snapshot) => {
                    const data = snapshot.val();
                    const count = data ? Object.keys(data).length : 0;
                    
                    const el = document.getElementById('countNasabah');
                    if (el) {
                        el.innerText = count.toLocaleString('id-ID');
                    }
                });
            });
        }
    }, 100);

    const transEl = document.getElementById('fakeTransaction');
    if (transEl) {
        setInterval(() => {
            const randomVal = Math.floor(Math.random() * (80000000 - 10000000 + 1)) + 10000000;
            transEl.innerText = "Rp " + (randomVal / 1000000).toFixed(1) + "M";
            transEl.style.color = "#22c55e";
            setTimeout(() => transEl.style.color = "var(--navy)", 300);
        }, 2500);
    }
}

// --- 2. AUDIO EXPERIENCE SYSTEM ---
function initAudioSystem() {
    const btn = document.getElementById('audioToggle');
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

    const interactiveElements = document.querySelectorAll('.menu-card, .btn-account, .logo');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => playSound('hover'));
        el.addEventListener('click', () => playSound('click'));
    });
}

// --- 3. HANDLE EMPTY LINKS (Notif) ---
function handleEmptyLinks() {
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const path = this.getAttribute('href');
            if (path === "#" || path === "") {
                e.preventDefault();
                showNotification("🚧 Modul ini sedang dalam pengembangan.");
            }
        });
    });
}

// --- 4. HANDLE PRIVACY LINK ---
function handlePrivacyLink() {
    const privacyLink = document.querySelector('a[href="privasi/index.html"]');
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            // Biarkan default behavior bekerja, tapi bisa ditambah logika lain jika perlu
            console.log("Membuka halaman privasi...");
        });
    }
}

function showNotification(msg) {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: #0f172a; color: white; padding: 12px 24px;
        border-radius: 12px; font-weight: 600; font-size: 0.9rem;
        z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideUp 0.3s ease-out;
    `;
    div.innerText = msg;
    document.body.appendChild(div);

    setTimeout(() => {
        div.style.animation = "slideDown 0.3s ease-in";
        setTimeout(() => div.remove(), 300);
    }, 3000);

    if (!document.getElementById('notif-style')) {
        const style = document.createElement('style');
        style.id = 'notif-style';
        style.innerHTML = `
            @keyframes slideUp { from { bottom: -50px; opacity: 0; } to { bottom: 20px; opacity: 1; } }
            @keyframes slideDown { from { bottom: 20px; opacity: 1; } to { bottom: -50px; opacity: 0; } }
        `;
        document.head.appendChild(style);
    }
}
