// --- 1. SETUP SUPABASE ---
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// GANTI DENGAN KREDENSIAL SUPABASE ANDA
const SUPABASE_URL = 'https://ndopnxzbaygohzshqphi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3BueHpiYXlnb2h6c2hxcGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzM4ODQsImV4cCI6MjA3OTMwOTg4NH0.nZC5kOVJeMAtfXlwchokXK4FLtPkPoUrxPQUzrz2C8I';

const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. FUNGSI UI (TOAST) ---
// Mengganti alert() yang jelek
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toastMsg');
    
    msg.innerText = message;
    
    // Styling dynamic untuk error/sukses
    if(isError) {
        toast.style.background = '#ef4444'; // Merah
        toast.innerHTML = `<i class="fas fa-times-circle"></i> <span>${message}</span>`;
    } else {
        toast.style.background = '#0f172a'; // Navy (Default)
        toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
    }

    toast.classList.remove('hidden');
    // Trigger reflow untuk animasi
    void toast.offsetWidth; 
    toast.classList.add('show');

    // Hilangkan setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 400); // Tunggu animasi selesai
    }, 3000);
}

// --- 3. LOGIKA CHECK AGE ---
window.checkAge = () => {
    const dd = document.getElementById('dobDD').value;
    const mm = document.getElementById('dobMM').value;
    const yyyy = document.getElementById('dobYYYY').value;
    const btn = document.querySelector('.btn-primary');

    // Validasi sederhana
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

    // Validasi Umur (Misal min 7 tahun max 100 tahun)
    if(age < 7) {
        showToast("Waduh, kamu masih terlalu kecil nih. Min 7 tahun ya!", true);
        return;
    }
    if(age > 120) {
        showToast("Waduh, input tahun lahir yang bener dong!", true);
        return;
    }

    // Jika Lolos -> Pindah Step
    document.getElementById('step-0').style.display = 'none';
    document.getElementById('step-1').classList.add('active');
};

// --- 4. LOGIKA SUBMIT KE SUPABASE ---
window.submitToSupabase = async () => {
    const btn = document.getElementById('btnSubmit');
    const spanText = btn.querySelector('span');
    const icon = btn.querySelector('.fa-arrow-right');
    const loader = btn.querySelector('.loading-icon');
    const namaInput = document.getElementById('fullName');
    
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

    // Ubah state tombol loading
    btn.disabled = true;
    spanText.innerText = "Sedang Mencetak...";
    icon.classList.add('hidden');
    loader.classList.remove('hidden');

    // Generate Nomor Kartu Random (4512 Prefix + 3 grup acak)
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

        // Update UI Kartu
        document.getElementById('cardNameDisplay').innerText = nama.toUpperCase();
        document.getElementById('cardNumberDisplay').innerText = noKartu;

        // Transisi Halaman
        document.getElementById('step-1').classList.remove('active');
        setTimeout(() => {
            document.getElementById('step-1').style.display = 'none';
            document.getElementById('final-step').classList.add('active');
        }, 300);

    } catch (err) {
        // --- ERROR ---
        showToast("Gagal nyimpen! Cek koneksi internetmu.", true);
        console.error("Supabase Error:", err.message);
        
        // Reset Tombol
        btn.disabled = false;
        spanText.innerText = "Cetak Kartu Ajaibku 🚀";
        icon.classList.remove('hidden');
        loader.classList.add('hidden');
    }
};

// --- 5. LOGIKA DOWNLOAD GAMBAR ---
window.downloadCard = () => {
    const cardElement = document.querySelector("#cardPreview");
    const btn = document.querySelector('.btn-download');
    const originalText = btn.innerHTML;

    if(!cardElement) {
        showToast("Kartunya nggak ketemu!", true);
        return;
    }

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