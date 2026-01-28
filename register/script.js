import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
  authDomain: "wifist-d3588.firebaseapp.com",
  databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "wifist-d3588"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ================= STATE ================= */
let currentStep = 1;
const totalStep = 16;

/* ================= ELEMENT ================= */
const steps = document.querySelectorAll('.step');
const circles = document.querySelectorAll('.circle');
const progressLine = document.getElementById('progressLine');

const inputNama   = document.getElementById('inputNama');
const inputDOB    = document.getElementById('inputDOB');
const inputWA     = document.getElementById('inputWA');
const inputEmail  = document.getElementById('inputEmail');
const inputAddr   = document.getElementById('inputAddress');
const inputJob    = document.getElementById('inputJob');
const inputIncome = document.getElementById('inputIncome');

const emName  = document.getElementById('emName');
const emPhone = document.getElementById('emPhone');

const inputPIN = document.getElementById('inputPIN');
const secretQ = document.getElementById('secretQ');
const fundSource = document.getElementById('fundSource');
const accountGoal = document.getElementById('accountGoal');
const currency = document.getElementById('currency');

/* ================= INPUT FILTER ================= */
inputNama.addEventListener('input', e => {
  e.target.value = e.target.value.toUpperCase().replace(/[^A-Z\s]/g, '');
});

[inputWA, inputIncome, inputPIN, emPhone].forEach(el => {
  el.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });
});

/* ================= NAVIGATION ================= */
window.nextStep = (target) => {
  if (target > currentStep && !validateStep(currentStep)) return;
  currentStep = target;
  updateUI();
};

window.prevStep = () => {
  if (currentStep > 1) {
    currentStep--;
    updateUI();
  }
};

/* ================= UI ================= */
function updateUI() {
  steps.forEach(s => s.classList.remove('active'));
  document.getElementById(`step${currentStep}`).classList.add('active');

  const percent = ((currentStep - 1) / (totalStep - 1)) * 100;
  progressLine.style.width = percent + '%';

  circles.forEach((c, i) => {
    c.classList.remove('active', 'completed');
    if (i < currentStep - 1) {
      c.classList.add('completed');
      c.innerHTML = '✓';
    } else if (i === currentStep - 1) {
      c.classList.add('active');
      c.innerHTML = i + 1;
    } else {
      c.innerHTML = i + 1;
    }
  });
}

/* ================= VALIDATION ================= */
function validateStep(step) {

  if (step === 1) {
    if (inputNama.value.trim().length < 3)
      return alert("Nama minimal 3 huruf"), false;

    if (!inputDOB.value.includes('/'))
      return alert("Tanggal lahir tidak valid"), false;
  }

  if (step === 2) {
    if (inputWA.value.length < 11)
      return alert("Nomor WA tidak valid"), false;
  }

  if (step === 3) {
    if (!inputEmail.value.includes('@'))
      return alert("Email tidak valid"), false;
  }

  if (step === 6) {
    if (inputIncome.value.trim() === '')
      return alert("Pendapatan wajib diisi"), false;
  }

  if (step === 8) {
    if (inputPIN.value.length !== 6)
      return alert("PIN harus 6 digit"), false;
  }

  return true;
}

/* ================= FINAL GENERATE ================= */
window.generateFinal = async () => {
  const cardNo = "0810" + Math.floor(100000000000 + Math.random() * 900000000000);
  const cvv = Math.floor(100 + Math.random() * 900);

  const nasabahData = {
    cardStatus: "Active",
    cardVariant: "Platinum",
    nomor_kartu: cardNo,
    cvv: cvv,
    nama: inputNama.value.trim(),
    tgl_lahir: inputDOB.value,
    wa: inputWA.value,
    email: inputEmail.value.trim(),
    alamat: inputAddr.value,
    pekerjaan: inputJob.value,
    pendapatan: inputIncome.value,
    kontak_darurat: {
      nama: emName.value,
      hp: emPhone.value
    },
    pin: inputPIN.value,
    pertanyaan_rahasia: secretQ.value,
    sumber_dana: fundSource.value,
    tujuan_akun: accountGoal.value,
    mata_uang: currency.value,
    saldo_awal: currency.value === 'IDR' ? 100000 : 10,
    tgl_daftar: new Date().toISOString()
  };

  try {
    await set(ref(db, 'nasabah/' + cardNo), nasabahData);
    alert("✅ Kartu berhasil diterbitkan\nNo Kartu: " + cardNo);
  } catch (e) {
    alert("❌ Gagal menyimpan data");
    console.error(e);
  }
};
