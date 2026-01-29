// --- FIREBASE IMPORT (Persis seperti di script.js) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// --- KONFIGURASI FIREBASE (Harus sama persis) ---
const firebaseConfig = {
    apiKey: "AIzaSyDXYDqFmhO8nacuX-hVnNsXMmpeqwYlW7U",
    authDomain: "wifist-d3588.firebaseapp.com",
    databaseURL: "https://wifist-d3588-default-rtdb.asia-southeast1.firebasedatabase.app/", 
    projectId: "wifist-d3588"
};

// Inisialisasi
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --- FUNGSI HAPUS PROGRES LAMA ---
const FIVE_MINUTES_MS = 5 * 60 * 1000; // 5 menit dalam milidetik

async function autoCleanProgress() {
    try {
        // 1. Ambil semua data progress dari Firebase
        const progressRef = ref(db, 'progress');
        const snapshot = await get(progressRef);

        if (!snapshot.exists()) {
            console.log("✅ Database Progress bersih (kosong).");
            return;
        }

        const data = snapshot.val();
        const now = Date.now();
        let deletedCount = 0;

        // 2. Loop setiap data progress
        for (const [token, progressData] of Object.entries(data)) {
            // Cek waktu terakhir update
            const lastUpdate = progressData.updated_at || 0;
            const timeDiff = now - lastUpdate;

            // Jika selisih waktu lebih dari 5 menit
            if (timeDiff > FIVE_MINUTES_MS) {
                console.log(`🗑️ Menghapus progres lama: ${token} (${(timeDiff/1000/60).toFixed(1)} menit lalu)`);
                
                // Hapus data dari Firebase
                await remove(ref(db, 'progress/' + token));
                deletedCount++;
            }
        }

        if (deletedCount > 0) {
            console.log(`✨ Selesai membersihkan ${deletedCount} data progres kadaluarsa.`);
        } else {
            console.log("✅ Semua data progres masih aktif (baru diperbarui).");
        }

    } catch (error) {
        console.error("❌ Gagal membersihkan progress:", error);
    }
}

// Jalankan fungsi pembersihan saat file dimuat
autoCleanProgress();
