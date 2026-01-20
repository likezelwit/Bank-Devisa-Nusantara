const articles = [
    {
        id: 1,
        title: "Navigasi Kekayaan di Era Ekonomi Digital 2026",
        category: "MACRO STRATEGY",
        desc: "Bagaimana teknologi blockchain dan AI mendefinisikan ulang cara miliarder dunia menyimpan aset mereka.",
        content: `
            <h4>Pendahuluan</h4>
            <p>Memasuki tahun 2026, lanskap ekonomi global telah berubah secara drastis. Inflasi yang fluktuatif dan munculnya mata uang digital bank sentral (CBDC) menuntut nasabah untuk berpikir lebih jauh dari sekadar tabungan konvensional.</p>
            
            <h4>Diversifikasi Agresif</h4>
            <p>Nasabah BDN Private Banking kini mulai mengalokasikan 15-20% aset mereka ke dalam infrastruktur teknologi hijau dan aset digital yang teregulasi. Ini bukan lagi soal spekulasi, melainkan tentang ketahanan (resilience) jangka panjang terhadap guncangan mata uang fiat.</p>

            <h4>Peran Emas dan Devisa</h4>
            <p>Meskipun dunia semakin digital, emas tetap menjadi 'Ultimate Safe Haven'. Kami merekomendasikan penyimpanan emas fisik di Safe Deposit Box BDN yang terintegrasi dengan asuransi internasional, dikombinasikan dengan simpanan devisa kuat seperti CHF (Swiss Franc) dan SGD.</p>

            <p>Kesimpulannya, strategi terbaik di tahun ini adalah tetap likuid namun terdiversifikasi secara global.</p>
        `,
        icon: "🏛️",
        featured: true
    },
    {
        id: 2,
        title: "Pentingnya Family Office & Trust",
        category: "FAMILY LEGACY",
        desc: "Menjaga warisan keluarga agar tidak habis di generasi ketiga dengan sistem hukum yang kuat.",
        content: `
            <h4>Filosofi Warisan</h4>
            <p>Statistik menunjukkan bahwa 70% kekayaan keluarga hilang di generasi kedua, dan 90% hilang di generasi ketiga. Mengapa hal ini terjadi? Karena kurangnya struktur hukum dan edukasi finansial bagi penerus.</p>
            
            <h4>Layanan Trust BDN</h4>
            <p>Melalui BDN Trust Services, Anda dapat membuat instruksi yang mengikat secara hukum mengenai bagaimana aset Anda dikelola bahkan setelah Anda tidak ada. Ini mencakup dana pendidikan untuk cucu, pembagian laba bisnis, hingga pengelolaan properti internasional.</p>

            <p>Jangan biarkan kerja keras Anda hilang begitu saja. Mulailah menyusun Family Office Anda hari ini bersama Relationship Manager kami.</p>
        `,
        icon: "📜",
        featured: false
    },
    {
        id: 3,
        title: "Investasi Properti Global 101",
        category: "REAL ESTATE",
        desc: "Membedah pasar properti di London, Dubai, dan Singapura untuk nasabah prioritas.",
        content: `
            <h4>Mengapa Properti Internasional?</h4>
            <p>Memiliki properti di pusat finansial dunia bukan hanya soal gaya hidup, tapi soal diversifikasi mata uang dan hak residensi. London tetap menjadi favorit karena stabilitas hukumnya, sementara Dubai menawarkan keuntungan pajak yang luar biasa.</p>
            
            <h4>Kemudahan Pembiayaan BDN</h4>
            <p>BDN memberikan fasilitas kredit lintas negara. Anda bisa menjaminkan aset di Indonesia untuk mendapatkan pinjaman pembelian apartemen di Singapura dengan bunga yang sangat kompetitif.</p>

            <p>Dapatkan akses eksklusif ke listing properti 'Off-Market' melalui jaringan mitra global kami.</p>
        `,
        icon: "🏢",
        featured: false
    }
];

const featuredSection = document.getElementById('featuredSection');
const articleGrid = document.getElementById('articleGrid');
const modal = document.getElementById('articleModal');
const modalBody = document.getElementById('modalBody');

function render() {
    const featured = articles.find(a => a.featured);
    const others = articles.filter(a => !a.featured);

    featuredSection.innerHTML = `
        <div class="featured-article">
            <span class="category">${featured.category}</span>
            <h2>${featured.title}</h2>
            <p>${featured.desc}</p>
            <button onclick="openArticle(${featured.id})" style="width:fit-content; padding:15px 35px; border-radius:100px; border:none; background:var(--gold); color:white; font-weight:800; cursor:pointer;">BACA ANALISIS</button>
        </div>
    `;

    articleGrid.innerHTML = others.map(a => `
        <div class="article-card" onclick="openArticle(${a.id})">
            <div class="article-thumb">${a.icon}</div>
            <span class="category">${a.category}</span>
            <h3>${a.title}</h3>
            <p>${a.desc}</p>
        </div>
    `).join('');
}

window.openArticle = (id) => {
    const a = articles.find(art => art.id === id);
    modalBody.innerHTML = `
        <span class="category">${a.category}</span>
        <h2 style="font-size: 2.5rem; margin: 15px 0;">${a.title}</h2>
        <div class="full-text">${a.content}</div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
};

window.closeArticle = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
};

// Tutup modal jika klik di area gelap
window.onclick = (e) => { if(e.target == modal) closeArticle(); };

render();
