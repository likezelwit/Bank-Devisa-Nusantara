import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- KONFIGURASI DATABASE SUPABASE ---
const SUPABASE_URL = 'https://ndopnxzbaygohzshqphi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3BueHpiYXlnb2h6c2hxcGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzM4ODQsImV4cCI6MjA3OTMwOTg4NH0.nZC5kOVJeMAtfXlwchokXK4FLtPkPoUrxPQUzrz2C8I';
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- STRUKTUR DATA TINGKAT KARTU ---
// Format: { prefix, limit_in_millions, price_idr, name }
const cardTiers = [
    { prefix: '0810', limit: 10, price: 0, name: 'Platinum Basic' },
    { prefix: '0892', limit: 14, price: 2500000, name: 'Gold Elite' },
    { prefix: '0822', limit: 20, price: 8500000, name: 'Titanium' },
    { prefix: '0812', limit: 24, price: 15000000, name: 'Diamond I' },
    { prefix: '0878', limit: 27, price: 25000000, name: 'Diamond II' },
    { prefix: '0864', limit: 31, price: 45000000, name: 'Ruby' },
    { prefix: '0876', limit: 35, price: 75000000, name: 'Sapphire' },
    { prefix: '0811', limit: 38, price: 120000000, name: 'Emerald' },
    { prefix: '0806', limit: 40, price: 250000000, name: 'Amethyst' },
    { prefix: '0808', limit: 44, price: 500000000, name: 'Black Onyx' },
    { prefix: '8888', limit: 199, price: 2500000000, name: 'Centurion' },
    { prefix: '8808', limit: 301, price: 15000000000, name: 'Royal Ascot' },
    { prefix: '8870', limit: 899, price: 85000000000, name: 'Imperial' },
    { prefix: '8843', limit: 1000, price: 500000000000, name: 'Sovereign' },
    { prefix: '8899', limit: 6000, price: 3000000000000, name: 'Globalist' },
    { prefix: '9012', limit: 10000, price: 15000000000000, name: 'Infinite' },
    { prefix: '9088', limit: 80000, price: 99000000000000, name: 'Quantum' },
    { prefix: '9099', limit: 999000, price: 500000000000000, name: 'Galactic' },
    { prefix: '9902', limit: 'Unlimited', price: 999999999999999, name: 'Omnipotent' }
];

// --- FUNGSI FORMAT MATA UANG ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

// --- RENDER DAFTAR KARTU (Untuk index.html) ---
function renderCards() {
    const container = document.getElementById('cardsContainer');
    if(!container) return;

    container.innerHTML = '';

    // Dalam aplikasi nyata, 'userCurrentPrefix' diambil dari sesi pengguna
    const userCurrentPrefix = '0810'; 

    cardTiers.forEach(tier => {
        const isOwned = tier.prefix === userCurrentPrefix;
        const cardEl = document.createElement('div');
        cardEl.className = `card-item ${isOwned ? 'owned' : ''}`;
        
        let buttonHtml = isOwned 
            ? `<button class="btn-upgrade" disabled>Anda Memiliki Ini</button>` 
            : `<button class="btn-upgrade" onclick="window.selectUpgrade('${tier.prefix}')">Tingkatkan - ${formatCurrency(tier.price)}</button>`;

        cardEl.innerHTML = `
            ${isOwned ? '<div class="owned-badge">DIMILIKI</div>' : ''}
            <div>
                <div class="card-prefix">${tier.prefix}</div>
                <div class="card-limit">Limit: ${tier.limit === 'Unlimited' ? 'Tidak Terbatas' : tier.limit + ' Juta'}</div>
            </div>
            <div class="card-price">${tier.price === 0 ? 'Gratis' : formatCurrency(tier.price)}</div>
            ${buttonHtml}
        `;
        container.appendChild(cardEl);
    });
}

// --- PEMILIHAN TINGKAT UPGRADE ---
window.selectUpgrade = (prefix) => {
    const selectedCard = cardTiers.find(c => c.prefix === prefix);
    localStorage.setItem('selectedUpgrade', JSON.stringify(selectedCard));
    window.location.href = 'check-out/';
}

