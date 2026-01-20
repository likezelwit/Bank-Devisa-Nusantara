const articles = [
    {
        id: 1,
        title: "Strategi Diversifikasi Aset di Era Volatilitas Tinggi",
        desc: "Bagaimana mengamankan portofolio Anda dari inflasi global dengan instrumen safe-haven.",
        category: "STRATEGY",
        featured: true,
        bg: "linear-gradient(45deg, #1e293b, #334155)"
    },
    {
        id: 2,
        title: "Mengenal Suku Bunga Devisa",
        desc: "Panduan lengkap mengenai pengaruh suku bunga terhadap tabungan valuta asing Anda.",
        category: "BASIC",
        thumb: "#f1f5f9"
    },
    {
        id: 3,
        title: "Preservasi Kekayaan Antar Generasi",
        desc: "Pentingnya Will & Trust Management dalam menjaga warisan keluarga tetap utuh.",
        category: "LEGACY",
        thumb: "#fff7ed"
    },
    {
        id: 4,
        title: "Investasi ESG: Keuntungan & Etika",
        desc: "Mengapa investasi berkelanjutan menjadi tren utama di kalangan milyarder dunia.",
        category: "INVESTMENT",
        thumb: "#f0fdf4"
    }
];

const featuredSection = document.getElementById('featuredSection');
const articleGrid = document.getElementById('articleGrid');

function renderEducation() {
    const featured = articles.find(a => a.featured);
    const others = articles.filter(a => !a.featured);

    // Render Featured
    featuredSection.innerHTML = `
        <div class="featured-content">
            <span style="color:var(--gold); font-weight:800; font-size:0.8rem;">FEATURED ARTICLE</span>
            <h2>${featured.title}</h2>
            <p>${featured.desc}</p>
            <button style="padding:15px 30px; border-radius:12px; border:none; background:var(--gold); color:white; font-weight:700; cursor:pointer;">Baca Selengkapnya</button>
        </div>
    `;

    // Render Others
    articleGrid.innerHTML = others.map(a => `
        <div class="article-card">
            <div class="article-thumb" style="background-color: ${a.thumb}">
                <span class="category-tag">${a.category}</span>
            </div>
            <h3>${a.title}</h3>
            <p>${a.desc}</p>
            <a href="#" class="read-more">BACA ARTIKEL →</a>
        </div>
    `).join('');
}

renderEducation();
