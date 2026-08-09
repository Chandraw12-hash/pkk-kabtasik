import React from "react";
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
    ArrowRight,
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

export default function ProgramKerja() {
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
                        Program Kerja Nasional
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                        Program Kerja PKK
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                        10 Program Pokok PKK sebagai pilar utama gerakan
                        pemberdayaan keluarga dalam mewujudkan Kabupaten
                        Tasikmalaya yang mandiri, cerdas, dan sejahtera.
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
                            Landasan untuk menciptakan keluarga mandiri dan
                            berkualitas di Kabupaten Tasikmalaya.
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
                                        <span className="text-2xl font-bold text-slate-100">
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
                                <Link
                                    href="#"
                                    className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                >
                                    Pelajari detail
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== CTA ==================== */}
            <section className="py-20 lg:py-24 bg-slate-50 border-t border-slate-100">
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