// --- LOGIKA VERIFIKASI CHECK-OUT ---
window.handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    const cardNo = document.getElementById('cardNo').value;
    const name = document.getElementById('cardName').value;
    const cvv = document.getElementById('cvv').value;

    // Validasi Input Dasar
    if(cardNo.length < 16 || name.length < 3 || cvv.length < 3) {
        alert("Harap isi data kartu dengan valid.");
        return;
    }

    // 1. VERIFIKASI REAL KE SUPABASE (Nomor & CVV)
    const { data: cardData, error } = await _supabase
        .from('pendaftaran_simulasi')
        .select('*')
        .eq('nomor_kartu', cardNo)
        .single(); 

    if (error || !cardData) {
        alert("Nomor kartu tidak ditemukan dalam sistem kami.");
        return;
    }

    const savedCvv = cardData.detail_data?.card_meta?.cvv;
    
    if (String(savedCvv) !== String(cvv)) {
        alert("Kode keamanan (CVV) salah. Harap periksa kembali.");
        return;
    }

    if (cardData.nama_lengkap.toLowerCase() !== name.toLowerCase()) {
        alert("Nama pemegang kartu tidak sesuai dengan nomor kartu yang dimasukkan.");
        return;
    }

    localStorage.setItem('verifiedCardNo', cardNo);

    document.getElementById('step-details').style.display = 'none';
    document.getElementById('step-pin').style.display = 'block';
}

// --- LOGIKA VERIFIKASI PIN ---
window.handlePinSubmit = async (e) => {
    e.preventDefault();
    const pinInput = document.getElementById('pinInput').value;
    
    if(pinInput.length !== 6) {
        alert("PIN harus terdiri dari 6 digit angka.");
        return;
    }

    const verifiedCardNo = localStorage.getItem('verifiedCardNo');
    
    if (!verifiedCardNo) {
        alert("Sesi habis, silakan mulai ulang.");
        window.location.href = '../';
        return;
    }

    const { data: cardData, error } = await _supabase
        .from('pendaftaran_simulasi')
        .select('*')
        .eq('nomor_kartu', verifiedCardNo)
        .single();

    const savedPin = cardData.detail_data?.pin;

    if (String(savedPin) !== String(pinInput)) {
        alert("PIN transaksi salah. Transaksi dibatalkan.");
        return;
    }

    window.location.href = '../konfirmasi/';
}

// --- RENDER RINCIAN KONFIRMASI (Untuk konfirmasi/index.html) ---
function renderConfirmation() {
    const upgradeData = JSON.parse(localStorage.getItem('selectedUpgrade'));
    const container = document.getElementById('summaryContainer');
    if(!container) return;

    const verifiedCardNo = localStorage.getItem('verifiedCardNo');

    container.innerHTML = `
        <div class="receipt">
            <h3>BUKTI TRANSAKSI UPGRADE</h3>
            <p><strong>Kartu Lama:</strong> ${verifiedCardNo}</p>
            <hr>
            <p><strong>Tingkat Baru:</strong> ${upgradeData.name}</p>
            <p><strong>Prefix Baru:</strong> ${upgradeData.prefix}</p>
            <p><strong>Limit Baru:</strong> ${upgradeData.limit}</p>
            <hr>
            <p style="font-size:1.2rem"><strong>Total Biaya:</strong></p>
            <p style="font-size:1.5rem; color:var(--accent)">${formatCurrency(upgradeData.price)}</p>
        </div>
    `;
}

window.processUpgrade = () => {
    window.location.href = '../sukses/';
}

