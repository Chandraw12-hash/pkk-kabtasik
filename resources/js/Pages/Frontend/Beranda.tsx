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

            <section ref={heroAnim.ref} className={`relative h-[600px] lg:h-[650px] flex items-center overflow-hidden anim-fade-up ${heroAnim.isVisible ? 'show' : ''}`}>
                <div className="absolute inset-0 w-full h-full">
                    <img src="/assets/images/hero.jpg" alt="Hero Background PKK" className="w-full h-full object-cover bg-center" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"; }} />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center space-x-2 text-[#38BDF8] font-bold tracking-widest text-xs mb-6 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                            <span>Sistem Informasi Keluarga PKK</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-white leading-[1.15] mb-6">
                            Pemberdayaan dan <br />Kesejahteraan Keluarga (PKK) <br />
                            <span className="text-[#38BDF8]">Sejahtera & Mandiri</span>
                        </h1>
                        <p className="text-gray-300 text-lg mb-10 max-w-xl leading-relaxed">
                            Sistem pemberdayaan masyarakat Kabupaten Tasikmalaya menuju keluarga sejahtera dan mandiri melalui 10 Program Pokok PKK.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link href="#program" className="bg-[#38BDF8] hover:bg-cyan-500 text-[#071330] px-8 py-3.5 rounded-full font-bold transition text-center shadow-lg shadow-cyan-500/30 text-sm flex items-center justify-center gap-2">
                                Program &rarr;
                            </Link>
                            <Link href="#berita" className="bg-transparent border border-gray-400 hover:border-white hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-semibold transition text-center text-sm">
                                Berita PKK
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={sambutanAnim.ref} id="tentang" className={`py-20 bg-blue-50/30 anim-fade-up ${sambutanAnim.isVisible ? 'show' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-5/12">
                            <div className="relative bg-[#E5F5F4] rounded-[30px] p-6 shadow-sm border border-teal-100 overflow-hidden text-center group h-[400px] md:h-[500px] flex flex-col justify-end items-center">
                                <img src="/assets/images/ketua-pkk.jpg" alt="Hj. Ai Diantani Sugianto" className="absolute inset-0 w-full h-full object-cover object-top z-10 opacity-90 transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"; }} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#E5F5F4] via-transparent to-transparent z-10"></div>
                                <div className="relative z-20 mb-4 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-sm inline-block w-11/12 border border-white/50">
                                    <h3 className="text-xl font-extrabold text-[#0F172A] mb-1">Hj. Ai Diantani Sugianto</h3>
                                    <p className="text-[10px] font-bold text-[#1DA599] tracking-widest uppercase">Ketua TP PKK Kabupaten Tasikmalaya</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-7/12">
                            <div className="inline-block text-[#1DA599] font-bold tracking-widest text-xs uppercase mb-3">Salam Hangat</div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-8">Sambutan Ketua <span className="text-[#1DA599]">PKK</span></h2>
                            <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
                                <p className="italic text-gray-500 font-medium">Assalamu'alaikum Warahmatullahi Wabarakatuh,</p>
                                <p>Dalam rangka turut menyukseskan program Pembangunan Daerah Kabupaten Tasikmalaya, selamat datang di Website Resmi TP PKK Kabupaten Tasikmalaya. Puji dan syukur kami panjatkan kepada Allah SWT atas segala nikmat yang diberikan.</p>
                                <p>Website ini hadir sebagai media informasi dan publikasi untuk memenuhi kebutuhan informasi masyarakat mengenai berbagai kegiatan dan 10 Program Pokok PKK di Kabupaten Tasikmalaya secara transparan dan akuntabel.</p>
                                <p>Saya mengajak seluruh pengurus, kader, dan masyarakat untuk bersama-sama memajukan PKK dalam rangka mewujudkan kesejahteraan keluarga, khususnya di wilayah Kabupaten Tasikmalaya yang kita cintai ini.</p>
                                <p>Semoga website ini bermanfaat dalam meningkatkan kualitas layanan informasi publik. Terima kasih.</p>
                                <p className="font-bold text-[#0F172A] pt-3">Wassalamu'alaikum Warahmatullahi Wabarakatuh.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={dataAnim.ref} className={`py-20 bg-white relative anim-fade-up ${dataAnim.isVisible ? 'show' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#E5F5F4] flex items-center justify-center shadow-sm">
                                <MapPin className="text-[#1DA599]" size={24} />
                            </div>
                        </div>
                        <h2 className="text-[28px] font-black text-[#0F172A] mb-2 uppercase tracking-wider">
                            Data PKK Kabupaten Tasikmalaya
                        </h2>
                        <p className="text-gray-500 font-semibold text-[15px]">
                            Pusat Informasi dan Statistik Program Pokok PKK secara Terpadu
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 px-0 lg:px-4">
                        {[
                            { title: "DATA UMUM", desc: "Administrasi Tim Penggerak PKK & Rekapitulasi Profil Kependudukan", icon: Users, iconBg: "bg-[#38BDF8]", iconShadow: "shadow-cyan-500/50", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", overlay: "bg-[#071330]/85 group-hover:bg-[#071330]/75", btnText: "Eksplorasi", link: "#", btnHover: "hover:text-[#071330]" },
                            { title: "POKJA I", desc: "Penghayatan Pengamalan Pancasila & Pembinaan Gotong Royong", icon: Heart, iconBg: "bg-blue-500", iconShadow: "shadow-blue-500/50", img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=600&q=80", overlay: "bg-[#155A63]/85 group-hover:bg-[#155A63]/75", btnText: "Eksplorasi", link: "#", btnHover: "hover:text-[#155A63]" },
                            { title: "POKJA II", desc: "Pendidikan, Keterampilan, Pengembangan Kehidupan Berkoperasi", icon: GraduationCap, iconBg: "bg-emerald-500", iconShadow: "shadow-emerald-500/50", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80", overlay: "bg-[#0B4B3D]/85 group-hover:bg-[#0B4B3D]/75", btnText: "Eksplorasi", link: "#", btnHover: "hover:text-[#0B4B3D]" },
                            { title: "POKJA III", desc: "Pangan, Sandang, Perumahan dan Tata Laksana Rumah Tangga", icon: Utensils, iconBg: "bg-red-500", iconShadow: "shadow-red-500/50", img: "https://images.unsplash.com/photo-1556910103-1c02745a872e?auto=format&fit=crop&w=600&q=80", overlay: "bg-[#7B2929]/85 group-hover:bg-[#7B2929]/75", btnText: "Observasi", link: "#", btnHover: "hover:text-[#7B2929]" },
                            { title: "POKJA IV", desc: "Kesehatan, Kelestarian Lingkungan & Perencanaan Sehat", icon: Stethoscope, iconBg: "bg-teal-500", iconShadow: "shadow-teal-500/50", img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80", overlay: "bg-[#164956]/85 group-hover:bg-[#164956]/75", btnText: "Eksplorasi", link: "#", btnHover: "hover:text-[#164956]" },
                            { title: "WEBSITE UTAMA", desc: "Kembali mengakses Halaman Portal Publik Kabupaten Tasikmalaya", icon: Globe, iconBg: "bg-blue-600", iconShadow: "shadow-blue-600/50", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80", overlay: "bg-[#1E2B58]/85 group-hover:bg-[#1E2B58]/75", btnText: "Kembali", link: "#", btnHover: "hover:text-[#1E2B58]" }
                        ].map((item, i) => (
                            <div key={i} className="group relative h-[260px] rounded-[20px] overflow-hidden shadow-lg border border-gray-100">
                                <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className={`absolute inset-0 ${item.overlay} transition-colors duration-300`}></div>
                                <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
                                    <div className={`${item.iconBg} w-12 h-12 rounded-full flex items-center justify-center text-white mb-4 shadow-sm`}>
                                        <item.icon size={24} />
                                    </div>
                                    <h3 className="text-white font-extrabold text-[22px] mb-2 tracking-widest uppercase">{item.title}</h3>
                                    <p className="text-gray-200 font-semibold text-[13px] mb-5 px-2 leading-relaxed">
                                        {item.desc}
                                    </p>
                                    <Link href={item.link} className={`inline-block border-2 border-white/70 text-white hover:bg-white ${item.btnHover} px-7 py-2 rounded-full text-[12px] font-extrabold uppercase tracking-wider transition-colors`}>
                                        {item.btnText}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section ref={beritaAnim.ref} className={`py-24 bg-gray-50 border-t border-gray-100 relative anim-fade-up ${beritaAnim.isVisible ? 'show' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-end mb-12">
                        <div>
                            <div className="inline-block text-[#1DA599] font-bold tracking-widest text-xs uppercase mb-3 border-l-[3px] border-[#1DA599] pl-3">
                                UPDATE INFORMASI
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">
                                Berita <span className="text-[#1DA599]">PKK</span> Terkini
                            </h2>
                        </div>
                        <div className="flex space-x-3 mt-6 sm:mt-0">
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#1DA599] hover:border-[#1DA599] transition-colors bg-white">
                                <ChevronRight size={18} className="rotate-180" />
                            </button>
                            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#1DA599] hover:border-[#1DA599] transition-colors bg-white">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {beritaTerbaru.map((item, index) => {
                            const badges = ["DATA UMUM", "POKJA II", "POKJA IV"];
                            return (
                                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
                                    <div className="relative h-56 overflow-hidden">
                                        <img src={item.image} alt={item.judul} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-[#0F172A] shadow-sm tracking-wider">
                                            {badges[index % badges.length]}
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-[19px] font-bold text-[#0F172A] mb-3 line-clamp-2 group-hover:text-[#1DA599] transition-colors leading-tight">
                                            {item.judul}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {item.deskripsi}
                                        </p>
                                        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                                            <span className="text-[11px] font-semibold text-gray-400 tracking-wider">
                                                {item.tanggal}
                                            </span>
                                            <Link href={item.link} className="text-xs font-bold text-[#1DA599] hover:text-teal-700 flex items-center transition-colors">
                                                Baca Selengkapnya <ChevronRight size={14} className="ml-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
