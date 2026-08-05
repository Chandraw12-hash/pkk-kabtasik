import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Shirt,
    Award,
    HardHat,
    Scissors,
    Star,
    Shield,
    Tag,
    Palette,
    CheckCircle,
    ChevronRight,
    Info,
} from "lucide-react";

function useScrollAnimation() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
        );
        if (ref.current) observer.observe(ref.current);
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, []);
    return { ref, isVisible };
}

const tabs = ["Seragam Resmi", "Seragam Kota", "Seragam Lapangan"];

const seragamData = {
    "Seragam Resmi": {
        judul: "Pedoman Seragam Resmi",
        desc: "Seragam Resmi digunakan pada acara-acara kenegaraan, upacara hari besar nasional, pelantikan pengurus, dan acara formal lainnya yang melibatkan jajaran pimpinan daerah.",
        komponen: [
            {
                icon: Shirt,
                title: "Batik PKK",
                desc: "Menggunakan motif batik PKK nasional berwarna hijau tobia dengan logo PKK yang tercetak jelas.",
                color: "text-teal-500",
                bg: "bg-teal-50",
            },
            {
                icon: Award,
                title: "Atribut Pendukung",
                desc: "Lencana/pin PKK di setiap kit, papan nama di dada kanan, dan sepatu pantofel hitam.",
                color: "text-blue-500",
                bg: "bg-blue-50",
            },
            {
                icon: HardHat,
                title: "Kerudung/Headwear",
                desc: "Warna kerudung disesuaikan dengan warna toka PKK, polos tanpa hiasan yang berlebihan.",
                color: "text-emerald-500",
                bg: "bg-emerald-50",
            },
            {
                icon: Scissors,
                title: "Rok/Celana",
                desc: "Rok atau celana panjang berwarna hijau tobia senada dengan bawahan batik.",
                color: "text-violet-500",
                bg: "bg-violet-50",
            },
        ],
        ketentuan: [
            "Digunakan pada upacara resmi kenegaraan dan hari besar nasional",
            "Wajib menggunakan lencana PKK yang sesuai tingkatan",
            "Batik yang digunakan harus bermotif PKK resmi yang telah ditentukan",
            "Sepatu berwarna hitam dengan tinggi tumit maksimal 5 cm",
        ],
    },
    "Seragam Kota": {
        judul: "Pedoman Seragam Kota",
        desc: "Seragam Kota digunakan pada kegiatan rapat rutin, koordinasi, kunjungan kerja, serta kegiatan-kegiatan operasional PKK tingkat kabupaten dan kecamatan.",
        komponen: [
            {
                icon: Palette,
                title: "Kemeja PKK",
                desc: "Kemeja berwarna hijau daun PKK dengan kerah biasa, berlengan panjang untuk kegiatan formal.",
                color: "text-green-500",
                bg: "bg-green-50",
            },
            {
                icon: Tag,
                title: "Identitas Kader",
                desc: "Papan nama, nomor keanggotaan, dan lencana tingkatan kader yang terlihat jelas.",
                color: "text-orange-500",
                bg: "bg-orange-50",
            },
            {
                icon: Shield,
                title: "Kelengkapan",
                desc: "Topi PKK, tas PKK, dan perlengkapan pendukung lainnya sesuai ketentuan yang berlaku.",
                color: "text-cyan-500",
                bg: "bg-cyan-50",
            },
            {
                icon: Scissors,
                title: "Bawahan",
                desc: "Rok atau celana berwarna gelap (hitam/navy), tidak bermotif, dengan potongan rapi.",
                color: "text-slate-500",
                bg: "bg-slate-50",
            },
        ],
        ketentuan: [
            "Digunakan pada rapat, koordinasi, dan kunjungan kerja rutin",
            "Kemeja harus berwarna hijau daun sesuai standar PKK",
            "Identitas kader dan lencana wajib terpasang dengan benar",
            "Bawahan menggunakan warna gelap yang serasi dengan kemeja",
        ],
    },
    "Seragam Lapangan": {
        judul: "Pedoman Seragam Lapangan",
        desc: "Seragam Lapangan digunakan saat kegiatan di luar ruangan, seperti kerja bakti, penyuluhan langsung ke masyarakat, posyandu, serta kegiatan sosial kemasyarakatan lainnya.",
        komponen: [
            {
                icon: Shirt,
                title: "Kaos PKK",
                desc: "Kaos berkerah berwarna hijau muda dengan logo PKK di dada kiri, berbahan katun nyaman.",
                color: "text-lime-500",
                bg: "bg-lime-50",
            },
            {
                icon: HardHat,
                title: "Topi Lapangan",
                desc: "Topi lapangan berwarna hijau PKK dengan logo PKK di bagian depan yang tercetak jelas.",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
            },
            {
                icon: Star,
                title: "Rompi PKK",
                desc: "Rompi berwarna hijau PKK, dilengkapi saku depan dan logo PKK di dada kanan.",
                color: "text-teal-600",
                bg: "bg-teal-50",
            },
            {
                icon: Info,
                title: "Alas Kaki",
                desc: "Menggunakan sepatu atau sandal yang nyaman dan aman untuk kegiatan lapangan di luar ruangan.",
                color: "text-brown-500",
                bg: "bg-amber-50",
            },
        ],
        ketentuan: [
            "Digunakan khusus untuk kegiatan luar ruangan dan kemasyarakatan",
            "Kaos dan rompi PKK harus bersih dan rapi meskipun di lapangan",
            "Topi PKK wajib dikenakan sebagai perlindungan dan identitas",
            "Prioritaskan kenyamanan dan keamanan dalam memilih alas kaki",
        ],
    },
};