// --- LOGIKA SUKSES & UPDATE DATABASE (Dengan Pengecekan Saldo) ---
async function runRealtimeUpdate() {
    const upgradeData = JSON.parse(localStorage.getItem('selectedUpgrade'));
    const verifiedCardNo = localStorage.getItem('verifiedCardNo');
    
    const statusText = document.getElementById('statusText');
    const oldNumDisplay = document.getElementById('oldNumDisplay');
    const newNumDisplay = document.getElementById('newNumDisplay');

    // 1. Langkah Pertama: Memverifikasi Saldo Rekening
    statusText.innerText = "Memverifikasi Saldo Rekening...";
    await new Promise(r => setTimeout(r, 1000)); // Delay visual

    // AMBIL DATA TERBARU DARI DATABASE UNTUK CEK SALDO
    const { data: currentCardData, error: fetchError } = await _supabase
        .from('pendaftaran_simulasi')
        .select('*')
        .eq('nomor_kartu', verifiedCardNo)
        .single();

    if (fetchError || !currentCardData) {
        console.error("Gagal mengambil data nasabah:", fetchError);
        statusText.innerText = "Gagal memuat data nasabah.";
        return;
    }

    // PARSING SALDO SAAT INI
    // Mengubah string mata uang (contoh: "Rp 2.500.000") menjadi angka (2500000)
    const balanceString = currentCardData.detail_data?.account_info?.balance || "0";
    const currentBalance = parseInt(balanceString.replace(/[^0-9]/g, '')) || 0;
    
    // HARGA UPGRADE (Dalam bentuk angka murni)
    const upgradePrice = upgradeData.price;

    // CEK APAKAH SALDO MENCUKUPI
    if (currentBalance < upgradePrice) {
        // HENTIKAN PROSES JIKA SALDO TIDAK CUKUP
        statusText.innerText = "Saldo Tidak Mencukupi";
        statusText.style.color = "var(--danger)"; // Ubah warna teks menjadi merah
        
        document.getElementById('loadingIcon').style.display = 'none';
        
        // Tampilkan pesan detail menggunakan alert browser
        alert(
            `TRANSAKSI DITOLAK.\n\n` +
            `Saldo Anda: ${formatCurrency(currentBalance)}\n` +
            `Harga Upgrade: ${formatCurrency(upgradePrice)}\n\n` +
            `Mohon lakukan pengisian ulang saldo terlebih dahulu.`
        );

        // Tampilkan tombol kembali
        document.getElementById('btnHome').innerText = "Kembali ke Konfirmasi";
        document.getElementById('btnHome').onclick = () => window.location.href = '../konfirmasi/';
        document.getElementById('btnHome').style.display = 'inline-block';
        
        return; // Berhenti di sini
    }

    // JIKA SALDO CUKUP, LANJUTKAN SIMULASI
    const steps = [
        "Saldo Terkonfirmasi Cukup",
        "Menghubungkan ke Gerbang Pembayaran Aman...",
        "Memperbarui Basis Data Utama...",
        "Membuat Nomor Kartu Baru..."
    ];

    for (let i = 0; i < steps.length; i++) {
        statusText.innerText = steps[i];
        await new Promise(r => setTimeout(r, 1500));
    }

    // 2. LOGIKA GENERASI NOMOR KARTU BARU
    const oldNumber = verifiedCardNo.replace(/\s/g, ''); 
    const last12 = oldNumber.substring(4); 
    const newPrefix = upgradeData.prefix; 
    
    const rawNewNum = newPrefix + last12;
    const formattedNewNum = `${rawNewNum.substring(0,4)} ${rawNewNum.substring(4,8)} ${rawNewNum.substring(8,12)} ${rawNewNum.substring(12,16)}`;

    // 3. EKSEKUSI UPDATE DATABASE SUPABASE
    try {
        // Update Nomor Kartu
        const { error: updateError } = await _supabase
            .from('pendaftaran_simulasi')
            .update({ nomor_kartu: formattedNewNum })
            .eq('nomor_kartu', verifiedCardNo);

        if (updateError) {
            throw updateError;
        }

        // (Opsional) Logika Pengurangan Saldo Bisa Ditambahkan Disini Jika Ingin Simulasi Lebih Real
        // await _supabase.from('pendaftaran_simulasi').update({ ...detail_data }).eq(...)

        // 4. UPDATE ANTARMUKA PENGGUNA
        statusText.innerText = "Peningkatan Berhasil!";
        statusText.style.color = "var(--primary)"; // Kembalikan warna ke normal
        document.getElementById('loadingIcon').style.display = 'none';
        document.getElementById('successIcon').style.display = 'block';
        
        oldNumDisplay.style.textDecoration = "line-through";
        oldNumDisplay.style.color = "#94a3b8";
        newNumDisplay.innerText = formattedNewNum;

        document.getElementById('btnHome').innerText = "Kembali ke Beranda";
        document.getElementById('btnHome').onclick = () => window.location.href = '../../';
        document.getElementById('btnHome').style.display = 'inline-block';
        
        console.log("Database berhasil diperbarui.");

    } catch (err) {
        console.error("Gagal memperbarui database:", err);
        statusText.innerText = "Gagal memproses upgrade. Silakan hubungi CS.";
        statusText.style.color = "red";
    }

    // 5. BERSIHKAN PENYIMPANAN LOKAL
    localStorage.removeItem('selectedUpgrade');
    localStorage.removeItem('verifiedCardNo');
}

// --- INISIALISASI HALAMAN ---
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('cardsContainer')) renderCards();
    if(document.getElementById('summaryContainer')) renderConfirmation();
    if(document.getElementById('statusText')) runRealtimeUpdate();
});