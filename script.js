document.addEventListener('DOMContentLoaded', () => {
    console.log("BDN Main Portal 2026 - Bank of The Future Edition Loaded.");

    initStatsSystem();
    initAudioSystem();
    handleEmptyLinks();
    handlePrivacyLink(); // <--- FUNGSI PRIVASI DITAMBAHKAN
});

// --- 1. STATISTIK SYSTEM (REAL & FAKE) ---
function initStatsSystem() {
    // A. REAL DATA: Hitung Total Nasabah dari Firebase
    // Kita tunggu sampai firebaseDB siap (di-export dari module di head)
    const checkDb = setInterval(() => {
        if (window.firebaseDB) {
            clearInterval(checkDb);
            const db = window.firebaseDB;
            
            // Gunakan onValue agar update real-time kalau ada nasabah baru daftar
            import("https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js").then(({ onValue, ref }) => {
                const nasabahRef = ref(db, 'nasabah');
                
                onValue(nasabahRef, (snapshot) => {
                    const data = snapshot.val();
                    const count = data ? Object.keys(data).length : 0;
                    
                    // Tampilkan ke UI
                    const el = document.getElementById('countNasabah');
                    if (el) {
                        // Format angka: 1.420
                        el.innerText = count.toLocaleString('id-ID');
                    }
                });
            });
        }
    }, 100);

    // B. FAKE DATA: Simulasi Transaksi / Detik
    const transEl = document.getElementById('fakeTransaction');
    if (transEl) {
        setInterval(() => {
            // Random angka antara 10 Juta sampai 80 Juta
            const randomVal = Math.floor(Math.random() * (80000000 - 10000000 + 1)) + 10000000;
            transEl.innerText = "Rp " + (randomVal / 1000000).toFixed(1) + "M";
            
            // Efek visual kecil (flash warna)
            transEl.style.color = "#22c55e";
            setTimeout(() => transEl.style.color = "var(--navy)", 300);
        }, 2500); // Update tiap 2.5 detik
    }
}

// --- 2. AUDIO EXPERIENCE SYSTEM ---
function initAudioSystem() {
    const btn = document.getElementById('audioToggle');
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let isMuted = true;

    // Toggle Mute/Unmute
    btn.onclick = () => {
        isMuted = !isMuted;
        btn.innerText = isMuted ? "🔇" : "🔊";
        
        // Resume AudioContext (Browser Policy butuh interaksi user)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    };

    // Fungsi Buat Suara Sintetis (Oscillator)
    // Suara "Blip" futuristik tanpa perlu file mp3 eksternal
    function playSound(type) {
        if (isMuted) return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'hover') {
            // Suara rendah halus
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'click') {
            // Suara 'ting' tinggi
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        }
    }

    // Pasang Event Listener ke semua tombol/kartu
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

// --- 3.5. HANDLE PRIVACY LINK (BARU) ---
function handlePrivacyLink() {
    // Mencari elemen yang memiliki atribut data-target="privacy"
    // Anda tinggal tambahkan data-target="privacy" pada link HTML Anda
    const privacyLink = document.querySelector('a[data-target="privacy"]');
    
    if (privacyLink) {
        privacyLink.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect ke folder privasi
            window.location.href = 'privasi/index.html';
        });
    } else {
        // Opsional: Jika tidak ada atribut, cari teks "Privasi" di footer
        const links = document.querySelectorAll('.footer-col a');
        links.forEach(link => {
            if (link.innerText.includes('Privasi')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'privasi/index.html';
                });
            }
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

    // Inject animation CSS if not exists
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
