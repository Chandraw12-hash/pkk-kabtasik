# HANDOFF TOTAL — TPP PKK KAB TASIKMALAYA (Flutter + Laravel)
Tanggal: 16 Okt 2026. Untuk: AI penerus + operator. Status: kerjaan gantung ada, baca §11.

## 1. PETA REPO
- Flutter `tppkk_kabtasik` @ `C:\Users\ChandraW\tppkk_kabtasik`, HEAD `e80a06d`. Run: `flutter run -d chrome` (R hot reload; full restart bila tambah package). Aturan: `flutter analyze` bersih. AAB rilis: `flutter build appbundle --release --dart-define=API_BASE_URL=https://domain/api/` (wajib dart-define, ada penjaga).
- Laravel 12 (PHP 8.2, Sanctum 4, Spatie 6, Inertia React, Postgres) `pkk-kabtasik` @ `C:\PROJECT MAGANG\pkk-kabtasik`, HEAD `78e900f`. Serve: `php artisan serve` + `npm run dev/build` tiap ubah TSX. Aturan: `php -l` + `route:list` tiap ubah route (±455 baris); fix backend DIBUKTIKAN via script in-process lalu hapus `*_tmp.php`; `tsc` deprecated (andalkan `npm run build`).
- `AppConstants.baseUrl`: env `API_BASE_URL` → `127.0.0.1:8000/api` (web/debug) / `10.0.2.2` (emulator). Token `auth_token` SharedPrefs.

## 2. PERAN (JANGAN DICAMPUR)
- HP (Android only): `dasawisma` (input KK/warga granular per desa, wizard 5 langkah) vs `pokja1-4` (laporan agregat, kategori dikunci: P1→I, P2→II, P3→III, P4→5 sheet). BEDA dashboard, endpoint, tabel.
- WEB tolak pokja*/dasawisma (`LoginController.php:81-87`).
- Hierarki: admin desa → kecamatan → kabupaten/super-admin. `User.php:59-65` MOBILE_ROLES.

## 3. ALUR INTI (satu pipa)
HP pending → ACC desa → agregat → ACC kecamatan → publik/grafik/export. Tolak = gugur. P=0/0/kosong sah (validasi cuma `stunting ≤ Balita L+P`, `DasawismaDaftarWargaController.php:226-237`).
- Dua jalur ke tabel Pokja: kader HP via `laporan-kegiatan` (pending → `sinkronkanPokja1/2/3`, lipatan L/P Pokja II digabung) vs admin web CRUD langsung (tanpa approval — admin memang pengesah).

## 4. DATA UMUM — MEKANISME PALING PENTING
- `daftar_wargas` (JAMAK!) per-KK di-ACC desa → `DaftarWargaDataUmumSyncService` increment baris per dusun (`level=desa`, dusun terisi, pending selamanya) + agregat NULL (`dusun NULL`) via `DataUmumDesaController::recalculateAggregate` (COUNT DISTINCT KK approved + SUM dusun).
- Edit/import desa → `resetKecamatanStatus` → agregat balik pending (by design).
- ACC kecamatan HANYA agregat NULL (`DataUmumKecamatanController.php:140-214`); baris dusun read-only. Desain ACC-per-dusun DIBATALKAN permanen (revert total, grep `approveDusun` = 0).
- Split publik KEMAUAN user 12 Okt, jangan diseragamkan: sekretariat (tabel+CSV) approved-only; 8 publik lain pending+approved (`IndexController.php`).
- Kolom `jiwa_tidak_terpilah`: data tetap disimpan & masuk agregat, tapi ATAS INSTRUKSI OPERATOR disembunyikan dari tampilan Data Umum Sekretariat (kolom + total kartu + legenda donut). Jangan dimunculkan lagi tanpa izin.
- Anomali data (JANGAN dihapus tanpa izin): baris ID 17 Margamulya approved semua-NOL; ~20 baris dusun pending total KK 7793; 7 pin GPS default; akun `uji.*`, NIK `1818...`.

## 5. STUNTING, GPS, ALAMAT (13-14 Okt)
- `daftar_wargas.jumlah_balita_stunting` (migrasi `2026_10_13_000001`); wizard Langkah 3 + banner dashboard HP; `PetaSebaranController` filter semua/ada/tidak + stats; pin oranye #F59E0B + kartu ke-4 + legend + popup.
- MapPicker: peta OSM asli + GPS (`geolocator`, `flutter_map`) + reverse-geocode Nominatim → isi otomatis kolom Alamat (hanya bila kosong); penjaga tolak koordinat default `-7.3274,108.2207`; izin lokasi wajib Allow (Chrome: site settings; tiap port debug beda origin → pakai `--web-port 5000`).
- Tombol bawah semua form (wizard/terpadu/bumil/form lama/peta/kader catatan) sudah `SafeArea`/viewPadding agar tidak ketutup nav HP. Dashboard kader/dasawisma aman dari sananya.

