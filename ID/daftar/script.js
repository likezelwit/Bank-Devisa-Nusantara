// --- 1. SETUP SUPABASE ---
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// PASTIKAN KREDENSIAL INI BENAR
const SUPABASE_URL = 'https://ndopnxzbaygohzshqphi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3BueHpiYXlnb2h6c2hxcGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzM4ODQsImV4cCI6MjA3OTMwOTg4NH0.nZC5kOVJeMAtfXlwchokXK4FLtPkPoUrxPQUzrz2C8I';

const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. FUNGSI UI (TOAST) ---
// Mengganti alert() standar
function showToast(message, isError = false) {
    // Cek apakah elemen toast ada
    const toast = document.getElementById('toast');
    if(!toast) return;

    const msg = document.getElementById('toastMsg');
    
    // Set pesan
    if(msg) msg.innerText = message;
    
    // Styling dynamic untuk error/sukses
    if(isError) {
        toast.style.background = '#ef4444'; // Merah
        toast.innerHTML = `<i class="fas fa-times-circle"></i> <span>${message}</span>`;
    } else {
        toast.style.background = '#0f172a'; // Navy (Default)
        toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
    }

    toast.classList.remove('hidden');
    // Trigger reflow agar animasi jalan
    void toast.offsetWidth; 
    toast.classList.add('show');

    // Hilangkan setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if(toast) toast.classList.add('hidden');
        }, 400);
    }, 3000);
}

// --- 3. LOGIKA CHECK AGE ---
window.checkAge = () => {
    const dd = document.getElementById('dobDD').value;
    const mm = document.getElementById('dobMM').value;
    const yyyy = document.getElementById('dobYYYY').value;
    
    // Cek element ada
    if(!dd || !mm || !yyyy) return showToast("Input tanggal tidak ditemukan!", true);

    if(dd.length < 2 || mm.length < 2 || yyyy.length < 4) {
        showToast("Ups, tanggal lahirnya belum lengkap nih!", true);
        return;
    }

    const birthDate = new Date(`${yyyy}-${mm}-${dd}`);
    const today = new Date();

    if(isNaN(birthDate.getTime())) {
        showToast("Format tanggal nggak valid, Sobat.", true);
        return;
    }

    // Hitung umur
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    // Validasi Umur
    if(age < 7) {
        showToast("Waduh, kamu masih terlalu kecil nih. Min 7 tahun ya!", true);
        return;
    }
    if(age > 120) {
        showToast("Waduh, input tahun lahir yang bener dong!", true);
        return;
    }

    // Jika Lolos -> Pindah Step
    const step0 = document.getElementById('step-0');
    const step1 = document.getElementById('step-1');

    if(step0) step0.style.display = 'none';
    if(step1) {
        step1.style.display = 'block';
        step1.classList.add('active');
    }
};

// --- 4. LOGIKA SUBMIT KE SUPABASE ---
window.submitToSupabase = async () => {
    // Menggunakan Safety Checks (Optional Chaining)
    const btn = document.getElementById('btnSubmit');
    const namaInput = document.getElementById('fullName');
    
    if(!btn || !namaInput) {
        console.error("Elemen button atau input tidak ditemukan!");
        return;
    }
    
    const nama = namaInput.value.trim();
    
    // Validasi Nama
    if(!nama) {
        showToast("Eits, namanya belum diisi nih!", true);
        namaInput.focus();
        return;
    }
    if(nama.length < 3) {
        showToast("Nama terlalu pendek, deh.", true);
        return;
    }

    // Cari elemen child button (span dan icon)
    const spanText = btn.querySelector('span');
    const icon = btn.querySelector('.fa-arrow-right');
    const loader = btn.querySelector('.loading-icon');

    // Ubah state tombol loading
    btn.disabled = true;
    if(spanText) spanText.innerText = "Sedang Mencetak...";
    if(icon) icon.classList.add('hidden');
    if(loader) loader.classList.remove('hidden');

    // Generate Nomor Kartu Random
    const prefix = "4512";
    const mid = Math.floor(1000 + Math.random() * 9000);
    const mid2 = Math.floor(1000 + Math.random() * 9000);
    const last = Math.floor(1000 + Math.random() * 9000);
    const noKartu = `${prefix} ${mid} ${mid2} ${last}`;

    try {
        // Kirim ke Supabase
        const { error } = await _supabase
            .from('pendaftaran_simulasi')
            .insert([{ 
                nama_lengkap: nama, 
                nomor_kartu: noKartu, 
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        // --- SUKSES ---
        // Efek Confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        // Update UI Kartu (Dengan Safety Check)
        const cardNameDisplay = document.getElementById('cardNameDisplay');
        const cardNumberDisplay = document.getElementById('cardNumberDisplay');
        
        if(cardNameDisplay) cardNameDisplay.innerText = nama.toUpperCase();
        if(cardNumberDisplay) cardNumberDisplay.innerText = noKartu;

        // Transisi Halaman (Dengan Safety Check)
        const step1 = document.getElementById('step-1');
        const finalStep = document.getElementById('final-step');

        if(step1) step1.classList.remove('active');
        
        setTimeout(() => {
            if(step1) step1.style.display = 'none';
            if(finalStep) {
                finalStep.style.display = 'block';
                finalStep.classList.add('active');
            }
        }, 300);

    } catch (err) {
        // --- ERROR ---
        showToast("Gagal nyimpen! Cek koneksi internetmu.", true);
        console.error("Supabase Error:", err.message);
        
        // Reset Tombol
        btn.disabled = false;
        if(spanText) spanText.innerText = "Cetak Kartu Ajaibku 🚀";
        if(icon) icon.classList.remove('hidden');
        if(loader) loader.classList.add('hidden');
    }
};

// --- 5. LOGIKA DOWNLOAD GAMBAR ---
window.downloadCard = () => {
    const cardElement = document.querySelector("#cardPreview");
    const btn = document.querySelector('.btn-download');
    const originalText = btn ? btn.innerHTML : '';

    if(!cardElement) {
        showToast("Kartunya nggak ketemu!", true);
        return;
    }
    if(!btn) return;

    // Loading state di tombol download
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    btn.disabled = true;

    // Gunakan html2canvas
    html2canvas(cardElement, {
        scale: 2, // Kualitas tinggi
        backgroundColor: null, // Transparansi
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `KARTU_BDN_${Date.now()}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        showToast("Gambar berhasil disimpan! 🎉");
        
        // Reset tombol
        btn.innerHTML = originalText;
        btn.disabled = false;
    }).catch(err => {
        console.error(err);
        showToast("Gagal mengambil gambar.", true);
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
};