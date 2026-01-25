document.addEventListener('DOMContentLoaded', () => {
    console.log("BDN Main Portal 2026 - Security & Interface Ready.");

    // Handle Empty Links
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const path = this.getAttribute('href');
            if (path === "#" || path === "") {
                e.preventDefault();
                showNotification();
            }
        });
    });

    // Custom Alert/Notification
    function showNotification() {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: #0f172a; color: white; padding: 12px 24px;
            border-radius: 12px; font-weight: 600; font-size: 0.9rem;
            z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            animation: slideUp 0.3s ease-out;
        `;
        div.innerText = "🚧 Modul ini sedang dalam pengembangan.";
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.animation = "slideDown 0.3s ease-in";
            setTimeout(() => div.remove(), 300);
        }, 3000);
    }

    // CSS for Notification animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideUp { from { bottom: -50px; opacity: 0; } to { bottom: 20px; opacity: 1; } }
        @keyframes slideDown { from { bottom: 20px; opacity: 1; } to { bottom: -50px; opacity: 0; } }
    `;
    document.head.appendChild(style);
});
