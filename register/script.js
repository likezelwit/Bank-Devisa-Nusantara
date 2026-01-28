<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#0f172a">
  <title>Registrasi Nasabah | BDN</title>

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="navbar">
  <div class="logo">BDN<span>.</span></div>
  <a href="../" class="btn-back">BATAL</a>
</nav>

<main class="container">
<div class="form-wrapper">

<!-- PROGRESS -->
<div class="progress-container">
  <div class="progress-bar-bg">
    <div class="progress-line" id="progressLine"></div>
  </div>

  <!-- 1–16 -->
  <div class="circle active">1</div>
  <div class="circle">2</div>
  <div class="circle">3</div>
  <div class="circle">4</div>
  <div class="circle">5</div>
  <div class="circle">6</div>
  <div class="circle">7</div>
  <div class="circle">8</div>
  <div class="circle">9</div>
  <div class="circle">10</div>
  <div class="circle">11</div>
  <div class="circle">12</div>
  <div class="circle">13</div>
  <div class="circle">14</div>
  <div class="circle">15</div>
  <div class="circle">16</div>
</div>

<div class="form-content">

<!-- STEP 1 -->
<div class="step active" id="step1">
  <h2>01. Identitas Personal</h2>

  <label>Nama Lengkap</label>
  <input type="text" id="inputNama">

  <label>Tanggal Lahir (DD/MM/YYYY)</label>
  <input type="text" id="inputDOB">

  <button class="btn-primary" onclick="nextStep(2)">Lanjutkan</button>
</div>

<!-- STEP 2 -->
<div class="step" id="step2">
  <h2>02. Nomor WhatsApp</h2>
  <input type="tel" id="inputWA">
  <button class="btn-primary" onclick="nextStep(3)">Lanjut</button>
</div>

<!-- STEP 3 -->
<div class="step" id="step3">
  <h2>03. Email</h2>
  <input type="email" id="inputEmail">
  <button class="btn-primary" onclick="nextStep(4)">Lanjut</button>
</div>

<!-- STEP 4 -->
<div class="step" id="step4">
  <h2>04. Negara Domisili</h2>
  <select id="countrySelect">
    <option value="ID">Indonesia</option>
    <option value="US">United States</option>
  </select>
  <button class="btn-primary" onclick="nextStep(5)">Lanjut</button>
</div>

<!-- STEP 5 -->
<div class="step" id="step5">
  <h2>05. Alamat</h2>
  <textarea id="inputAddress"></textarea>
  <button class="btn-primary" onclick="nextStep(6)">Lanjut</button>
</div>

<!-- STEP 6 -->
<div class="step" id="step6">
  <h2>06. Pekerjaan & Pendapatan</h2>
  <input type="text" id="inputJob" placeholder="Pekerjaan">
  <input type="text" id="inputIncome" placeholder="Pendapatan">
  <button class="btn-primary" onclick="nextStep(7)">Lanjut</button>
</div>

<!-- STEP 7 -->
<div class="step" id="step7">
  <h2>07. Kontak Darurat</h2>
  <input type="text" id="emName" placeholder="Nama keluarga">
  <input type="tel" id="emPhone" placeholder="Nomor HP">
  <button class="btn-primary" onclick="nextStep(8)">Lanjut</button>
</div>

<!-- STEP 8 -->
<div class="step" id="step8">
  <h2>08. Keamanan Akun</h2>

  <input type="password" id="inputPIN" maxlength="6" placeholder="PIN 6 digit">

  <input type="text" id="secretQ" placeholder="Pertanyaan rahasia">

  <select id="fundSource">
    <option value="Gaji">Gaji</option>
    <option value="Usaha">Usaha</option>
    <option value="Lainnya">Lainnya</option>
  </select>

  <select id="accountGoal">
    <option value="Tabungan">Tabungan</option>
    <option value="Transaksi">Transaksi</option>
    <option value="Investasi">Investasi</option>
  </select>

  <select id="currency">
    <option value="IDR">IDR</option>
    <option value="USD">USD</option>
  </select>

  <button class="btn-primary" onclick="nextStep(9)">Lanjut</button>
</div>

<!-- STEP 9–15 -->
<div class="step" id="step9"><h2>09. Verifikasi Internal</h2><button onclick="nextStep(10)">Lanjut</button></div>
<div class="step" id="step10"><h2>10. Analisis Sistem</h2><button onclick="nextStep(11)">Lanjut</button></div>
<div class="step" id="step11"><h2>11. BI Checking</h2><button onclick="nextStep(12)">Lanjut</button></div>
<div class="step" id="step12"><h2>12. Risiko</h2><button onclick="nextStep(13)">Lanjut</button></div>
<div class="step" id="step13"><h2>13. Kepatuhan</h2><button onclick="nextStep(14)">Lanjut</button></div>
<div class="step" id="step14"><h2>14. Konfirmasi</h2><button onclick="nextStep(15)">Lanjut</button></div>
<div class="step" id="step15"><h2>15. Finalisasi</h2><button onclick="nextStep(16)">Lanjut</button></div>

<!-- STEP 16 -->
<div class="step" id="step16">
  <h2>16. Terbitkan Kartu</h2>
  <button class="btn-primary" onclick="generateFinal()">TERBITKAN KARTU</button>
</div>

</div>
</div>
</main>

<script type="module" src="script.js"></script>
</body>
</html>
