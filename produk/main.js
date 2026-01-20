const dbProduk = {
    cards: [
        {
            name: "Black Signature",
            desc: "Batas pengeluaran tak terbatas untuk gaya hidup tanpa batas.",
            icon: "💳",
            features: ["Personal Concierge 24/7", "Private Jet Charters", "VIP Airport Access"],
            link: "../card-issue/"
        },
        {
            name: "Diamond Royal",
            desc: "Simbol status tertinggi dengan berlian asli di kartu fisik.",
            icon: "💎",
            features: ["Dedicated Personal Banker", "Estate Management", "Exclusive Gala Access"],
            link: "../card-issue/"
        }
    ],
    wealth: [
        {
            name: "Asset Management",
            desc: "Optimalkan kekayaan Anda dengan strategi investasi global.",
            icon: "📈",
            features: ["Global Portfolio Diversification", "Tax Optimization", "Retirement Planning"],
            link: "#"
        },
        {
            name: "Trust Services",
            desc: "Pastikan warisan Anda terlindungi untuk generasi mendatang.",
            icon: "📜",
            features: ["Will & Estate Planning", "Family Office Setup", "Asset Protection"],
            link: "#"
        }
    ],
    lifestyle: [
        {
            name: "Global Concierge",
            desc: "Layanan asisten pribadi untuk segala kebutuhan mewah Anda.",
            icon: "🌍",
            features: ["Hard-to-get Reservations", "Personal Shopper", "Event Ticketing"],
            link: "#"
        },
        {
            name: "Yacht & Jet Club",
            desc: "Akses eksklusif ke armada transportasi mewah dunia.",
            icon: "🛥️",
            features: ["Priority Booking", "Luxury Cabin Service", "Global Hub Access"],
            link: "#"
        }
    ]
};

const grid = document.getElementById('productGrid');

window.filterTab = function(category) {
    // Update Active Button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(category.slice(0,3))) {
            btn.classList.add('active');
        }
    });

    // Render Products
    const items = dbProduk[category];
    grid.innerHTML = items.map(item => `
        <div class="card">
            <div class="card-icon">${item.icon}</div>
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <ul class="feature-list">
                ${item.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <button class="btn-card" onclick="window.location.href='${item.link}'">Pelajari Lebih Lanjut</button>
        </div>
    `).join('');
};

// Load default tab
filterTab('cards');
