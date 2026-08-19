import React, { useEffect, useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Download,
    CheckCircle,
    Sparkles,
    Target,
    BarChart2,
    ShieldCheck,
    Layers,
} from "lucide-react";

function useScrollAnimation<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
        );
        if (node) observer.observe(node);
        return () => {
            if (node) observer.unobserve(node);
        };
    }, []);

    return { ref, isVisible };
}

const tugasPokok = [
    "Merencanakan program kerja sesuai dengan hasil Rapat Kerja Daerah (Rakerda) dan kebutuhan masyarakat.",
    "Menggerakkan dan membina potensi masyarakat, khususnya para kader di tingkat kecamatan dan desa/kelurahan.",
    "Memantau, mengevaluasi, dan melaporkan pelaksanaan rangkaian program PKK secara berjenjang kepada Bupati selaku Ketua Pembina dan TP PKK tingkat provinsi.",
    "Memberikan bimbingan teknis, penyuluhan, serta pendampingan langsung kepada TP PKK Kecamatan.",
];

const fungsiStrategis = [
    {
        title: "Pemberdayaan Keluarga",
        desc: "Sebagai wadah pemberdayaan masyarakat yang berfokus pada kesejahteraan keluarga.",
        icon: Sparkles,
    },
    {
        title: "Perencana & Pengendali",
        desc: "Sebagai perencana dan pengendali pelaksana 10 Program PKK di wilayah kabupaten.",
        icon: Target,
    },
    {
        title: "Fasilitator Aspirasi",
        desc: "Sebagai fasilitator penampung serta penyalur aspirasi masyarakat bawah terkait isu keluarga.",
        icon: BarChart2,
    },
    {
        title: "Mitra Kerja Pemerintah",
        desc: "Menghimpun dan menggerakkan potensi masyarakat untuk meningkatkan kesejahteraan keluarga sebagai mitra kerja pemerintah daerah.",
        icon: ShieldCheck,
    },
];

const programPokok = [
    "Penghayatan dan Pengamalan Pancasila",
    "Gotong Royong",
    "Pangan",
    "Sandang",
    "Perumahan dan Tata Laksana Rumah Tangga",
    "Pendidikan dan Keterampilan",
    "Kesehatan",
    "Pengembangan Kehidupan Berkoperasi",
    "Kelestarian Lingkungan Hidup",
    "Perencanaan Sehat",
];

const rincianOperasional = [
    "Merancang rencana kerja sebagai penjabaran dari Rencana PKK dan skala prioritas daerah.",
    "Mengkoordinasikan dan mengupayakan ketercapaian kerja dengan pemerintah daerah setempat.",
    "Membantu bimbingan dan pembinaan kepada Tim Penggerak PKK di tingkat kecamatan.",
    "Melaksanakan monitoring dan evaluasi secara periodik terhadap setiap kegiatan.",
    "Melaksanakan tertib administrasi organisasi sesuai ketentuan hasil Rakernas PKK.",
    "Meningkatkan mutu pengelolaan gerakan PKK dan kualitas Sumber Daya Manusia (SDM) kader.",
    "Menyusun dan menyajikan laporan tahunan serta laporan khusus sebagai bahan evaluasi kebijakan.",
    "Melaksanakan konsultasi rutin dengan Ketua Pembina PKK terkait strategi pembangunan.",
    "Menciptakan kerja sama kolaboratif dengan mitra kerja, baik pemerintah maupun swasta.",
];

export default function TugasFungsi() {
    const heroAnim = useScrollAnimation<HTMLElement>();
    const mainAnim = useScrollAnimation<HTMLElement>();
    const programAnim = useScrollAnimation<HTMLElement>();
    const rincianAnim = useScrollAnimation<HTMLElement>();

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <style>{`
                .anim-fade-up {
                    opacity: 0;
                    transform: translateY(24px);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }
                .anim-fade-up.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                @media (prefers-reduced-motion: reduce) {
                    .anim-fade-up {
                        opacity: 1 !important;
                        transform: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            <Head title="Tugas Pokok & Fungsi PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== HERO ==================== */}
            <section
                ref={heroAnim.ref}
                className={`relative h-[420px] lg:h-[480px] flex items-center justify-center overflow-hidden anim-fade-up ${
                    heroAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Tugas Pokok dan Fungsi PKK"
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
                        Mandat &amp; Prioritas
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                        Tugas Pokok &amp; Fungsi PKK
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
                        Memahami peran strategis Tim Penggerak PKK sebagai
                        katalisator pemberdayaan keluarga dan mitra utama
                        pembangunan masyarakat di Kabupaten Tasikmalaya.
                    </p>
                    <a
                        href="#"
                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                    >
                        <Download size={15} />
                        Unduh Dokumen
                    </a>
                </div>
            </section>

            {/* ==================== TUGAS POKOK + FUNGSI ==================== */}
            <section
                ref={mainAnim.ref}
                className={`py-20 lg:py-24 bg-white border-t border-slate-100 anim-fade-up ${
                    mainAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                        {/* Tugas Pokok */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <CheckCircle
                                        className="text-teal-600"
                                        size={18}
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Tugas Pokok TP PKK Kabupaten Tasikmalaya
                                </h2>
                            </div>
                            <ul className="space-y-4">
                                {tugasPokok.map((tugas, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                                        <p className="text-slate-600 text-[15px] leading-relaxed">
                                            {tugas}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Fungsi Strategis */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                                    <Sparkles
                                        className="text-teal-600"
                                        size={18}
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Fungsi TP PKK Kabupaten Tasikmalaya
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {fungsiStrategis.map((f, i) => (
                                    <div
                                        key={i}
                                        className="border border-slate-200 rounded-xl p-5"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                                            <f.icon
                                                size={16}
                                                className="text-teal-600"
                                            />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                                            {f.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 10 PROGRAM POKOK PKK ==================== */}
            <section
                ref={programAnim.ref}
                className={`py-20 lg:py-24 bg-slate-50 border-t border-slate-100 anim-fade-up ${
                    programAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                            Pilar Utama Gerakan
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            10 Program Pokok PKK
                        </h2>
                        <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
                            Sepuluh program utama yang menjadi landasan operasional
                            gerakan PKK dalam mewujudkan keluarga yang berdaya dan
                            sejahtera di Kabupaten Tasikmalaya.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {programPokok.map((prog, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 transition-colors flex flex-col justify-between"
                            >
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs mb-3">
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <h3 className="text-slate-800 text-sm font-semibold leading-snug">
                                    {prog}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== RINCIAN OPERASIONAL ==================== */}
            <section
                ref={rincianAnim.ref}
                className={`py-20 lg:py-24 bg-white border-t border-slate-100 anim-fade-up ${
                    rincianAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                            Detail Pelaksanaan
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                            Rincian Operasional
                        </h2>
                        <p className="text-slate-500 text-base max-w-2xl leading-relaxed">
                            Sembilan poin rincian tugas dan fungsi operasional
                            Tim Penggerak PKK sesuai tata kelola kelembagaan yang
                            terstruktur.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {rincianOperasional.map((item, i) => (
                            <div
                                key={i}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-teal-600 font-semibold text-sm min-w-[28px]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {item}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
