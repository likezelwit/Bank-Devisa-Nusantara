// Konfigurasi Supabase
const SUPABASE_URL = 'https://ndopnxzbaygohzshqphi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kb3BueHpiYXlnb2h6c2hxcGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzM4ODQsImV4cCI6MjA3OTMwOTg4NH0.nZC5kOVJeMAtfXlwchokXK4FLtPkPoUrxPQUzrz2C8I';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.checkAge = () => {
    const year = document.getElementById('dobYYYY').value;
    if(year < 2015) { // Contoh validasi
        document.getElementById('step-0').style.display = 'none';
        document.getElementById('step-1').style.display = 'block';
    } else {
        alert("Kamu masih terlalu kecil!");
    }
};

window.submitToSupabase = async () => {
    const name = document.getElementById('fullName').value;
    
    // 1. Simpan ke Database
    const { data, error } = await supabase
        .from('users_simulation') // Pastikan lu udah buat tabel ini di Supabase
        .insert([{ full_name: name, created_at: new Date() }]);

    if (error) {
        console.error('Gagal simpan:', error);
        alert('Eror simpan data!');
    } else {
        // 2. Tampilkan Hasil
        document.getElementById('cardName').innerText = name;
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('final-step').style.display = 'block';
    }
};