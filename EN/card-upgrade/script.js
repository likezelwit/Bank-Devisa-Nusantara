import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// --- SUPABASE DATABASE CONFIGURATION ---
const SUPABASE_URL = 'https://ndopnxzbaygohzshqphi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3BueHpiYXlnb2h6c2hxcGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzM4ODQsImV4cCI6MjA3OTMwOTg4NH0.nZC5kOVJeMAtfXlwchokXK4FLtPkPoUrxPQUzrz2C8I';
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- CARD TIER DATA STRUCTURE (Including Colors & Features) ---
const cardTiers = [
    { 
        prefix: '0810', name: 'Platinum Basic', limit: 10, price: 0, 
        color: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)', // Grey/Silver
        features: ['Free ATM Withdrawal', 'Mobile Banking Basic']
    },
    { 
        prefix: '0892', name: 'Gold Elite', limit: 14, price: 2500000, 
        color: 'linear-gradient(135deg, #fcd34d 0%, #b45309 100%)', // Gold
        features: ['Priority Support', '1% Cashback']
    },
    { 
        prefix: '0822', name: 'Titanium', limit: 20, price: 8500000, 
        color: 'linear-gradient(135deg, #64748b 0%, #1e293b 100%)', // Dark Grey
        features: ['Lounge Access', '0% Foreign Tx Fee']
    },
    { 
        prefix: '0812', name: 'Diamond I', limit: 24, price: 15000000, 
        color: 'linear-gradient(135deg, #a5f3fc 0%, #0891b2 100%)', // Cyan
        features: ['Concierge Basic', 'Travel Insurance']
    },
    { 
        prefix: '0878', name: 'Diamond II', limit: 27, price: 25000000, 
        color: 'linear-gradient(135deg, #93c5fd 0%, #2563eb 100%)', // Blue
        features: ['VIP Lounge', 'Hotel Discounts']
    },
    { 
        prefix: '0864', name: 'Ruby', limit: 31, price: 45000000, 
        color: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)', // Red
        features: ['Airport Fast Track', 'Spa Vouchers']
    },
    { 
        prefix: '0876', name: 'Sapphire', limit: 35, price: 75000000, 
        color: 'linear-gradient(135deg, #c084fc 0%, #7e22ce 100%)', // Purple
        features: ['Golf Membership', 'Fine Dining Rewards']
    },
    { 
        prefix: '0811', name: 'Emerald', limit: 38, price: 120000000, 
        color: 'linear-gradient(135deg, #6ee7b7 0%, #059669 100%)', // Green
        features: ['Private Butler', 'Car Rental Premium']
    },
    { 
        prefix: '0806', name: 'Amethyst', limit: 40, price: 250000000, 
        color: 'linear-gradient(135deg, #d8b4fe 0%, #7e22ce 100%)', // Deep Purple
        features: ['Yacht Charter Access', 'Event Invites']
    },
    { 
        prefix: '0808', name: 'Black Onyx', limit: 44, price: 500000000, 
        color: 'linear-gradient(135deg, #1e293b 0%, #000000 100%)', // Black
        features: ['No Credit Limit Check', '24/7 Personal Mgr']
    },
    { 
        prefix: '8888', name: 'Centurion', limit: 199, price: 2500000000, 
        color: 'linear-gradient(135deg, #b45309 0%, #000000 100%)', // Black/Gold
        features: ['Jet Charter Points', 'Lifetime Membership']
    },
    { 
        prefix: '8808', name: 'Royal Ascot', limit: 301, price: 15000000000, 
        color: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)', // Deep Red
        features: ['Private Island Access', 'Royal Concierge']
    },
    { 
        prefix: '8870', name: 'Imperial', limit: 899, price: 85000000000, 
        color: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)', // Deep Indigo
        features: ['Personal Security Detail', 'Global Visa Waiver']
    },
    { 
        prefix: '8843', name: 'Sovereign', limit: 1000, price: 500000000000, 
        color: 'linear-gradient(135deg, #0ea5e9 0%, #0f172a 100%)', // Dark Blue
        features: ['Asset Protection', 'Real Estate Discounts']
    },
    { 
        prefix: '8899', name: 'Globalist', limit: 6000, price: 3000000000000, 
        color: 'linear-gradient(135deg, #facc15 0%, #a16207 100%)', // Gold/Dark
        features: ['Private Aviation', 'Global Tax Consultation']
    },
    { 
        prefix: '9012', name: 'Infinite', limit: 10000, price: 15000000000000, 
        color: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', // White/Silver
        features: ['Immigration Support', 'Medical Emergency Team']
    },
    { 
        prefix: '9088', name: 'Quantum', limit: 80000, price: 99000000000000, 
        color: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)', // Electric Blue
        features: ['Space Tourism Tickets', 'AI Personal Assistant']
    },
    { 
        prefix: '9099', name: 'Galactic', limit: 999000, price: 500000000000000, 
        color: 'linear-gradient(135deg, #a855f7 0%, #4c1d95 100%)', // Neon Purple
        features: ['Space Station Visit', 'Orbital Banking']
    },
    { 
        prefix: '9902', name: 'Omnipotent', limit: 'Unlimited', price: 999999999999999, 
        color: 'linear-gradient(135deg, #000000 0%, #ffd700 100%)', // Black/Gold Premium
        features: ['Total Anonymity', 'World Domination Key', 'God Mode Access']
    }
];

