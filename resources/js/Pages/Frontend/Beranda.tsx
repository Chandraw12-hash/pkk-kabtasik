import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";

// --- UBAH INI JADI SATU TITIK SAJA (KARENA BERADA DI FOLDER YANG SAMA) ---
import Navbar from "./Layouts/Navbar";
import Footer from "./Layouts/Footer";
// -------------------------------------------------------------------------

import {
    Users, BookOpen, Heart, Home, Leaf, Calendar, Award, ArrowRight, ChevronRight, TrendingUp, FileText, Eye, CheckCircle, Layers, UserCheck, GraduationCap, Utensils, Shirt, Building2, Stethoscope, Handshake, TreePine, ClipboardList, Sparkles, Globe, Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube, Quote,
} from "lucide-react";

interface Kebijakan { id: number; judul: string; file_path: string; deskripsi?: string; urutan: number; }
interface ChartData { year: string; value: number; }
interface DomainData { id: number; title: string; nilai: number; }
interface WelcomeProps { kebijakan: Kebijakan[]; chartData: ChartData[]; domainData: DomainData[]; year: number; berita?: any[]; galeri?: any[]; }

const programPokokPKK = [
    { id: 1, nama: "Penghayatan dan Pengamalan Pancasila", icon: Sparkles, deskripsi: "Pembinaan mental spiritual dan pengamalan nilai-nilai Pancasila dalam kehidupan sehari-hari" },
    { id: 2, nama: "Gotong Royong", icon: Handshake, deskripsi: "Meningkatkan semangat kebersamaan dan gotong royong di masyarakat" },
    { id: 3, nama: "Pangan", icon: Utensils, deskripsi: "Pemenuhan kebutuhan pangan keluarga yang bergizi dan beragam" },
    { id: 4, nama: "Sandang", icon: Shirt, deskripsi: "Pemenuhan kebutuhan sandang yang layak dan berkualitas" },
    { id: 5, nama: "Perumahan dan Tata Laksana Rumah Tangga", icon: Building2, deskripsi: "Pembinaan perumahan sehat dan tata laksana rumah tangga yang baik" },
    { id: 6, nama: "Pendidikan dan Keterampilan", icon: GraduationCap, deskripsi: "Peningkatan pendidikan dan keterampilan untuk meningkatkan kualitas hidup" },
    { id: 7, nama: "Kesehatan", icon: Stethoscope, deskripsi: "Pembinaan kesehatan keluarga dan masyarakat" },
    { id: 8, nama: "Pengembangan Kehidupan Berkoperasi", icon: Handshake, deskripsi: "Mendorong pengembangan koperasi dan usaha ekonomi produktif" },
    { id: 9, nama: "Kelestarian Lingkungan Hidup", icon: TreePine, deskripsi: "Pelestarian dan pengelolaan lingkungan hidup yang berkelanjutan" },
    { id: 10, nama: "Perencanaan Sehat", icon: ClipboardList, deskripsi: "Perencanaan keluarga sehat dan pembinaan kesejahteraan keluarga" },
];

const pokjaPKK = [
    { id: 1, nama: "Pokja I", program: "Penghayatan Pengamalan Pancasila", icon: Sparkles, color: "teal", deskripsi: "Pembinaan mental spiritual dan penguatan gotong royong" },
    { id: 2, nama: "Pokja II", program: "Pendidikan, Keterampilan & Koperasi", icon: GraduationCap, color: "indigo", deskripsi: "Peningkatan pendidikan, keterampilan, dan pengembangan koperasi" },
    { id: 3, nama: "Pokja III", program: "Pangan, Sandang, Perumahan & Tata Laksana RT", icon: Home, color: "emerald", deskripsi: "Pemenuhan kebutuhan dasar keluarga dan tata laksana rumah tangga" },
    { id: 4, nama: "Pokja IV", program: "Kesehatan, Lingkungan & Perencanaan Sehat", icon: Heart, color: "slate", deskripsi: "Pembinaan kesehatan, pelestarian lingkungan, dan perencanaan sehat" },
];

