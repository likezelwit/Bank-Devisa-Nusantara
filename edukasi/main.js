const articles = [
    {
        id: 1,
        title: "Strategi Diversifikasi Aset di Era Volatilitas Tinggi",
        desc: "Bagaimana mengamankan portofolio Anda dari inflasi global dengan instrumen safe-haven.",
        content: "Diversifikasi bukan sekadar membagi uang Anda ke berbagai tempat, melainkan seni menyeimbangkan risiko. Di tahun 2026 ini, ketegangan geopolitik membuat aset seperti Emas dan Devisa Valuta Asing menjadi primadona. BDN menyarankan alokasi 30% pada instrumen likuid tinggi untuk menjaga ketahanan finansial keluarga Anda dalam jangka panjang.",
        category: "STRATEGY",
        featured: true,
        thumbColor: "#1e293b"
    },
    {
        id: 2,
        title: "Mengenal Suku Bunga Devisa",
        desc: "Panduan lengkap mengenai pengaruh suku bunga terhadap tabungan valuta asing Anda.",
        content: "Suku bunga devisa ditentukan oleh pergerakan pasar global. Memahami kapan harus menyimpan dalam USD atau EUR adalah kunci keuntungan nasabah Private Banking. Di BDN, kami memberikan update harian untuk memastikan kurs yang Anda dapatkan adalah yang terbaik di kelasnya.",
        category: "BASIC",
        thumbColor: "#f1f5f9"
    },
    {
        id: 3,
        title: "Preservasi Kekayaan Antar Generasi",
        desc: "Pentingnya Will & Trust Management dalam menjaga warisan keluarga tetap utuh.",
        content: "Banyak kekayaan keluarga hilang pada generasi ketiga. Melalui layanan Trust BDN, Anda bisa mengatur pembagian aset secara hukum yang kuat, memastikan anak cucu Anda tetap menikmati fasilitas hidup yang sama tanpa risiko sengketa hukum di masa depan.",
        category: "LEGACY",
        thumbColor: "#fff7ed"
    }
];

const featuredSection = document.getElementById('featuredSection');
const articleGrid = document.getElementById('articleGrid');
const modal = document.getElementById('articleModal');
const modalBody = document.getElementById('modalBody');

// Fungsi Render
function renderEducation() {
    const featured = articles.find(a => a.featured);
    const others = articles.filter(a => !a.featured);

    featuredSection.innerHTML = `
        <div class="featured-content">
            <span style="color:var(--gold); font-weight:800;">ARTICLE OF THE MONTH</span>
            <h2>${featured.title}</h2>
            <p>${featured.desc}</p>
            <button onclick="openArticle(${featured.id})" style="padding:15px 30px; border-radius:12px; border:none; background:var(--gold); color:white; font-weight:700; cursor:pointer;">Baca Sekarang</button>
        </div>
    `;

    articleGrid.innerHTML = others.map(a => `
        <div class="article-card" onclick="openArticle(${a.id})">
            <div class="article-thumb" style="background: ${a.thumbColor}">
                <span class="category-tag">${a.category}</span>
            </div>
            <h3>${a.title}</h3>
            <p>${a.desc}</p>
            <span class="read-more">BACA SELENGKAPNYA →</span>
        </div>
    `).join('');
}

// Fungsi Buka Artikel
window.openArticle = function(id) {
    const article = articles.find(a => a.id === id);
    modalBody.innerHTML = `
        <span class="meta-info">${article.category}</span>
        <h2>${article.title}</h2>
        <div class="full-text">
            <p>${article.content}</p>
            <p>Untuk konsultasi lebih lanjut mengenai topik ini, silakan hubungi Relationship Manager BDN Anda melalui layanan 24/7 Priority Concierge.</p>
        </div>
    `;
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Kunci scroll latar belakang
};

// Fungsi Tutup Artikel
window.closeArticle = function() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Aktifkan scroll lagi
};

// Klik di luar modal untuk menutup
window.onclick = function(event) {
    if (event.target == modal) closeArticle();
};

renderEducation();
