import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    ChevronRight,
    ArrowRight,
    Shield,
    Sprout,
    TrendingUp,
} from "lucide-react";

export default function Sejarah() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Sejarah PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== HERO ==================== */}
            <section className="relative h-[420px] lg:h-[480px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Sejarah PKK Kabupaten Tasikmalaya"
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
                        Jelajahi Sejarah PKK
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                        Sejarah PKK
                    </h1>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
                        Menelusuri perjalanan panjang gerakan Pemberdayaan dan
                        Kesejahteraan Keluarga dalam membangun dan memperkuat
                        sendi-sendi kehidupan bangsa.
                    </p>
                    <Link
                        href="#sejarah-konten"
                        className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                    >
                        Baca Sejarah
                        <ChevronRight size={15} />
                    </Link>
                </div>
            </section>

            {/* ==================== KONTEN SEJARAH ==================== */}
            <section
                id="sejarah-konten"
                className="py-20 lg:py-24 bg-white border-t border-slate-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                        {/* Gambar */}
                        <div className="w-full lg:w-5/12">
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <img
                                    src="/assets/images/hero.jpg"
                                    alt="Kegiatan PKK Tasikmalaya"
                                    className="w-full h-80 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                            </div>
                            <div className="mt-4">
                                <p className="text-base font-semibold text-slate-900">
                                    PKK Kabupaten Tasikmalaya
                                </p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Pemberdayaan &amp; Kesejahteraan Keluarga
                                </p>
                            </div>
                        </div>

                        {/* Teks Sejarah */}
                        <div className="w-full lg:w-7/12">
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Jejak Langkah Sejarah
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                                Sejarah Singkat PKK
                            </h2>

                            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                                <p>
                                    Gerakan Pemberdayaan dan Kesejahteraan
                                    Keluarga (PKK) merupakan gerakan nasional
                                    yang tumbuh dan berkembang dari bawah,
                                    dikelola oleh masyarakat dengan perempuan
                                    sebagai penggerak untuk membangun keluarga
                                    yang berakhlak mulia, sehat, sejahtera, maju,
                                    dan mandiri.
                                </p>
                                <p>
                                    Sejarah PKK dimulai pada tahun 1960-an sebagai
                                    inisiatif pemberdayaan masyarakat dalam
                                    meningkatkan kualitas hidup keluarga di
                                    bidang pendidikan, kesehatan, ekonomi, dan
                                    sosial budaya.
                                </p>
                                <p>
                                    Seiring perkembangan zaman, PKK terus menjadi
                                    mitra strategis pemerintah dalam implementasi
                                    10 Program Pokok PKK yang bertujuan
                                    meningkatkan kesejahteraan masyarakat dan
                                    memperkuat ketahanan keluarga secara
                                    menyeluruh.
                                </p>
                                <p>
                                    Di Kabupaten Tasikmalaya, PKK hadir sebagai
                                    bagian dari sistem pemberdayaan masyarakat,
                                    serta menjangkau seluruh lapisan masyarakat
                                    dari tingkat kabupaten hingga desa, untuk
                                    mewujudkan Kabupaten Tasikmalaya yang
                                    sejahtera, maju, dan berkeadilan bagi seluruh
                                    masyarakatnya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== INOVASI ==================== */}
            <section className="py-20 lg:py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
                        <div>
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Program Unggulan
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Inovasi Kabupaten Tasikmalaya
                            </h2>
                            <p className="text-slate-500 text-sm mt-2 max-w-lg leading-relaxed">
                                Berbagai inovasi yang menjadi bagian dari sejarah
                                dan langkah nyata untuk kemajuan Tasikmalaya.
                            </p>
                        </div>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors whitespace-nowrap"
                        >
                            Lihat Program PKK
                            <ChevronRight size={15} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Penanganan Stunting",
                                desc: "Program prioritas intervensi gizi keluarga untuk menurunkan angka stunting di Kabupaten Tasikmalaya.",
                                icon: Shield,
                                img: "/assets/images/hero.jpg",
                            },
                            {
                                title: "Pemberdayaan Ekonomi",
                                desc: "Pelatihan usaha, koperasi, dan pemberdayaan ekonomi keluarga melalui berbagai program PKK.",
                                icon: TrendingUp,
                                img: "https://images.unsplash.com/photo-1556910103-1c02745a872e?auto=format&fit=crop&w=600&q=80",
                            },
                            {
                                title: "Ketahanan Pangan",
                                desc: "Inovasi lahan pangan keluarga dan program ketahanan pangan rumah tangga untuk Tasikmalaya.",
                                icon: Sprout,
                                img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
                            },
                        ].map((item, i) => (
                            <article
                                key={i}
                                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors flex flex-col h-full"
                            >
                                <div className="h-44 overflow-hidden">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=600&q=80";
                                        }}
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <item.icon
                                            size={16}
                                            className="text-teal-600"
                                        />
                                        <h3 className="text-base font-semibold text-slate-900">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                                        {item.desc}
                                    </p>
                                    <Link
                                        href="#"
                                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                                    >
                                        Selengkapnya
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
