import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Music,
    Download,
    BookOpen,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Share2,
    Users,
} from "lucide-react";

export default function MarsPkk() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans text-slate-900 pt-14 selection:bg-[#1DA599]/30">
            <Head title="Mars PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO MATCHED ── */}
            <section className="relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden" data-aos="fade-up">
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Mars PKK"
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
                            <span>Lagu Kebanggaan</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Mars <br className="hidden md:block"/>
                            <span className="text-[#38BDF8]">PKK</span>
                        </h1>
                        <p className="text-gray-200 text-base mb-8 leading-relaxed max-w-md">
                            Nyanyian pemersatu jiwa dan semangat juang kader PKK dalam mewujudkan keluarga yang sejahtera, bertaqwa, dan mandiri di tanah Sukapura.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#lirik"
                                className="inline-flex items-center gap-2 bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-teal-600/30 text-sm"
                            >
                                <BookOpen size={16} />
                                Baca Lirik
                            </a>
                            <a
                                href="#"
                                className="inline-flex items-center gap-2 bg-transparent border-2 border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-bold px-8 py-3.5 rounded-full transition-all text-sm"
                            >
                                <Download size={16} />
                                Unduh Partitur
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── AUDIO PLAYER BANNER ── */}
            <section className="bg-[#0F172A] py-10" data-aos="fade-up">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Disc & Title */}
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="relative w-16 h-16 rounded-full bg-[#1DA599] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#1DA599]/30">
                                <div className={`absolute inset-1 rounded-full border-2 border-white/20 ${isPlaying ? "animate-[spin_4s_linear_infinite]" : ""}`}></div>
                                <Music size={24} className="text-white relative z-10" />
                            </div>
                            <div>
                                <h3 className="text-white font-extrabold text-lg mb-1">Mars PKK</h3>
                                <p className="text-gray-400 text-xs">
                                    Paduan Suara TP PKK Kabupaten Tasikmalaya
                                </p>
                            </div>
                        </div>

                        {/* Controls & Progress */}
                        <div className="flex-1 w-full max-w-xl flex flex-col items-center">
                            {/* Buttons */}
                            <div className="flex items-center gap-6 mb-3">
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    <SkipBack size={20} />
                                </button>
                                <button 
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-10 h-10 rounded-full bg-[#1DA599] hover:bg-teal-500 flex items-center justify-center text-white transition-all shadow-md shadow-[#1DA599]/40"
                                >
                                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                                </button>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                    <SkipForward size={20} />
                                </button>
                            </div>
                            {/* Bar */}
                            <div className="flex items-center gap-3 w-full">
                                <span className="text-[10px] text-gray-500 font-medium">01:24</span>
                                <div className="flex-1 h-1.5 bg-gray-700 rounded-full relative cursor-pointer group">
                                    <div className="absolute top-0 left-0 h-full bg-[#1DA599] rounded-full w-[45%]"></div>
                                    <div className="absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"></div>
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium">03:15</span>
                            </div>
                        </div>

                        {/* Volume */}
                        <div className="hidden lg:flex items-center gap-3 w-32">
                            <Volume2 size={18} className="text-gray-400" />
                            <div className="flex-1 h-1 bg-gray-700 rounded-full relative cursor-pointer">
                                <div className="absolute top-0 left-0 h-full bg-gray-300 rounded-full w-[70%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── LIRIK LAGU ── */}
            <section id="lirik" className="py-24 bg-white" data-aos="fade-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] inline-block relative">
                            Lirik Lagu Kebangsaan
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1DA599] rounded-full"></div>
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        {/* Foto Tim PKK */}
                        <div className="w-full lg:w-5/12 sticky top-24">
                            <div className="rounded-3xl overflow-hidden shadow-2xl relative">
                                <img
                                    src="/assets/images/hero.jpg"
                                    alt="Tim PKK Kabupaten Tasikmalaya"
                                    className="w-full aspect-[4/5] object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1592424005742-8820c744f9ea?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <p className="text-white/90 text-sm italic font-medium leading-relaxed">
                                        "Membangun keluarga yang sejahtera dengan PKK..."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Teks Lirik */}
                        <div className="w-full lg:w-7/12">
                            <div className="bg-[#F8FAFC] border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
                                <div className="space-y-6 text-[#475569] text-base md:text-lg leading-[1.8] font-medium">
                                    <p>
                                        Marilah hai semua Rakyat Indonesia<br />
                                        Membangun segara<br />
                                        Membangun keluarga yang sejahtera<br />
                                        Dengan PKK
                                    </p>
                                    <p>
                                        Hayati dan amalkan Pancasila<br />
                                        Untuk Negara<br />
                                        Hidup gotong royong, makmur pangan dan sandang<br />
                                        Rumah sehat sentosa
                                    </p>
                                    <p>
                                        Tata laksana di dalam rumah tangga<br />
                                        Rapi dan indah<br />
                                        Didiklah putra berkepribadian bangsa<br />
                                        Tampil dan sehat
                                    </p>
                                    <p>
                                        Kembangkan koperas jagalah lingkungan<br />
                                        Dan sekitarnya<br />
                                        Aman dan bahagia keluarga berencana<br />
                                        <strong className="text-[#0F172A] font-extrabold text-xl">Hidup Jaya PKK</strong>
                                    </p>
                                </div>

                                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ciptaan:</p>
                                        <p className="text-[#0F172A] font-semibold text-sm">Tim Penggerak PKK Pusat</p>
                                    </div>
                                    <button className="inline-flex items-center gap-2 text-[#1DA599] hover:bg-[#1DA599]/10 px-4 py-2 rounded-full font-bold text-xs transition-colors">
                                        <Share2 size={14} />
                                        Bagikan Lirik
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA GABUNG KADER ── */}
            <section className="pb-24 pt-10 bg-white relative" data-aos="fade-up">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-[40px] p-10 md:p-14 text-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 relative z-10">
                        <div className="w-16 h-16 bg-[#E5F5F4] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Users size={28} className="text-[#1DA599]" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">
                            Ingin Bergabung Menjadi Kader?
                        </h2>
                        <p className="text-gray-500 text-[15px] leading-relaxed mb-10 max-w-lg mx-auto">
                            Jadilah bagian dari perubahan untuk Kabupaten Tasikmalaya yang lebih mandiri dan sejahtera.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="#"
                                className="inline-flex items-center justify-center bg-[#1DA599] hover:bg-teal-600 text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-lg shadow-teal-600/30 text-sm w-full sm:w-auto"
                            >
                                Daftar Kader Sekarang
                            </Link>
                            <Link
                                href="#"
                                className="inline-flex items-center justify-center bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full transition-all text-sm w-full sm:w-auto shadow-lg shadow-slate-900/20"
                            >
                                Pelajari Program Pokja
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Dekorasi BG Bawah untuk menyambung ke footer (Opsional, efek tumpuk) */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-[#0F172A] -z-0"></div>
            </section>

            <Footer />
        </div>
    );
}
