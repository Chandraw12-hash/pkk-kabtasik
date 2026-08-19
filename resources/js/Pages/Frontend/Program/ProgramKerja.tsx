import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Sparkles,
    Handshake,
    Utensils,
    Shirt,
    Home,
    GraduationCap,
    Stethoscope,
    Coins,
    Leaf,
    CalendarCheck,
    ChevronRight,
    BookOpen,
    FileSpreadsheet,
    Calendar,
    MapPin,
} from "lucide-react";

const programPokok = [
    {
        no: "01",
        nama: "Penghayatan dan Pengamalan Pancasila",
        desc: "Pembinaan mental spiritual dan pengamalan nilai-nilai Pancasila sebagai fondasi karakter keluarga yang kuat.",
        icon: Sparkles,
        pokja: "POKJA I",
    },
    {
        no: "02",
        nama: "Gotong Royong",
        desc: "Meningkatkan semangat kebersamaan dan gotong royong dalam kehidupan bermasyarakat.",
        icon: Handshake,
        pokja: "POKJA I",
    },
    {
        no: "03",
        nama: "Pangan",
        desc: "Pemenuhan pangan bergizi seimbang melalui pemanfaatan lahan dan potensi lokal yang ada di masyarakat.",
        icon: Utensils,
        pokja: "POKJA III",
    },
    {
        no: "04",
        nama: "Sandang",
        desc: "Pemenuhan kebutuhan sandang yang layak serta bersih, rapi, dan mencerminkan jati diri budaya.",
        icon: Shirt,
        pokja: "POKJA III",
    },
    {
        no: "05",
        nama: "Perumahan & Tata Laksana RT",
        desc: "Mewujudkan rumah sehat dan lingkungan asri dengan manajemen rumah tangga yang baik dan efektif.",
        icon: Home,
        pokja: "POKJA III",
    },
    {
        no: "06",
        nama: "Pendidikan & Keterampilan",
        desc: "Peningkatan kemampuan dan keterampilan anggota keluarga guna meningkatkan produktivitas dan kesejahteraan.",
        icon: GraduationCap,
        pokja: "POKJA II",
    },
    {
        no: "07",
        nama: "Kesehatan",
        desc: "Pembinaan dan peningkatan kesehatan keluarga menuju pola hidup bersih dan sehat yang berkelanjutan.",
        icon: Stethoscope,
        pokja: "POKJA IV",
    },
    {
        no: "08",
        nama: "Kehidupan Berkoperasi",
        desc: "Mendorong kemandirian ekonomi keluarga melalui pengembangan usaha dan partisipasi aktif di koperasi.",
        icon: Coins,
        pokja: "POKJA II",
    },
    {
        no: "09",
        nama: "Kelestarian Lingkungan",
        desc: "Menjaga kelestarian dan kebersihan lingkungan serta pengelolaan sampah secara bijak setiap harinya.",
        icon: Leaf,
        pokja: "POKJA IV",
    },
    {
        no: "10",
        nama: "Perencanaan Sehat",
        desc: "Mewujudkan perencanaan keluarga yang baik dan terencana dengan layanan dan tujuan yang tepat sasaran.",
        icon: CalendarCheck,
        pokja: "POKJA IV",
    },
];

