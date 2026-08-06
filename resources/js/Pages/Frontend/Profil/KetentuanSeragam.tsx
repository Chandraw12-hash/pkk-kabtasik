import React, { useState } from "react";
import { Head } from "@inertiajs/react";
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
    Sparkles,
    Check
} from "lucide-react";

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
                color: "text-teal-600",
                bg: "bg-teal-50",
                border: "border-teal-200",
                hoverBg: "hover:bg-teal-600",
            },
            {
                icon: Award,
                title: "Atribut Pendukung",
                desc: "Lencana/pin PKK di setiap kit, papan nama di dada kanan, dan sepatu pantofel hitam.",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200",
                hoverBg: "hover:bg-blue-600",
            },
            {
                icon: HardHat,
                title: "Kerudung/Headwear",
                desc: "Warna kerudung disesuaikan dengan warna toka PKK, polos tanpa hiasan yang berlebihan.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                hoverBg: "hover:bg-emerald-600",
            },
            {
                icon: Scissors,
                title: "Rok/Celana",
                desc: "Rok atau celana panjang berwarna hijau tobia senada dengan bawahan batik.",
                color: "text-violet-600",
                bg: "bg-violet-50",
                border: "border-violet-200",
                hoverBg: "hover:bg-violet-600",
            },
        ],
        ketentuan: [
            "Digunakan pada upacara resmi kenegaraan dan hari besar nasional",
            "Wajib menggunakan lencana PKK yang sesuai tingkatan",
            "Batik yang digunakan harus bermotif PKK resmi yang telah ditentukan",
            "Sepatu berwarna hitam dengan tinggi tumit maksimal 5 cm",
        ],
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    },
    "Seragam Kota": {
        judul: "Pedoman Seragam Kota",
        desc: "Seragam Kota digunakan pada kegiatan rapat rutin, koordinasi, kunjungan kerja, serta kegiatan-kegiatan operasional PKK tingkat kabupaten dan kecamatan.",
        komponen: [
            {
                icon: Palette,
                title: "Kemeja PKK",
                desc: "Kemeja berwarna hijau daun PKK dengan kerah biasa, berlengan panjang untuk kegiatan formal.",
                color: "text-green-600",
                bg: "bg-green-50",
                border: "border-green-200",
                hoverBg: "hover:bg-green-600",
            },
            {
                icon: Tag,
                title: "Identitas Kader",
                desc: "Papan nama, nomor keanggotaan, dan lencana tingkatan kader yang terlihat jelas.",
                color: "text-orange-600",
                bg: "bg-orange-50",
                border: "border-orange-200",
                hoverBg: "hover:bg-orange-600",
            },
            {
                icon: Shield,
                title: "Kelengkapan",
                desc: "Topi PKK, tas PKK, dan perlengkapan pendukung lainnya sesuai ketentuan yang berlaku.",
                color: "text-cyan-600",
                bg: "bg-cyan-50",
                border: "border-cyan-200",
                hoverBg: "hover:bg-cyan-600",
            },
            {
                icon: Scissors,
                title: "Bawahan",
                desc: "Rok atau celana berwarna gelap (hitam/navy), tidak bermotif, dengan potongan rapi.",
                color: "text-slate-600",
                bg: "bg-slate-50",
                border: "border-slate-200",
                hoverBg: "hover:bg-slate-600",
            },
        ],
        ketentuan: [
            "Digunakan pada rapat, koordinasi, dan kunjungan kerja rutin",
            "Kemeja harus berwarna hijau daun sesuai standar PKK",
            "Identitas kader dan lencana wajib terpasang dengan benar",
            "Bawahan menggunakan warna gelap yang serasi dengan kemeja",
        ],
        image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80",
    },
    "Seragam Lapangan": {
        judul: "Pedoman Seragam Lapangan",
        desc: "Seragam Lapangan digunakan saat kegiatan di luar ruangan, seperti kerja bakti, penyuluhan langsung ke masyarakat, posyandu, serta kegiatan sosial kemasyarakatan lainnya.",
        komponen: [
            {
                icon: Shirt,
                title: "Kaos PKK",
                desc: "Kaos berkerah berwarna hijau muda dengan logo PKK di dada kiri, berbahan katun nyaman.",
                color: "text-lime-600",
                bg: "bg-lime-50",
                border: "border-lime-200",
                hoverBg: "hover:bg-lime-600",
            },
            {
                icon: HardHat,
                title: "Topi Lapangan",
                desc: "Topi lapangan berwarna hijau PKK dengan logo PKK di bagian depan yang tercetak jelas.",
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200",
                hoverBg: "hover:bg-amber-600",
            },
            {
                icon: Star,
                title: "Rompi PKK",
                desc: "Rompi berwarna hijau PKK, dilengkapi saku depan dan logo PKK di dada kanan.",
                color: "text-teal-700",
                bg: "bg-teal-50",
                border: "border-teal-200",
                hoverBg: "hover:bg-teal-700",
            },
            {
                icon: Info,
                title: "Alas Kaki",
                desc: "Menggunakan sepatu atau sandal yang nyaman dan aman untuk kegiatan lapangan di luar ruangan.",
                color: "text-brown-600",
                bg: "bg-orange-50",
                border: "border-orange-200",
                hoverBg: "hover:bg-orange-600",
            },
        ],
        ketentuan: [
            "Digunakan khusus untuk kegiatan luar ruangan dan kemasyarakatan",
            "Kaos dan rompi PKK harus bersih dan rapi meskipun di lapangan",
            "Topi PKK wajib dikenakan sebagai perlindungan dan identitas",
            "Prioritaskan kenyamanan dan keamanan dalam memilih alas kaki",
        ],
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    },
};