const colorMap = {
    teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", hover: "hover:border-teal-300", gradient: "from-teal-600 to-teal-700", light: "bg-teal-600", lightHover: "hover:bg-teal-700", shadow: "shadow-teal-600/30", badge: "bg-teal-100 text-teal-700 border-teal-200", cardBg: "bg-[#1a3b5c]", cardHover: "hover:bg-[#1a3b5c]/90" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", hover: "hover:border-indigo-300", gradient: "from-indigo-600 to-indigo-700", light: "bg-indigo-600", lightHover: "hover:bg-indigo-700", shadow: "shadow-indigo-600/30", badge: "bg-indigo-100 text-indigo-700 border-indigo-200", cardBg: "bg-[#266867]", cardHover: "hover:bg-[#266867]/90" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", hover: "hover:border-emerald-300", gradient: "from-emerald-600 to-emerald-700", light: "bg-emerald-600", lightHover: "hover:bg-emerald-700", shadow: "shadow-emerald-600/30", badge: "bg-emerald-100 text-emerald-700 border-emerald-200", cardBg: "bg-[#006b4c]", cardHover: "hover:bg-[#006b4c]/90" },
    slate: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-300", hover: "hover:border-slate-400", gradient: "from-slate-700 to-slate-800", light: "bg-slate-700", lightHover: "hover:bg-slate-800", shadow: "shadow-slate-700/30", badge: "bg-slate-100 text-slate-700 border-slate-300", cardBg: "bg-[#1f2937]", cardHover: "hover:bg-[#1f2937]/90" }
};

function useScrollAnimation() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); } }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, []);
    return { ref, isVisible };
}

