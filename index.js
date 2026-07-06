const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// 1. Inisialisasi Client WA
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true // Tetap jalan di latar belakang
    }
});

// 2. Munculkan QR Code di Terminal untuk di-scan
client.on('qr', (qr) => {
    console.log('Scan Barcode ini untuk menjalankan Bot Mas Isal:');
    qrcode.generate(qr, { small: true });
});

// 3. Notifikasi kalau WA sudah berhasil terhubung
client.on('ready', async () => {
    console.log('WhatsApp Bot Ready dan Terhubung!');

    // Jalankan fungsi blast setelah bot siap
    await jalankanWaBlast();
});

// 4. Fungsi Helper untuk membuat Delay (Jeda Waktu)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 5. Ambil data dari file target.js (Jika tidak ada, otomatis pakai yang example)
let daftarTarget;
try {
    daftarTarget = require('./target');
    console.log('Menggunakan data nomor asli dari file target.js');
} catch (e) {
    daftarTarget = require('./target.example');
    console.log('File target.js tidak ditemukan. Menggunakan data sample dari target.example.js');
}


// 6. Logika WA Blast
async function jalankanWaBlast() {
    console.log(`Memulai pengiriman pesan ke ${daftarTarget.length} target...`);

    for (let i = 0; i < daftarTarget.length; i++) {
        const target = daftarTarget[i];

        // Pesan dibuat dinamis biar ada nama masing-masing orang
        const pesan = `*📢 PEMBERITAHUAN PEMAKAIAN APLIKASI*

Halo *${target.nama}*, 

Ini adalah pesan otomatis dari Mas Isal. Mau minta tolong untuk melakukan pemakaian aplikasi Kalkulator IP Address hari ini yaa. 🙏😊 

Terima kasih banyak atas bantuannya, sukses selalu!`;
// Klik link bawah ini untuk menyetujui menjadi tester:
// 👇👇👇
// https://play.google.com/apps/testing/com.faisal.ipcalc

// Jika aplikasi belum di-update, silakan klik link di bawah ini untuk mendapatkan versi terbaru:
// 👇👇👇
// https://play.google.com/store/apps/details?id=com.faisal.ipcalc

//Console pesan di atas bisa di ganti menyesuaikan dengan kebutuhan

        try {
            // Kirim pesan ke WhatsApp
            await client.sendMessage(target.nomor, pesan);
            console.log(`[BERHASIL] Pesan terkirim ke ${target.nama} (${target.nomor})`);
        } catch (error) {
            console.log(`[GAGAL] Gagal mengirim ke ${target.nama}:`, error);
        }

        // Kunci utamanya di sini: Kasih jeda waktu antar nomor (5 detik)
        // Biar WhatsApp gak curiga kalau ini robot masif
        if (i < daftarTarget.length - 1) {
            console.log('Menunggu 5 detik sebelum mengirim pesan berikutnya...');
            await delay(5000);
        }
    }

    console.log('--- SEMUA PESAN SELESAI DIKIRIM ---');
}

// Jalankan bot-nya
client.initialize();