// Data Rencana Kerja 2026 (Ringkasan Terstruktur dari Excel)
const rencanaKerjaData = [
    {
        id: 1,
        kategori: "SEKRETARIAT",
        kegiatan: "Melaksanakan Rapat Pengurus",
        tujuan: "Koordinasi, evaluasi program kerja sebelumnya, perencanaan program baru, dan sinkronisasi kegiatan.",
        sasaran: "Pengurus TP PKK Kabupaten Tasikmalaya",
        waktu: "Tahun 2026",
        anggaran: "APBD",
    },
    {
        id: 2,
        kategori: "SEKRETARIAT",
        kegiatan: "Rapat Koordinasi Pengurus TP PKK Kecamatan",
        tujuan: "Menyamakan pemahaman dan merumuskan langkah strategis 10 Program Pokok PKK.",
        sasaran: "Pengurus TP PKK Kecamatan se-Kab. Tasikmalaya",
        waktu: "Tahun 2026",
        anggaran: "APBD",
    },
    {
        id: 3,
        kategori: "SEKRETARIAT",
        kegiatan: "Melaksanakan Bina Wilayah",
        tujuan: "Meningkatkan kualitas keluarga dan implementasi 10 Program Pokok PKK di tingkat desa.",
        sasaran: "Pengurus TP PKK Kecamatan & Desa",
        waktu: "Juli - Oktober 2026",
        anggaran: "APBD",
    },
    {
        id: 4,
        kategori: "SEKRETARIAT",
        kegiatan: "HKG PKK Ke-54 Tingkat Kabupaten & Provinsi",
        tujuan: "Menjadi wadah evaluasi program dan apresiasi bagi kader PKK yang aktif berkontribusi.",
        sasaran: "Pengurus TP PKK Kabupaten, Kecamatan, dan Desa",
        waktu: "Tahun 2026",
        anggaran: "APBD",
    },
    {
        id: 5,
        kategori: "POKJA I",
        kegiatan: "Workshop Edukasi Pola Asuh Remaja & Anak (KISAH)",
        tujuan: "Pencegahan stunting melalui pembekalan pola asuh yang tepat guna kepada remaja dan anak.",
        sasaran: "Keluarga & Kader PKK se-Kabupaten",
        waktu: "Mei 2026",
        anggaran: "APBD",
    },
    {
        id: 6,
        kategori: "POKJA I",
        kegiatan: "Sosialisasi Anti Judi Online, Narkoba, & TPPO (CEKAS/AMANAH)",
        tujuan: "Membangun mindset keluarga agar terhindar dari judi online, pinjol, narkoba, dan KDRT.",
        sasaran: "Keluarga & Kader PKK Kecamatan",
        waktu: "Agustus 2026",
        anggaran: "APBD",
    },
    {
        id: 7,
        kategori: "POKJA I",
        kegiatan: "Itsbat Nikah Masal Gratis",
        tujuan: "Memberikan kepastian hukum atas status perkawinan dan akta nikah bagi masyarakat tidak mampu.",
        sasaran: "Pasangan Suami Istri di 4 Titik Wilayah",
        waktu: "Juni 2026",
        anggaran: "APBD",
    },
    {
        id: 8,
        kategori: "POKJA II",
        kegiatan: "Bimbingan Teknis Gelari Pelangi",
        tujuan: "Penguatan konsep dan pendampingan pelaporan Matrix Gelari Pelangi serta penentuan Pilot Project.",
        sasaran: "Ketua TP PKK Kecamatan & Pokja II",
        waktu: "April 2026",
        anggaran: "Swadaya / Mitra",
    },
    {
        id: 9,
        kategori: "POKJA II",
        kegiatan: "Webinar Literasi Digital & Koperasi Naik Kelas",
        tujuan: "Memberikan penguatan konsep literasi digital, izin produk UMKM, dan koperasi.",
        sasaran: "Ketua Pokja II Kecamatan & Desa",
        waktu: "Juli - Agustus 2026",
        anggaran: "Swadaya / Mitra",
    },
    {
        id: 10,
        kategori: "POKJA III",
        kegiatan: "Sosialisasi Program Unggulan (Ketapang Mas, Gemas Sanloka)",
        tujuan: "Meningkatkan pemahaman kader dalam melaksanakan program pangan, sandang, dan perumahan.",
        sasaran: "TP PKK 39 Kecamatan se-Kabupaten",
        waktu: "Maret 2026",
        anggaran: "Dinas Terkait",
    },
    {
        id: 11,
        kategori: "POKJA III",
        kegiatan: "Lomba Cipta Menu B2SA & Masak Serba Ikan",
        tujuan: "Meningkatkan kesadaran masyarakat tentang konsumsi pangan Beragam, Bergizi, Seimbang, dan Aman.",
        sasaran: "TP PKK 39 Kecamatan se-Kabupaten",
        waktu: "Juli - November 2026",
        anggaran: "DKPP & DPMD",
    },
    {
        id: 12,
        kategori: "POKJA IV",
        kegiatan: "Sosialisasi Cek Kesehatan Gratis (CKG) & ASI Eksklusif",
        tujuan: "Deteksi dini penyakit, peningkatan gizi seimbang, dan pencegahan stunting pada keluarga.",
        sasaran: "Ketua TP PKK & Pokja IV Kecamatan",
        waktu: "April 2026",
        anggaran: "APBD",
    },
    {
        id: 13,
        kategori: "POKJA IV",
        kegiatan: "Sosialisasi & Pembinaan Tanggap Bencana (GKSTTB)",
        tujuan: "Mempersiapkan keluarga dan desa binaan dalam menghadapi situasi darurat / mitigasi bencana.",
        sasaran: "Kelompok Masyarakat / Desa Rawan Bencana",
        waktu: "Juni 2026",
        anggaran: "APBD",
    },
];

