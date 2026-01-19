let appType = ''; // DEBIT atau KREDIT
let currentStep = 0;
const totalSteps = 8;

// Init Progress Circles
const pContainer = document.getElementById('pContainer');
for(let i=1; i<=totalSteps; i++) {
    pContainer.innerHTML += `<div class="circle" id="c${i}">${i}</div>`;
}

function startApp(type) {
    appType = type;
    document.getElementById('cardTypeHeader').innerText = type === 'DEBIT' ? 'DEBIT CARD' : 'CREDIT CARD';
    nextStep(1);
}

function nextStep(s) {
    // Validasi Dasar
    if(s === 2 && document.getElementById('inputNama').value === "") return alert("Nama wajib diisi!");
    if(s === 6 && document.getElementById('inputPW').value.length < 6) return alert("PIN wajib 6 digit!");

    currentStep = s;
    updateUI(s);

    // Simulasi SLIK OJK di Tahap 6
    if(s === 6) {
        simulasiSlik();
    }
}

function updateUI(s) {
    document.querySelectorAll('.step').forEach(div => div.classList.remove('active'));
    document.getElementById('step' + s).classList.add('active');

    // Progress Bar
    const percent = ((s - 1) / (totalSteps - 1)) * 100;
    document.getElementById('progressLine').style.width = percent + "%";

    // Circles
    for(let i=1; i<=totalSteps; i++) {
        const c = document.getElementById('c'+i);
        if(i < s) { c.classList.add('completed'); c.innerHTML = '✓'; }
        else if(i === s) { c.classList.add('active'); c.innerHTML = i; }
    }
}

function simulasiSlik() {
    const statusText = document.getElementById('slikStatus');
    const btn = document.getElementById('btnSlik');
    
    setTimeout(() => { statusText.innerText = "Memeriksa riwayat kredit di database BI/SLIK..."; }, 1000);
    setTimeout(() => { 
        statusText.innerHTML = "<b style='color:green'>SKOR KREDIT: A1 (Sangat Baik)</b><br>Identitas terverifikasi. Pengajuan dapat dilanjutkan.";
        btn.style.display = "block";
    }, 3000);
}

async function generateFinal() {
    if(!document.getElementById('checkAgree').checked) return alert("Setujui deklarasi!");
    
    const btn = document.getElementById('btnGenerate');
    btn.disabled = true; btn.innerText = "MENERBITKAN KARTU...";

    const nama = document.getElementById('inputNama').value;
    const pin = document.getElementById('inputPW').value;
    const rand = Array.from({length: 12}, () => Math.floor(Math.random() * 10)).join('');
    const fullNo = "0810" + rand;

    try {
        await db.collection("nasabah").add({
            nama: nama,
            nomor_kartu: fullNo,
            pin: pin,
            tipe: appType,
            saldo: 0,
            tgl: new Date().toISOString()
        });

        document.getElementById('displayNo').innerText = fullNo.match(/.{1,4}/g).join(" ");
        document.getElementById('displayName').innerText = nama.toUpperCase();
        updateUI(8);
    } catch(e) { alert("Error!"); btn.disabled = false; }
}

function takeScreenshot() {
    html2canvas(document.getElementById('captureArea'), {scale: 3}).then(canvas => {
        const link = document.createElement('a');
        link.download = `BDN-${appType}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}