type TabKey = keyof typeof seragamData;

export default function KetentuanSeragam() {
    const [activeTab, setActiveTab] = useState<TabKey>("Seragam Resmi");

    const heroAnim = useScrollAnimation();
    const contentAnim = useScrollAnimation();

    const current = seragamData[activeTab];

    return (
        <div
            className="min-h-screen flex flex-col bg-white font-sans text-slate-900 pt-14"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="Ketentuan Seragam PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                ref={heroAnim.ref}
                className={`relative min-h-[360px] lg:min-h-[400px] flex items-center overflow-hidden anim-fade-up ${heroAnim.isVisible ? "show" : ""}`}
            >
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Ketentuan Seragam PKK Kabupaten Tasikmalaya"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#071330]/90 via-[#071330]/75 to-[#071330]/40"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-14">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                            <span>Panduan Busana</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                            Ketentuan Seragam PKK <br />
                            <span className="text-[#38BDF8]">Kabupaten Tasikmalaya</span>
                        </h1>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                            Panduan baku tata cara berpakaian seragam bagi seluruh jajaran pengurus dan kader PKK Kabupaten Tasikmalaya sesuai pedoman yang berlaku guna mewujudkan keseragaman dan identitas yang solid.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── TABS + KONTEN ── */}
            <section
                ref={contentAnim.ref}
                className={`py-14 bg-white anim-fade-up ${contentAnim.isVisible ? "show" : ""}`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Tab Bar */}
                    <div className="border-b border-gray-200 mb-10">
                        <div className="flex gap-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as TabKey)}
                                    className={`whitespace-nowrap px-6 py-3 text-sm font-bold border-b-2 transition-all duration-200 ${
                                        activeTab === tab
                                            ? "border-[#1DA599] text-[#1DA599]"
                                            : "border-transparent text-gray-500 hover:text-[#0F172A] hover:border-gray-300"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Konten Tab */}
                    <div className="flex flex-col lg:flex-row gap-12 items-start">

                        {/* Kiri: Teks & Komponen */}
                        <div className="w-full lg:w-3/5">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] mb-4">
                                {current.judul}
                            </h2>
                            <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
                                {current.desc}
                            </p>

                            {/* Grid Komponen 2x2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {current.komponen.map((k, i) => (
                                    <div
                                        key={i}
                                        className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:border-[#1DA599]/30 hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                                        >
                                            <k.icon size={20} className={k.color} />
                                        </div>
                                        <h3 className="text-[#0F172A] font-extrabold text-sm mb-1.5 group-hover:text-[#1DA599] transition-colors">
                                            {k.title}
                                        </h3>
                                        <p className="text-gray-500 text-xs leading-relaxed">
                                            {k.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kanan: Ilustrasi + Ketentuan */}
                        <div className="w-full lg:w-2/5 flex flex-col gap-6">
                            {/* Ilustrasi Seragam */}
                            <div className="bg-[#E5F5F4] rounded-3xl p-6 flex items-center justify-center min-h-[260px] border border-teal-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#1DA599]/10 translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-[#38BDF8]/10 -translate-x-1/2 translate-y-1/2"></div>

                                {/* Ilustrasi Figma (representasi dari silhouette PKK) */}
                                <div className="relative z-10 flex gap-4 justify-center items-end">
                                    {[
                                        { label: "Pria", height: "h-28", bg: "bg-[#1a6b6b]" },
                                        { label: "Wanita Berjilbab", height: "h-32", bg: "bg-[#1DA599]" },
                                        { label: "Non Jilbab", height: "h-30", bg: "bg-[#2a9d8f]" },
                                        { label: "Remaja Putri", height: "h-28", bg: "bg-[#52b788]" },
                                        { label: "Atasan", height: "h-24", bg: "bg-[#80ed99]" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            {/* Kepala */}
                                            <div className={`w-6 h-6 rounded-full ${item.bg} opacity-80`}></div>
                                            {/* Badan */}
                                            <div className={`w-8 ${item.height} rounded-xl ${item.bg} opacity-90 shadow-sm`}></div>
                                            <span className="text-[9px] text-[#1DA599] font-bold text-center leading-tight max-w-[40px]">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ketentuan Box */}
                            <div className="bg-[#0F172A] rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/20 flex items-center justify-center">
                                        <CheckCircle size={16} className="text-[#38BDF8]" />
                                    </div>
                                    <h3 className="text-white font-extrabold text-sm tracking-wide">
                                        Ketentuan Penggunaan
                                    </h3>
                                </div>
                                <ul className="space-y-3">
                                    {current.ketentuan.map((k, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <ChevronRight size={14} className="text-[#1DA599] flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-400 text-xs leading-relaxed">
                                                {k}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