// --- CURRENCY FORMATTING FUNCTION ---
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// --- RENDER CARD LIST (For index.html) ---
function renderCards() {
    const container = document.getElementById('cardsContainer');
    if(!container) return;

    container.innerHTML = '';
    const userCurrentPrefix = '0810'; // Simulation of user's current card prefix

    cardTiers.forEach(tier => {
        const isOwned = tier.prefix === userCurrentPrefix;
        const cardEl = document.createElement('div');
        cardEl.className = `card-item ${isOwned ? 'owned' : ''}`;
        
        // Generate Features HTML
        const featuresHtml = tier.features.map(f => 
            `<li><i class="fas fa-check-circle"></i> ${f}</li>`
        ).join('');

        cardEl.innerHTML = `
            ${isOwned ? '<div class="owned-badge">OWNED</div>' : ''}
            
            <div class="card-header" style="background: ${tier.color};">
                <div class="card-badge">Tier ${cardTiers.indexOf(tier) + 1}</div>
                <div class="card-prefix">${tier.prefix}</div>
                <div class="card-name">${tier.name}</div>
            </div>

            <div class="card-body">
                <ul class="card-features">
                    ${featuresHtml}
                </ul>
                
                <div class="card-limit">
                    Limit: ${tier.limit === 'Unlimited' ? '∞ Unlimited' : tier.limit + ' Million'}
                </div>
                
                <div class="card-price">${tier.price === 0 ? 'Free' : formatCurrency(tier.price)}</div>
                
                ${!isOwned ? 
                    `<button class="btn-upgrade" onclick="window.selectUpgrade('${tier.prefix}')">Upgrade Now</button>` 
                    : ''}
            `;
        container.appendChild(cardEl);
    });
}

// --- UPGRADE SELECTION ---
window.selectUpgrade = (prefix) => {
    const selectedCard = cardTiers.find(c => c.prefix === prefix);
    localStorage.setItem('selectedUpgrade', JSON.stringify(selectedCard));
    window.location.href = 'check-out/';
}

// --- CHECKOUT VERIFICATION LOGIC ---
window.handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    const cardNo = document.getElementById('cardNo').value;
    const name = document.getElementById('cardName').value;
    const cvv = document.getElementById('cvv').value;

    if(cardNo.length < 16 || name.length < 3 || cvv.length < 3) {
        alert("Please enter valid card details.");
        return;
    }

    const { data: cardData, error } = await _supabase
        .from('pendaftaran_simulasi')
        .select('*')
        .eq('nomor_kartu', cardNo)
        .single(); 

    if (error || !cardData) {
        alert("Card number not found in our system.");
        return;
    }

    const savedCvv = cardData.detail_data?.card_meta?.cvv;
    
    if (String(savedCvv) !== String(cvv)) {
        alert("Security code (CVV) is incorrect. Please check again.");
        return;
    }

    if (cardData.nama_lengkap.toLowerCase() !== name.toLowerCase()) {
        alert("Cardholder name does not match the card number entered.");
        return;
    }

    localStorage.setItem('verifiedCardNo', cardNo);

    document.getElementById('step-details').style.display = 'none';
    document.getElementById('step-pin').style.display = 'block';
}

// --- PIN VERIFICATION LOGIC ---
window.handlePinSubmit = async (e) => {
    e.preventDefault();
    const pinInput = document.getElementById('pinInput').value;
    
    if(pinInput.length !== 6) {
        alert("PIN must be 6 digits.");
        return;
    }

    const verifiedCardNo = localStorage.getItem('verifiedCardNo');
    
    if (!verifiedCardNo) {
        alert("Session expired, please start over.");
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
        alert("Transaction PIN is incorrect. Transaction cancelled.");
        return;
    }

    window.location.href = '../konfirmasi/';
}

