# Base Template Laravel Inertia React

Template dasar aplikasi web modern menggunakan **Laravel 12** sebagai backend dan **React + Inertia.js 2.0** sebagai frontend. Template ini dirancang untuk performa tinggi, kemudahan pengembangan, dan sudah dilengkapi dengan konfigurasi siap pakai untuk proyek Enterprise atau Pemerintahan (SPBE).

## 🚀 Teknologi Utama

Project ini dibangun menggunakan *stack* teknologi terkini:

### Backend (Laravel)
- **Framework**: [Laravel 12.x](https://laravel.com)
- **Bahasa**: PHP ^8.2
- **Database**: MySQL / MariaDB

### Frontend (Modern Stack)
- **Library**: [React 19](https://react.dev)
- **Bridge**: [Inertia.js 2.0](https://inertiajs.com) - Menghubungkan Laravel & React tanpa API ribet.
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com) - Framework CSS *utility-first*.
- **Language**: [TypeScript](https://www.typescriptlang.org) - Supaya kode lebih aman dan *type-safe*.
- **Build Tool**: [Vite](https://vitejs.dev) - Bundler super cepat.

### 📦 Package & Library yang Digunakan

Berikut adalah daftar library tambahan yang sudah terinstall:

#### Backend Dependencies
- **Auth & Security**:
  - `laravel/sanctum`: Sistem autentikasi token/SPA.
  - `spatie/laravel-permission`: Manajemen Role & Permission (sudah terintegrasi).
- **Utilities**:
  - `maatwebsite/excel`: Export/Import Excel dengan mudah.
  - `tightenco/ziggy`: Menggunakan route Laravel (`route()`) langsung di React.
  - `dedoc/scramble`: Dokumentasi API otomatis (OpenAPI/Swagger).

#### Frontend Dependencies
- **UI Components & Icons**:
  - `lucide-react`: Koleksi ikon SVG modern & ringan.
  - `sonner`: Notifikasi toast yang cantik dan *customizable*.
  - `sweetalert2`: Alert & Popup dialog interaktif.
- **Data Visualization**:
  - `recharts`: Library chart/grafik powerful untuk React.
- **Lainnya**:
  - `@dearhive/dearflip-jquery-flipbook`: Penampil PDF gaya buku flipbook 3D.
  - `jquery`: Dependensi pendukung untuk beberapa plugin legacy.

---

## 🛠️ Langkah Instalasi

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda:

### 1. Persiapan Awal
Pastikan Anda sudah menginstall:
- PHP >= 8.2
- Composer
- Node.js & NPM
- MySQL Database

### 2. Clone Project
```bash
git clone https://gitlab.tasikmalayakab.go.id/fazryan/base-template-react-inertia.git
cd repo-name
```

### 3. Install Dependensi Backend
```bash
composer install
```

### 4. Install Dependensi Frontend
```bash
npm install
```

### 5. Konfigurasi Environment
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Buka file `.env` dan sesuaikan konfigurasi database Anda:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_anda
DB_USERNAME=root
DB_PASSWORD=
```

### 6. Generate Application Key
```bash
php artisan key:generate
```

### 7. Migrasi & Seeding Database
Jalankan perintah ini untuk membuat tabel dan mengisi data awal (user admin, role, dll):
```bash
php artisan migrate:fresh --seed
```

### 8. Jalankan Aplikasi
Buka dua terminal terpisah:

**Terminal 1 (Backend Server):**
```bash
php artisan serve
```

**Terminal 2 (Frontend Build/Watch):**
```bash
npm run dev
```

Akses aplikasi di browser melalui: [http://localhost:8000](http://localhost:8000)

---

## 🔑 Akun Default (Seeder)
Jika Anda menjalanakn `db:seed`, berikut adalah akun default yang bisa digunakan:

- **Admin**
  - Username: `admin`
  - Password: `password`
- **User**
  - Username: `user`
  - Password: `password`

---

## 📝 Catatan Pengembangan
- **Struktur Folder**: Controller frontend ada di `app/Http/Controllers/Frontend`, backend di `app/Http/Controllers/Backend`.
- **Halaman**: File React (.tsx) ada di `resources/js/Pages`.
- **Styling**: Gunakan class utility Tailwind CSS langsung di komponen React.
