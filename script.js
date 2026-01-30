document.addEventListener('DOMContentLoaded', () => {
    const agreeCheck = document.getElementById('agreeCheck');
    const btnContinue = document.getElementById('btnContinue');
    const overlay = document.getElementById('disclaimer-overlay');
    const appWrapper = document.getElementById('app-wrapper');

    // Handle Disclaimer Logic
    agreeCheck.addEventListener('change', () => {
        btnContinue.disabled = !agreeCheck.checked;
    });

    btnContinue.addEventListener('click', () => {
        overlay.style.display = 'none';
        appWrapper.classList.remove('blurred-app');
        appWrapper.style.pointerEvents = 'auto';
    });
});
