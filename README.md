# 🏦 Bank Devisa Nusantara - Web Simulation

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://likezelwit.github.io/Bank-Devisa-Nusantara/)
![Status](https://img.shields.io/badge/Project-Educational-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Firebase](https://img.shields.io/badge/Database-Firebase-orange)

> **Link Akses:** [https://likezelwit.github.io/Bank-Devisa-Nusantara/](https://likezelwit.github.io/Bank-Devisa-Nusantara/)

---

## ⚠️ PERINGATAN / DISCLAIMER
**ID:** Situs ini adalah proyek simulasi pendidikan untuk keperluan portofolio pengembangan web. Situs ini **BUKAN** merupakan institusi keuangan resmi. Jangan memasukkan data pribadi asli seperti PIN atau Password bank asli Anda ke dalam sistem ini.

**EN:** *This is a strictly educational simulation project for web development portfolio purposes. It is **NOT** a real financial institution. Please do not enter real personal data such as your actual bank PIN or Password into this system.*

---

## 📸 Tampilan Aplikasi (Preview)

### 🖥️ Dashboard Utama
Tampilan antarmuka yang bersih dengan akses cepat ke pendaftaran nasabah dan manajemen kartu.
<img width="100%" alt="Dashboard Utama" src="https://github.com/user-attachments/assets/45d44abe-d201-48e7-ac77-e81d85934bb8" />

### 📱 Produk & Layanan
Edukasi keuangan dan manajemen bantuan nasabah terintegrasi dalam satu halaman.
<img width="100%" alt="Layanan" src="https://github.com/user-attachments/assets/580e12e8-9f74-4bec-aea6-8245f70bbaa2" />

### 🛡️ Sistem Keamanan & Autentikasi
Proses validasi kartu dan PIN untuk keamanan transaksi nasabah.
<img width="100%" alt="Login" src="https://github.com/user-attachments/assets/78606d6b-5fea-4671-9897-fb64796245e3" />

---

## 🚀 Tentang Proyek
Bank Devisa Nusantara adalah aplikasi perbankan digital berbasis web (**Single Page Application**) yang fokus pada kemudahan transaksi menggunakan teknologi **QR Code**. Proyek ini mendemonstrasikan integrasi database *real-time* dan sistem *scanning* QR di sisi klien.

## ✨ Fitur Utama
- **QR-Pay Generation**: Membuat kode QR unik berdasarkan token keamanan (`CodeQR`) yang tersimpan di Firebase.
- **Smart QR Scanner**: Pemindaian QR secara real-time untuk mencari data nasabah penerima secara otomatis.
- **Real-time Transaction**: Pembaruan saldo pengirim dan penerima secara instan menggunakan Firebase Realtime Database.
- **Secure PIN Verification**: Lapisan keamanan tambahan sebelum melakukan transaksi.
- **Session Management**: Menggunakan `sessionStorage` untuk menjaga keamanan data sesi pengguna.

## 🛠️ Teknologi yang Digunakan
- **Frontend**: HTML5, CSS3 (Custom Variables & Animations), JavaScript (ES6+ Modules)
- **Database**: [Firebase Realtime Database](https://firebase.google.com/)
- **QR Engine**: [QRCode.js](https://davidshimjs.github.io/qrcodejs/) & [Html5-QRCode](https://github.com/mebjas/html5-qrcode)
- **Hosting**: GitHub Pages

## 🔧 Cara Menjalankan Secara Lokal
1. Clone repositori ini:
   ```bash
   git clone [https://github.com/likezelwit/Bank-Devisa-Nusantara.git](https://github.com/likezelwit/Bank-Devisa-Nusantara.git)