export default function Welcome({ kebijakan, chartData, domainData, year, berita = [], }: WelcomeProps) {
    const beritaTerbaru = berita.length > 0 ? berita : [
        { id: 1, judul: "Pentingnya Pemberdayaan Perempuan dalam Keluarga", tanggal: "10 Oktober 2023", deskripsi: "Pemberdayaan perempuan merupakan salah satu langkah strategis dalam membangun keluarga yang mandiri...", link: "#", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 2, judul: "Giat Literasi dan Pembinaan Karakter Anak Sejak Dini", tanggal: "08 Oktober 2023", deskripsi: "Program literasi yang digagas oleh PKK Kabupaten Tasikmalaya bertujuan untuk menumbuhkan minat baca anak...", link: "#", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
        { id: 3, judul: "Sinergi PKK dan Posyandu dalam Pelayanan Kesehatan Masyarakat", tanggal: "05 Oktober 2023", deskripsi: "Kolaborasi antara PKK dan Posyandu menjadi garda terdepan dalam memberikan pelayanan kesehatan...", link: "#", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
    ];

    const heroAnim = useScrollAnimation();
    const sambutanAnim = useScrollAnimation();
    const dataAnim = useScrollAnimation();
    const beritaAnim = useScrollAnimation();

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 pt-14" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`::-webkit-scrollbar { display: none; } .anim-fade-up { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); } .anim-fade-up.show { opacity: 1; transform: translateY(0); }`}</style>

            <Head title="PKK Kabupaten Tasikmalaya - Sejahtera & Mandiri" />
            <Navbar />

            <section ref={heroAnim.ref} className={`relative h-[600px] lg:h-[700px] flex items-center overflow-hidden anim-fade-up ${heroAnim.isVisible ? 'show' : ''}`}>
                <div className="absolute inset-0 w-full h-full">
                    <img src="/assets/images/hero.jpg" alt="Hero Background PKK" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"; }} />
                    <div className="absolute inset-0 bg-slate-900/70"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-teal-500/20 text-teal-100 text-xs font-bold tracking-wider uppercase mb-4 border border-teal-400/30">Pemberdayaan & Kesejahteraan Keluarga</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">Pemberdayaan dan <br /> Kesejahteraan Keluarga (PKK) <br /> <span className="text-teal-300">Sejahtera & Mandiri</span></h1>
                        <p className="text-lg text-slate-200 mb-8 leading-relaxed max-w-xl">Sinergi pemberdayaan masyarakat Kabupaten Tasikmalaya menuju kemajuan berbasis kearifan lokal melalui 10 Program Pokok PKK.</p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="#program-pokok" className="inline-flex items-center px-6 py-3 bg-teal-400 hover:bg-teal-500 text-white font-semibold rounded-full transition-all">Lihat Program PKK <ChevronRight size={18} className="ml-1" /></Link>
                            <Link href="#tentang" className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-full transition-all border border-white/30">Tentang PKK</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={sambutanAnim.ref} id="tentang" className={`py-16 bg-white anim-fade-up ${sambutanAnim.isVisible ? 'show' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 items-center bg-slate-50 rounded-3xl p-8 lg:p-12 shadow-sm">
                        <div className="lg:w-1/3 flex flex-col items-center">
                            <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                                <img src="/assets/images/ketua-pkk.jpg" alt="Ketua PKK Kabupaten Tasikmalaya" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"; }} />
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="font-bold text-lg text-slate-900">Hj. Aan Setya Siti Sugianto, S.Pd., M.M.</h3>
                                <p className="text-sm text-teal-600 font-medium">KETUA TP PKK KABUPATEN TASIKMALAYA</p>
                            </div>
                        </div>
                        <div className="lg:w-2/3">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Sambutan</h4>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Sambutan Ketua PKK</h2>
                            <div className="space-y-4 text-slate-700 leading-relaxed text-sm md:text-base border-l-4 border-teal-400 pl-6 italic">
                                <p>"Assalamualaikum warahmatullahi wabarakatuh. Puji syukur kita panjatkan kehadirat Allah SWT, karena atas rahmat dan hidayah-Nya kita dapat terus bersinergi dalam upaya pemberdayaan dan kesejahteraan keluarga di Kabupaten Tasikmalaya."</p>
                                <p>"Saya mengajak seluruh kader PKK dan masyarakat untuk bersama-sama melaksanakan 10 Program Pokok PKK dengan penuh semangat dan dedikasi. Mari kita wujudkan keluarga yang sehat, cerdas, dan mandiri."</p>
                                <p className="font-semibold text-slate-900 mt-4 not-italic">Wassalamualaikum warahmatullahi wabarakatuh.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={dataAnim.ref} className={`py-20 bg-white relative anim-fade-up ${dataAnim.isVisible ? 'show' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">DATA PKK KABUPATEN TASIKMALAYA</h2>
                        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">Data dan informasi seputar Program PKK di Kabupaten Tasikmalaya</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[/* Data Umum */].map((_, i) => (
                            <div key={i} className="group relative h-[320px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100">
                                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" alt="Data" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-slate-900/70 group-hover:bg-slate-900/60 transition-colors duration-300"></div>
                                <div className="absolute inset-0 p-8 flex flex-col items-center justify-between text-center text-white">
                                    <div className="mt-4">
                                        <div className="bg-[#00bcd4] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/50"><Users size={32} className="text-white" /></div>
                                        <h3 className="font-bold text-2xl tracking-wide uppercase">Data Umum</h3>
                                        <p className="text-white/80 text-sm mt-2 font-light leading-relaxed max-w-xs mx-auto">Data Administrasi TP PKK & Rekapitulasi Profil Kependudukan</p>
                                    </div>
                                    <Link href="#" className="px-6 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-sm font-medium rounded-full border border-white/20 transition-all duration-300">Eksplorasi</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={beritaAnim.ref} className={`py-16 bg-slate-50 relative anim-fade-up ${beritaAnim.isVisible ? 'show' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                        <div><h2 className="text-2xl font-bold text-slate-900 tracking-tight">Berita PKK Terkini</h2></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {beritaTerbaru.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                <div className="h-48 overflow-hidden"><img src={item.image} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                                <div className="p-5">
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">{item.judul}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">{item.deskripsi}</p>
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                        <span className="text-xs text-slate-400 font-medium"><Calendar size={14} className="inline mr-1" /> {item.tanggal}</span>
                                        <Link href={item.link} className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center">Baca Selengkapnya <ArrowRight size={14} className="ml-1" /></Link>
                                    </div>
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