// --- RENDER CONFIRMATION DETAILS (For konfirmasi/index.html) ---
function renderConfirmation() {
    const upgradeData = JSON.parse(localStorage.getItem('selectedUpgrade'));
    const container = document.getElementById('summaryContainer');
    if(!container) return;

    const verifiedCardNo = localStorage.getItem('verifiedCardNo');

    container.innerHTML = `
        <div class="receipt">
            <h3>UPGRADE TRANSACTION RECEIPT</h3>
            <p><strong>Old Card:</strong> ${verifiedCardNo}</p>
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

window.processUpgrade = () => {
    window.location.href = '../sukses/';
}

// --- SUCCESS LOGIC, UPDATE DB, DEDUCT BALANCE & UPDATE LIMIT ---
async function runRealtimeUpdate() {
    const upgradeData = JSON.parse(localStorage.getItem('selectedUpgrade'));
    const verifiedCardNo = localStorage.getItem('verifiedCardNo');
    
    const statusText = document.getElementById('statusText');
    const oldNumDisplay = document.getElementById('oldNumDisplay');
    const newNumDisplay = document.getElementById('newNumDisplay');

    // 1. First Step: Verify Account Balance
    statusText.innerText = "Verifying Account Balance...";
    await new Promise(r => setTimeout(r, 1000)); 

    const { data: currentCardData, error: fetchError } = await _supabase
        .from('pendaftaran_simulasi')
        .select('*')
        .eq('nomor_kartu', verifiedCardNo)
        .single();

    if (fetchError || !currentCardData) {
        console.error("Failed to fetch customer data:", fetchError);
        statusText.innerText = "Failed to load customer data.";
        return;
    }

    // PARSE CURRENT BALANCE
    const balanceString = currentCardData.detail_data?.account_info?.balance || "0";
    const currentBalance = parseInt(balanceString.replace(/[^0-9]/g, '')) || 0;
    
    // UPGRADE PRICE
    const upgradePrice = upgradeData.price;

    // CHECK IF SUFFICIENT FUNDS
    if (currentBalance < upgradePrice) {
        statusText.innerText = "Insufficient Funds";
        statusText.style.color = "var(--danger)"; 
        
        document.getElementById('loadingIcon').style.display = 'none';
        
        alert(
            `TRANSACTION DECLINED.\n\n` +
            `Your Balance: ${formatCurrency(currentBalance)}\n` +
            `Upgrade Price: ${formatCurrency(upgradePrice)}\n\n` +
            `Please top up your balance first.`
        );

        document.getElementById('btnHome').innerText = "Back to Confirmation";
        document.getElementById('btnHome').onclick = () => window.location.href = '../konfirmasi/';
        document.getElementById('btnHome').style.display = 'inline-block';
        
        return; 
    }

    // IF FUNDS SUFFICIENT, PROCEED WITH SIMULATION
    const steps = [
        "Balance Confirmed Sufficient",
        "Connecting to Secure Payment Gateway...",
        "Processing Balance Deduction...",
        "Updating Card Limit...",
        "Updating Main Database..."
    ];

    for (let i = 0; i < steps.length; i++) {
        statusText.innerText = steps[i];
        await new Promise(r => setTimeout(r, 1500));
    }

    // 2. NEW CARD NUMBER GENERATION LOGIC
    const oldNumber = verifiedCardNo.replace(/\s/g, ''); 
    const last12 = oldNumber.substring(4); 
    const newPrefix = upgradeData.prefix; 
    
    const rawNewNum = newPrefix + last12;
    const formattedNewNum = `${rawNewNum.substring(0,4)} ${rawNewNum.substring(4,8)} ${rawNewNum.substring(8,12)} ${rawNewNum.substring(12,16)}`;

    // 3. NEW BALANCE & LIMIT CALCULATION LOGIC
    // New Balance = Old Balance - Upgrade Price
    const newBalanceVal = currentBalance - upgradePrice;
    const newBalanceStr = formatCurrency(newBalanceVal);

    // New Limit based on selected Tier
    const newLimitStr = upgradeData.limit === 'Unlimited' ? 'Unlimited' : upgradeData.limit + ' Million';

    // Assemble New Detail Data Object (Merge with old data)
    const currentDetailData = currentCardData.detail_data || {};
    const newDetailData = {
        ...currentDetailData, // Keep CVV, PIN, Audit Trail, etc.
        account_info: {
            ...currentDetailData.account_info, // Keep currency, etc.
            balance: newBalanceStr,     // UPDATE BALANCE HERE
            limit: newLimitStr            // UPDATE LIMIT HERE
        }
    };

    // 4. EXECUTE SUPABASE DATABASE UPDATE
    try {
        const { error: updateError } = await _supabase
            .from('pendaftaran_simulasi')
            .update({
                nomor_kartu: formattedNewNum, // Update Card Number
                detail_data: newDetailData        // Update Detail Data (Balance & Limit)
            })
            .eq('nomor_kartu', verifiedCardNo);

        if (updateError) {
            throw updateError;
        }

        // 5. UPDATE USER INTERFACE
        statusText.innerText = "Upgrade Successful!";
        statusText.style.color = "var(--primary)"; 
        document.getElementById('loadingIcon').style.display = 'none';
        document.getElementById('successIcon').style.display = 'block';
        
        oldNumDisplay.style.textDecoration = "line-through";
        oldNumDisplay.style.color = "#94a3b8";
        newNumDisplay.innerText = formattedNewNum;

        document.getElementById('btnHome').innerText = "Return to Home";
        document.getElementById('btnHome').onclick = () => window.location.href = '../../';
        document.getElementById('btnHome').style.display = 'inline-block';
        
        console.log("Database updated successfully. Balance and Limit have been updated.");

    } catch (err) {
        console.error("Failed to update database:", err);
        statusText.innerText = "Failed to process upgrade. Please contact CS.";
        statusText.style.color = "red";
    }

    // 6. CLEAR LOCAL STORAGE
    localStorage.removeItem('selectedUpgrade');
    localStorage.removeItem('verifiedCardNo');
}

// --- PAGE INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('cardsContainer')) renderCards();
    if(document.getElementById('summaryContainer')) renderConfirmation();
    if(document.getElementById('statusText')) runRealtimeUpdate();
});