type TabKey = keyof typeof seragamData;

export default function KetentuanSeragam() {
    const [activeTab, setActiveTab] = useState<TabKey>("Seragam Resmi");
    const current = seragamData[activeTab];

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-slate-900 pt-14 selection:bg-[#1DA599]/30">
            <Head title="Ketentuan Seragam PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO MATCHEDengan HALAMAN LAIN ── */}
            <section className="relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden" data-aos="fade-up">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Ketentuan Seragam PKK"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B2A3B]/92 via-[#0B2A3B]/75 to-[#0B2A3B]/45"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                            <span>Panduan Busana</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Ketentuan <br className="hidden md:block"/>
                            <span className="text-[#38BDF8]">Seragam PKK</span>
                        </h1>
                        <p className="text-gray-200 text-base mb-8 leading-relaxed max-w-md">
                            Panduan baku tata cara berpakaian seragam bagi seluruh jajaran pengurus dan kader PKK Kabupaten Tasikmalaya guna mewujudkan keseragaman dan identitas yang solid dan elegan.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── TABS ELEGANT ── */}
            <section className="relative z-20 -mt-10" data-aos="fade-up" data-aos-delay="100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="bg-white rounded-full p-2 shadow-xl shadow-slate-200/50 flex overflow-x-auto hide-scrollbar border border-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as TabKey)}
                                className={`relative whitespace-nowrap px-8 py-3.5 text-sm font-bold rounded-full transition-all duration-300 flex-1 text-center ${
                                    activeTab === tab
                                        ? "text-white bg-gradient-to-r from-[#1DA599] to-[#128277] shadow-lg shadow-teal-500/30"
                                        : "text-gray-500 hover:text-[#0F172A] hover:bg-gray-50"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── KONTEN DYNAMIC ── */}
            <section className="py-20 relative overflow-hidden">
                {/* Dekorasi Background */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1DA599]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#38BDF8]/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        
                        {/* Kiri: Teks & Komponen */}
                        <div className="w-full lg:w-7/12" data-aos="fade-right">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-[#1DA599] text-[11px] font-black tracking-widest uppercase mb-6">
                                <Sparkles size={14} />
                                Standar Penampilan
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-5 leading-tight">
                                {current.judul}
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed mb-10 font-medium">
                                {current.desc}
                            </p>

                            {/* Grid Komponen Premium */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {current.komponen.map((k, i) => (
                                    <div
                                        key={i}
                                        className="group relative bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                    >
                                        <div className={`absolute top-0 right-0 w-32 h-32 ${k.bg} rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-150 opacity-50`}></div>
                                        
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-12 h-12 rounded-2xl ${k.bg} border ${k.border} flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors duration-300 relative overflow-hidden`}>
                                                <div className={`absolute inset-0 ${k.hoverBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                                <k.icon size={22} className={`relative z-10 ${k.color} group-hover:text-white transition-colors`} />
                                            </div>
                                            <div>
                                                <h3 className="text-[#0F172A] font-extrabold text-base group-hover:text-[#1DA599] transition-colors mt-1">
                                                    {k.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-gray-500 text-[13px] leading-relaxed">
                                            {k.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kanan: Ilustrasi + Ketentuan */}
                        <div className="w-full lg:w-5/12" data-aos="fade-left">
                            
                            {/* Visual Image */}
                            <div className="relative rounded-[32px] overflow-hidden shadow-2xl mb-8 group aspect-[4/3] md:aspect-auto md:h-[340px]">
                                <div className="absolute inset-0 bg-[#0F172A]/20 group-hover:bg-[#0F172A]/10 transition-colors duration-500 z-10"></div>
                                <img 
                                    src={current.image} 
                                    alt={current.judul}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                    <Shield size={14} className="text-[#1DA599]" />
                                    <span className="text-xs font-black text-[#0F172A] tracking-wider uppercase">Visual Seragam</span>
                                </div>
                            </div>

                            {/* Ketentuan Box */}
                            <div className="bg-[#0F172A] rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-[#1DA599]/20 rounded-full blur-[50px]"></div>
                                
                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8] to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                        <CheckCircle size={20} className="text-white" />
                                    </div>
                                    <h3 className="text-white font-extrabold text-lg">
                                        Ketentuan Penggunaan
                                    </h3>
                                </div>
                                
                                <ul className="space-y-4 relative z-10">
                                    {current.ketentuan.map((k, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-[#1DA599]/20 flex items-center justify-center flex-shrink-0">
                                                <Check size={12} className="text-[#1DA599]" />
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed font-medium">
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