export default function ProgramKerja() {
    const [activeTab, setActiveTab] = useState("SEMUA");

    const filteredData =
        activeTab === "SEMUA"
            ? rencanaKerjaData
            : rencanaKerjaData.filter((item) => item.kategori === activeTab);

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Program Kerja PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== HERO ==================== */}
            <section className="relative h-[420px] lg:h-[480px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Program Kerja PKK"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/55" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <span className="inline-block text-teal-300 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                        Program Kerja & Agenda Tahunan
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                        Program Kerja PKK
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                        Inisiatif strategis, rencana kegiatan, serta 10 Program Pokok
                        PKK Kabupaten Tasikmalaya Tahun 2026.
                    </p>
                </div>
            </section>

            {/* ==================== 10 PROGRAM POKOK ==================== */}
            <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                            Inisiatif Strategis
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            10 Program Pokok PKK
                        </h2>
                        <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
                            Landasan untuk menciptakan keluarga mandiri dan berkualitas di
                            Kabupaten Tasikmalaya.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {programPokok.map((program, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                                        <program.icon
                                            size={18}
                                            className="text-teal-600"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold tracking-wide uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded">
                                            {program.pokja}
                                        </span>
                                        <span className="text-2xl font-bold text-slate-200">
                                            {program.no}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">
                                    {program.nama}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-grow">
                                    {program.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== RENCANA KERJA TAHUN 2026 (TABEL & DOWNLOAD) ==================== */}
            <section className="py-20 lg:py-24 bg-slate-50 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                        <div>
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Dokumen Resmi
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                                Rencana Kerja TP PKK Tahun 2026
                            </h2>
                            <p className="text-slate-500 text-base max-w-xl leading-relaxed">
                                Ringkasan kegiatan Sekretariat dan Pokja I - IV Kabupaten
                                Tasikmalaya. Unduh file Excel lengkap untuk detail instansi.
                            </p>
                        </div>

                        {/* TOMBOL DOWNLOAD GOOGLE DRIVE */}
                        <div>
                            <a
                                href="https://docs.google.com/uc?export=download&id=1gLUaaGr-XlrQQvc346A50YaIJEUy87mR"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-sm transition-colors"
                            >
                                <FileSpreadsheet size={18} />
                                Unduh File Excel (.XLSX)
                            </a>
                        </div>
                    </div>

                    {/* FILTER TABS */}
                    <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
                        {["SEMUA", "SEKRETARIAT", "POKJA I", "POKJA II", "POKJA III", "POKJA IV"].map(
                            (tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                                        activeTab === tab
                                            ? "bg-teal-600 text-white shadow-sm"
                                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {tab}
                                </button>
                            )
                        )}
                    </div>

                    {/* TABEL RESPONSIF */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                                        <th className="py-4 px-6 font-semibold">Program / Bidang</th>
                                        <th className="py-4 px-6 font-semibold">Kegiatan</th>
                                        <th className="py-4 px-6 font-semibold">Tujuan Utama</th>
                                        <th className="py-4 px-6 font-semibold">Sasaran</th>
                                        <th className="py-4 px-6 font-semibold">Waktu</th>
                                        <th className="py-4 px-6 font-semibold">Anggaran</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                                    {filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="py-4 px-6 font-medium text-slate-900 whitespace-nowrap">
                                                <span className="inline-block bg-teal-50 text-teal-700 text-[10px] font-bold px-2.5 py-1 rounded">
                                                    {item.kategori}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-slate-800">
                                                {item.kegiatan}
                                            </td>
                                            <td className="py-4 px-6 text-slate-500 max-w-xs leading-relaxed">
                                                {item.tujuan}
                                            </td>
                                            <td className="py-4 px-6 text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-slate-400 shrink-0" />
                                                    <span>{item.sasaran}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-slate-400 shrink-0" />
                                                    <span>{item.waktu}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded">
                                                    {item.anggaran}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== CTA ==================== */}
            <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-3">
                        Bersama PKK Tasikmalaya
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Wujudkan Tasikmalaya Mandiri
                    </h2>
                    <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto mb-8">
                        Dukung terlaksananya 10 Program Pokok PKK di lingkungan
                        Anda. Bersama-sama, kita wujudkan masyarakat yang lebih
                        sehat, cerdas, dan sejahtera.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                        >
                            Mulai Berkontribusi
                            <ChevronRight size={15} />
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                        >
                            <BookOpen size={15} />
                            Pelajari Organisasi
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
