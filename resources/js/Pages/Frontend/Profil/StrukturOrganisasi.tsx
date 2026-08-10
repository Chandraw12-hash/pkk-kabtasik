import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Download,
    Phone,
    BookOpen,
    ChevronRight,
    Users,
    Crown,
    Briefcase,
    DollarSign,
    Heart,
    GraduationCap,
    Utensils,
    Stethoscope,
    ArrowRight,
} from "lucide-react";

const pokjaList = [
    {
        nama: "Pokja I",
        label: "POKJA I",
        program: "Penghayatan & Pengamalan Pancasila",
        desc: "Fokus pada pembinaan mental spiritual, penguatan karakter, gotong royong, dan kehidupan bermasyarakat.",
        icon: Heart,
        accent: "#3B82F6",
    },
    {
        nama: "Pokja II",
        label: "POKJA II",
        program: "Pendidikan, Keterampilan & Koperasi",
        desc: "Peningkatan pendidikan keluarga, keterampilan ekonomi, dan pengembangan kehidupan berkoperasi.",
        icon: GraduationCap,
        accent: "#10B981",
    },
    {
        nama: "Pokja III",
        label: "POKJA III",
        program: "Pangan, Sandang & Tata Laksana RT",
        desc: "Pemenuhan kebutuhan pangan bergizi, sandang layak, perumahan sehat, dan tata laksana rumah tangga.",
        icon: Utensils,
        accent: "#F97316",
    },
    {
        nama: "Pokja IV",
        label: "POKJA IV",
        program: "Kesehatan, Lingkungan & Perencanaan Sehat",
        desc: "Pembinaan kesehatan keluarga, pelestarian lingkungan hidup dan perencanaan keluarga sehat.",
        icon: Stethoscope,
        accent: "#14B8A6",
    },
];

const pimpinan = [
    {
        jabatan: "Wakil Ketua",
        nama: "Dra. Yg. Sri Munawaroh",
        icon: Users,
    },
    {
        jabatan: "Sekretaris",
        nama: "Dra. Tl. Ai Rojanah Fajri",
        icon: Briefcase,
    },
    {
        jabatan: "Bendahara",
        nama: "Hj. Siti Suharni",
        icon: DollarSign,
    },
];

export default function StrukturOrganisasi() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Struktur Organisasi - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== HERO ==================== */}
            <section className="relative h-[420px] lg:h-[480px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Struktur Organisasi"
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
                        Tentang Kami
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                        Struktur Organisasi
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                        Mengenal formasi Tim Penggerak PKK yang berdedikasi
                        untuk memberdayakan dan meningkatkan kesejahteraan
                        keluarga di Kabupaten Tasikmalaya.
                    </p>
                </div>
            </section>

            {/* ==================== PIMPINAN UTAMA ==================== */}
            <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                        {/* Foto */}
                        <div className="w-full lg:w-5/12">
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <img
                                    src="/assets/images/ketua-pkk.jpg"
                                    alt="Hj. Retno Widyastuti, S.E"
                                    className="w-full h-[420px] md:h-[480px] object-cover object-top"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80";
                                    }}
                                />
                            </div>
                            <div className="mt-4">
                                <p className="text-lg font-bold text-slate-900">
                                    Hj. Retno Widyastuti, S.E
                                </p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Ketua TP PKK Kabupaten Tasikmalaya
                                </p>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="w-full lg:w-7/12">
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Pimpinan Utama
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                                Hj. Retno Widyastuti, S.E
                            </h2>

                            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                                <p className="italic text-slate-700">
                                    &ldquo;Pemberdayaan keluarga adalah pondasi
                                    utama dalam membangun Tasikmalaya yang lebih
                                    baik, sehat, dan berdaya saing tinggi.&rdquo;
                                </p>
                                <p>
                                    Selaku Ketua TP PKK Kabupaten Tasikmalaya,
                                    beliau menginisiasi berbagai program
                                    strategis yang berfokus pada peningkatan
                                    ekonomi keluarga, kesehatan ibu dan anak,
                                    serta penguatan karakter dengan mengutamakan
                                    nilai-nilai luhur Pancasila.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-8">
                                <a
                                    href="tel:"
                                    className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                                >
                                    <Phone size={15} />
                                    Hubungi Beliau
                                </a>
                                <Link
                                    href="#hierarki"
                                    className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                                >
                                    <BookOpen size={15} />
                                    Jelajahi Hierarki
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== HIERARKI ==================== */}
            <section
                id="hierarki"
                className="py-20 lg:py-24 bg-slate-50 border-t border-slate-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
                        <div>
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Bagan Kepengurusan
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Hierarki Organisasi
                            </h2>
                        </div>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            <Download size={15} />
                            Unduh PDF
                        </a>
                    </div>

                    {/* Ketua */}
                    <div className="flex justify-center mb-10">
                        <div className="bg-white border border-slate-200 rounded-xl px-8 py-6 text-center min-w-[260px]">
                            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                                <Crown size={20} className="text-teal-600" />
                            </div>
                            <p className="text-xs font-semibold text-teal-600 tracking-wide uppercase mb-1">
                                Ketua TP PKK
                            </p>
                            <p className="font-bold text-slate-900">
                                Hj. Retno Widyastuti, S.E
                            </p>
                        </div>
                    </div>

                    {/* Wakil, Sekretaris, Bendahara */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
                        {pimpinan.map((p, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-6 text-center"
                            >
                                <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center mx-auto mb-3">
                                    <p.icon
                                        size={18}
                                        className="text-teal-600"
                                    />
                                </div>
                                <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase mb-1">
                                    {p.jabatan}
                                </p>
                                <p className="font-semibold text-slate-900 text-sm">
                                    {p.nama}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pokja */}
                    <div className="mb-6">
                        <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase text-center mb-6">
                            Kelompok Kerja (POKJA)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {pokjaList.map((pokja, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col hover:border-slate-300 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-11 h-11 rounded-lg flex items-center justify-center text-white"
                                        style={{
                                            backgroundColor: pokja.accent,
                                        }}
                                    >
                                        <pokja.icon size={18} />
                                    </div>
                                    <span className="text-[10px] font-semibold tracking-wide uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded">
                                        {pokja.label}
                                    </span>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug">
                                    {pokja.program}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-4">
                                    {pokja.desc}
                                </p>
                                <Link
                                    href="#"
                                    className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    Lihat Program
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== CTA ==================== */}
            <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-3">
                        Mari Berkarya Bersama
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        PKK Kabupaten Tasikmalaya
                    </h2>
                    <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto mb-8">
                        Jadilah bagian dari perubahan positif. Bersama kita
                        bangun keluarga sejahtera, cerdas, dan mandiri.
                    </p>
                    <Link
                        href="#"
                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                    >
                        Mulai Kolaborasi
                        <ChevronRight size={15} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}