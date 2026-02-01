import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- DATA TIER KARTU ---
// Format: { prefix, limit_in_millions, price_idr }
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

// --- FUNGSI HELPER ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
}

// --- RENDER KARTU (Untuk index.html) ---
function renderCards() {
    const container = document.getElementById('cardsContainer');
    if(!container) return;

    container.innerHTML = '';

    // Ambil data user saat ini (simulasi: user punya 0810)
    // Di real app, ini ambil dari Supabase user session
    const userCurrentPrefix = '0810'; 

    cardTiers.forEach(tier => {
        const isOwned = tier.prefix === userCurrentPrefix;
        const cardEl = document.createElement('div');
        cardEl.className = `card-item ${isOwned ? 'owned' : ''}`;
        
        let buttonHtml = isOwned 
            ? `<button class="btn-upgrade" disabled>You own this</button>` 
            : `<button class="btn-upgrade" onclick="selectUpgrade('${tier.prefix}')">Upgrade - ${formatCurrency(tier.price)}</button>`;

        cardEl.innerHTML = `
            ${isOwned ? '<div class="owned-badge">OWNED</div>' : ''}
            <div>
                <div class="card-prefix">${tier.prefix}</div>
                <div class="card-limit">Limit: ${tier.limit === 'Unlimited' ? 'Unlimited' : tier.limit + ' Million'}</div>
            </div>
            <div class="card-price">${tier.price === 0 ? 'Free' : formatCurrency(tier.price)}</div>
            ${buttonHtml}
        `;
        container.appendChild(cardEl);
    });
}

// --- PILIH UPGRADE (DI-ATTACH KE WINDOW BIAR HTML BISA PANGGIL) ---
window.selectUpgrade = (prefix) => {
    const selectedCard = cardTiers.find(c => c.prefix === prefix);
    localStorage.setItem('selectedUpgrade', JSON.stringify(selectedCard));
    window.location.href = 'check-out/';
}

// --- LOGIKA CHECK-OUT (DI-ATTACH KE WINDOW) ---
window.handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const cardNo = document.getElementById('cardNo').value;
    const name = document.getElementById('cardName').value;
    const cvv = document.getElementById('cvv').value;

    // Validasi Sederhana
    if(cardNo.length < 16 || name.length < 3 || cvv.length < 3) {
        alert("Please fill in valid details.");
        return;
    }

    // Simpan data sementara
    localStorage.setItem('userCheckoutData', JSON.stringify({ cardNo, name, cvv }));

    // Tampilkan halaman PIN
    document.getElementById('step-details').style.display = 'none';
    document.getElementById('step-pin').style.display = 'block';
}

window.handlePinSubmit = (e) => {
    e.preventDefault();
    const pin = document.getElementById('pinInput').value;
    
    if(pin.length !== 6) {
        alert("PIN must be 6 digits");
        return;
    }

    // PIN OK (Simulasi), Lanjut ke Konfirmasi
    window.location.href = '../konfirmasi/';
}

// --- RENDER KONFIRMASI (Untuk konfirmasi/index.html) ---
function renderConfirmation() {
    const upgradeData = JSON.parse(localStorage.getItem('selectedUpgrade'));
    const container = document.getElementById('summaryContainer');
    if(!container) return;

    // Ambil data checkout untuk display nama kartu lama
    const checkoutData = JSON.parse(localStorage.getItem('userCheckoutData'));

    container.innerHTML = `
        <div class="receipt">
            <h3>UPGRADE RECEIPT</h3>
            <p><strong>Old Card:</strong> ${checkoutData.cardNo}</p>
            <hr>
            <p><strong>New Tier:</strong> ${upgradeData.name}</p>
            <p><strong>New Prefix:</strong> ${upgradeData.prefix}</p>
            <p><strong>New Limit:</strong> ${upgradeData.limit}</p>
            <hr>
            <p style="font-size:1.2rem"><strong>Total Cost:</strong></p>
            <p style="font-size:1.5rem; color:var(--accent)">${formatCurrency(upgradeData.price)}</p>
        </div>
    `;
}

// DI-ATTACH KE WINDOW
window.processUpgrade = () => {
    window.location.href = '../sukses/';
}

// --- LOGIKA SUKSES (Untuk sukses/index.html) ---
async function runRealtimeUpdate() {
    const upgradeData = JSON.parse(localStorage.getItem('selectedUpgrade'));
    const checkoutData = JSON.parse(localStorage.getItem('userCheckoutData'));
    
    const statusText = document.getElementById('statusText');
    const oldNumDisplay = document.getElementById('oldNumDisplay');
    const newNumDisplay = document.getElementById('newNumDisplay');

    // 1. Tampilkan nomor lama
    oldNumDisplay.innerText = checkoutData.cardNo;

    // Simulasi Langkah-langkah Supabase
    const steps = [
        "Verifying Balance...",
        "Connecting to Secure Gateway...",
        "Updating Database...",
        "Generating New Card Number..."
    ];

    for (let i = 0; i < steps.length; i++) {
        statusText.innerText = steps[i];
        await new Promise(r => setTimeout(r, 1500)); // Delay simulasi
    }

    // 2. UPDATE LOGIC NOMOR KARTU
    const oldNumber = checkoutData.cardNo.replace(/\s/g, ''); 
    const last12 = oldNumber.substring(4); 
    const newPrefix = upgradeData.prefix; 
    
    const rawNewNum = newPrefix + last12;
    const formattedNewNum = `${rawNewNum.substring(0,4)} ${rawNewNum.substring(4,8)} ${rawNewNum.substring(8,12)} ${rawNewNum.substring(12,16)}`;

    // 3. Update UI
    statusText.innerText = "Upgrade Successful!";
    document.getElementById('loadingIcon').style.display = 'none';
    document.getElementById('successIcon').style.display = 'block';
    
    oldNumDisplay.style.textDecoration = "line-through";
    oldNumDisplay.style.color = "#94a3b8";
    newNumDisplay.innerText = formattedNewNum;

    // Tampilkan tombol Home setelah sukses
    document.getElementById('btnHome').style.display = 'inline-block';

    // 4. KIRIM KE SUPABASE (Contoh Kode)
    // console.log("Sending update to Supabase...");
    // const { data, error } = await _supabase.from('pendaftaran_simulasi').update({ nomor_kartu: formattedNewNum }).eq('nomor_kartu', checkoutData.cardNo);
    
    // Clear storage
    localStorage.removeItem('selectedUpgrade');
    localStorage.removeItem('userCheckoutData');
}

// Init calls depending on page
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('cardsContainer')) renderCards();
    if(document.getElementById('summaryContainer')) renderConfirmation();
    if(document.getElementById('statusText')) runRealtimeUpdate();
});