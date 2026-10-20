# SIMPADU · Monitoring Meter Air & Foto Pelanggan

Aplikasi web terpisah dari SIMPADU lama untuk memantau data pelanggan dan riwayat foto meteran air 5 bulan terakhir.

## Teknologi
- **Framework**: Next.js 16.4 (App Router) + React 19 + TypeScript
- **Database**: MySQL2 (koneksi ke database SIMPADU 192.168.8.11, sesi dipaksa `READ ONLY`)
- **Image Processing**: Sharp (proxy foto meter dengan auto-orientasi EXIF, kompresi JPEG, dan resize thumbnail)
- **Authentication**: `iron-session` (terenkripsi, membaca tabel `SPD_USER` dengan verifikasi Bcrypt resmi SIMPADU)
- **Styling**: Modern CSS dengan tema Glassmorphism Dark Mode yang responsif untuk desktop dan HP

## Fitur Utama
1. **Sistem Login Resmi**: Petugas login menggunakan username & password SIMPADU yang sudah ada.
2. **Filter Fleksibel**:
   - Pencarian berdasarkan No. PDAM
   - Dropdown Kelurahan (23 Kelurahan di SIMPADU)
   - Dropdown RW dinamis yang menyesuaikan Kelurahan yang dipilih
3. **Kartu Pelanggan**:
   - Informasi lengkap: No. PDAM, Nama, Alamat, Golongan, Status (Aktif / Tutup).
   - Gallery 5 Periode Rekening Terakhir:
     - Foto meteran air asli yang diambil petugas lapangan
     - Stand meter terbaca
     - Pemakaian bulanan ($m^3$)
     - Keterangan status bacaan meter (Normal, Macet, Kunci, Buram, dll.)
     - Tanggal & jam pencatatan meter
4. **Interactive Photo Lightbox**:
   - Klik thumbnail foto untuk membuka tampilan layar penuh
   - Navigasi bulan sebelumnya / selanjutnya langsung di dalam modal
   - Kontrol Zoom (+ / -) dan Rotasi 90°
   - Tautan langsung untuk membuka foto resolusi asli

## Menjalankan Aplikasi

```bash
cd /Users/tituswahyu/Documents/script/simpadu-meter-viewer

# Mode Development
npm run dev

# Mode Production
npm run build
npm run start
```

Aplikasi aktif pada port 3000: `http://localhost:3000` (atau `http://<IP-LAN>:3000`).
