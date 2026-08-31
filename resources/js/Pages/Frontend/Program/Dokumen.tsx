import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Search,
    Clock,
    FileText,
    FileDown,
    Book,
    FileCheck,
    FolderOpen,
    HelpCircle,
    PhoneCall,
} from "lucide-react";

const filterKategori = ["Semua Kategori", "Kegiatan", "Panduan Resmi", "Laporan"];

const panduanData = [
    {
        id: 1,
        kategori: "PANDUAN",
        title: "Panduan Operasional Rakernas IX PKK",
        desc: "Buku saku panduan teknis pelaksanaan program kerja sesuai hasil Rapat Kerja Nasional IX.",
        date: "12 Sep 2024",
        icon: FileText,
    },
    {
        id: 2,
        kategori: "MODUL",
        title: "Modul Pelatihan Dasar Kader PKK",
        desc: "Materi dasar pemberdayaan masyarakat untuk kader baru di tingkat Desa/Kelurahan.",
        date: "05 Okt 2024",
        icon: Book,
    },
    {
        id: 3,
        kategori: "REGULASI",
        title: "Permendagri No. 36 Tahun 2020",
        desc: "Peraturan Menteri tentang Peraturan Pelaksanaan Peraturan Presiden Nomor 99 Tahun 2017.",
        date: "15 Jan 2024",
        icon: Book,
    },
];

const laporanData = [
    {
        id: 1,
        kategori: "DOKUMEN",
        size: "PDF | 4.5 MB",
        title: "Laporan Akhir Tahun 2023",
        desc: "Kompilasi pencapaian 10 Program Pokok PKK di Kabupaten Tasikmalaya sepanjang tahun 2023.",
        icon: FileText,
    },
    {
        id: 2,
        kategori: "EVALUASI",
        size: "DOCX | 2.1 MB",
        title: "Evaluasi Program Pokja III",
        desc: "Hasil audit internal dan evaluasi program ketahanan pangan keluarga triwulan III.",
        icon: FileCheck,
    },
];

export default function Dokumen() {
    const [activeFilter, setActiveFilter] = useState("Semua Kategori");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Dokumen Publik - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== SEARCH & FILTER ==================== */}
            <section className="py-8 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative w-full md:flex-1">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                placeholder="Cari nama dokumen atau kata kunci..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 bg-white text-slate-800 placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {filterKategori.map((kat) => (
                                <button
                                    key={kat}
                                    onClick={() => setActiveFilter(kat)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                                        activeFilter === kat
                                            ? "bg-teal-600 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                >
                                    {kat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== PANDUAN RESMI ==================== */}
            <section className="py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-1">
                                Dokumen
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Panduan Resmi
                            </h2>
                        </div>
                        <Link
                            href="#"
                            className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {panduanData.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                                        <item.icon
                                            size={18}
                                            className="text-teal-600"
                                        />
                                    </div>
                                    <span className="text-[10px] font-semibold tracking-wide uppercase text-teal-600 bg-teal-50 px-2.5 py-1 rounded">
                                        {item.kategori}
                                    </span>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-grow">
                                    {item.desc}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                        <Clock size={12} />
                                        {item.date}
                                    </span>
                                    <button className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                                        <FileDown size={14} />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== LAPORAN & EVALUASI ==================== */}
            <section className="py-16 lg:py-20 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-1">
                            Dokumen
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Laporan &amp; Evaluasi
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {laporanData.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors flex items-start gap-5"
                            >
                                <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                                    <item.icon
                                        size={18}
                                        className="text-teal-600"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-semibold tracking-wide uppercase text-teal-600">
                                            {item.kategori}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs text-slate-400">
                                            {item.size}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-900 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                        {item.desc}
                                    </p>
                                    <button className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                                        <FileDown size={14} />
                                        Unduh Laporan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== INFO TAMBAHAN ==================== */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <FolderOpen size={20} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Dokumentasi Lainnya
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        Beberapa kategori seperti &ldquo;Kegiatan Desa&rdquo;
                        atau &ldquo;Arsip Lama&rdquo; sedang dalam proses
                        digitalisasi.
                    </p>
                    <button className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors">
                        <Search size={14} />
                        Request Dokumen Spesifik
                    </button>
                </div>
            </section>

            {/* ==================== CTA HELP ==================== */}
            <section className="py-16 lg:py-20 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-3">
                        Bantuan
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Butuh Bantuan Navigasi?
                    </h2>
                    <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto mb-8">
                        Tim admin kami siap membantu Anda menemukan dokumen atau
                        panduan yang dibutuhkan untuk operasional PKK.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                        >
                            <PhoneCall size={15} />
                            Hubungi Admin
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                        >
                            <HelpCircle size={15} />
                            FAQ Dokumen
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