## 6. BERITA & GALERI (maks 5 = 1 sampul + 4)
- `berita_fotos` (migrasi `2026_10_13_000002`) + `BeritaFoto` + `Berita::fotos()/galeri`; cover kosong → promosi pertama; Edit: hapus terpilih + slot sisa; Show publik: swipe/panah/dots/counter/thumbnail + hero crossfade. Mobile base64 1 foto tak tersentuh (tetap cover).
- `galeri_fotos` (migrasi `2026_10_15_000001`) + `GaleriFoto` + pola SAMA persis di controller + Create/Edit + badge `+N` + lightbox publik per-kegiatan (panah/keyboard/swipe/counter/thumbnail). HP baca sampul saja (bonus: `foto_url` yang dulu null kini URL asli).
- Upload DSLR (sumber: admin + kader pokja): API base64 terima 30 MB → downscale GD 1920px JPEG q80 + EXIF; web berita/galeri `max:30720`. Syarat php.ini deploy: post/upload 32M, memory 512M.

## 7. POKJA 1-4 — FORM BACKEND = FORMAT PUBLIK
- Pokja2: `formFields.tsx` (44 rules: identitas + Pendidikan 12 + Kader 13 + Pelatihan 3 + Koperasi 10 + keterangan); controller `baseRules()` + `$validated`.
- Pokja1: `formFields.tsx` (35 rules: identitas+kader+tahun + 6 program × kegiatan/volume/metode/sasaran + keterangan + legacy judul/deskripsi/kategori/foto dipertahankan di Edit).
- Pokja3: `formFields.tsx` (identitas + 20 kolom: Kader 3 + Beras/Non 2 + Hatinya 7 + Industri 3 + Rumah 2); temuan: kolom `keterangan` tidak ada di tabel → migrasi `2026_10_14_000002` + fillable.
- Kontrak IV-DATADUKUNG/IV-DATAPROGRAM tanpa strip; Pokja4 DataDukung read-only + dummy dihapus total (backend selalu kirim `laporan_loaded: true`).

## 8. MASTER WILAYAH (super-admin)
- Tabel `wilayah_desa` (migrasi `2026_10_14_000001`, seed 351) ganti `AdminDesaSeeder::DATA_DESA` + 2 konstanta duplikat (`UserController`, `BeritaController` — dihapus) di 11 titik via `WilayahDesa::dataDesa()` (cache 1 jam + fallback konstanta). Halaman `Backend/Wilayah/Index` + menu sidebar + 5 route `be.wilayah.*`.
- ATURAN KERAS: boleh tambah + nonaktifkan; DILARANG rename/hapus (nama tersimpan string di data lama). Desa baru belum punya akun → buatkan via Users.

## 9. USERS IMPORT + TEMPLATE
- `UsersImport` + `UsersTemplateExport` (2 sheet: `pengguna` header saja + `petunjuk`); validasi cermin form (password ikut `Password::defaults()`); baris gagal dilewati + panel kuning; tombol Template (target _blank!)/Import/Tambah di Index.

## 10. PLAY STORE (Flutter, deadline 20 Okt)
- App ID `id.go.tasikmalayakab.tppkk` (dulu com.example — permanen pasca-upload). Keystore `android/tppkk-release.jks` + `key.properties` (GITIGNORED — backup 2 tempat, hilang = tak bisa update selamanya!). Guard rilis: AAB tanpa dart-define crash jelas. Ikon sudah logo kabupaten. Nama publik: **SIPENDAWA PKK** (Sistem Informasi Pendataan Dasawisma dan Warga); label manifest menunggu diganti (perintah tertunda 15 Okt).
- AAB 62,7 MB pernah kebangun + tanda tangan terverifikasi — TAPI tanpa URL produksi (jangan upload itu).
- Jalur kritis: hosting backend HTTPS dulu → rebuild AAB + URL → Console ($25, listing, privacy policy WAJIB karena GPS, data safety lokasi, testing).

## 11. KERJAAN GANTUNG (status 16 Okt)
- Laravel: hero Beranda per-slide position (slide 1 bawah, lain tengah) + foto hero baru (`hero11-13.jpg`, file `Potret...png`, folder `assets/galeri/`) BELUM commit; Beranda `M` termodifikasi.
- Flutter: `AndroidManifest.xml` (label) + `pubspec.lock` termodifikasi.
- Aturan main: santai-teknis, UI dulu, jangan commit/migrate-prod tanpa suruh, verifikasi peran visual, `file:line` tiap rujukan, bukti in-process + hapus tmp, analisis bersih.

## 12. DILARANG (tanpa diskusi)
Bangkitkan ACC-per-dusun; tampilkan `jiwa_tidak_terpilah`; hapus ID 17; samakan split sekretariat/publik; ubah `screens/dasawisma/*` logika; seed ulang prod (reset password!); commit rahasia (keystore/.env); restore DB live saat demo; klik maintenance `down` saat demo; tombol mati: tidak ada lagi yang diketahui (Unduh Rekap sudah hidup → CSV sekretariat).
