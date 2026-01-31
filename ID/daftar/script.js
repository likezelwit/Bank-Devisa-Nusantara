// 1. WAJIB IMPORT BIAR GAK ERROR 'SUPABASE IS NOT DEFINED'
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://ndopnxzbaygohzshqphi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3BueHpiYXlnb2h6c2hxcGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzM4ODQsImV4cCI6MjA3OTMwOTg4NH0.nZC5kOVJeMAtfXlwchokXK4FLtPkPoUrxPQUzrz2C8I';

// 2. Inisialisasi dengan createClient (sesuai import di atas)
const _supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

window.checkAge = () => {
    const year = document.getElementById('dobYYYY').value;
    if(year && year < 2024) {
        document.getElementById('step-0').style.display = 'none';
        document.getElementById('step-1').style.display = 'block';
    } else {
        alert("Masukkan tahun lahir yang bener dong!");
    }
};

window.submitToSupabase = async () => {
    const btn = document.getElementById('btnSubmit');
    const nama = document.getElementById('fullName').value;
    
    if(!nama) return alert("Nama jangan kosong!");

    btn.innerText = "Loading...";
    btn.disabled = true;

    const noKartu = "4512 " + Math.floor(1000 + Math.random() * 9000) + " " + Math.floor(1000 + Math.random() * 9000) + " " + Math.floor(1000 + Math.random() * 9000);

    try {
        const { error } = await _supabase
            .from('pendaftaran_simulasi')
            .insert([{ nama_lengkap: nama, nomor_kartu: noKartu }]);

        if (error) throw error;

        document.getElementById('cardNameDisplay').innerText = nama.toUpperCase();
        document.getElementById('cardNumberDisplay').innerText = noKartu;
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('final-step').style.display = 'block';

    } catch (err) {
        alert("Gagal simpan! Cek apakah tabel 'pendaftaran_simulasi' sudah dibuat di SQL Editor Supabase.");
        console.error("Detail Error:", err.message);
        btn.innerText = "Buat Kartu!";
        btn.disabled = false;
    }
};

window.downloadCard = () => {
    const card = document.querySelector("#cardPreview");
    if(!card) return alert("Elemen kartu tidak ditemukan!");
    
    html2canvas(card).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Kartu-BDN.png';
        link.href = canvas.toDataURL();
        link.click();
    });
};