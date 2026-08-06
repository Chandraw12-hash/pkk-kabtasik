import React, { useEffect, useRef, useState } from "react";
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
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900 pt-14">

            <Head title="Sejarah PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ── HERO ── */}
            <section
                className="relative min-h-[420px] lg:min-h-[480px] flex items-center overflow-hidden"
                data-aos="fade-up"
            >
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src="/assets/images/hero.jpg"
                        alt="Sejarah PKK Kabupaten Tasikmalaya"
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                            e.currentTarget.src =
                                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B2A3B]/92 via-[#0B2A3B]/75 to-[#0B2A3B]/45"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 text-[#38BDF8] text-xs font-bold tracking-widest uppercase mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span>
                            <span>Jelajahi Sejarah PKK</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                            Sejarah PKK
                        </h1>
                        <p className="text-gray-200 text-base mb-8 leading-relaxed max-w-md">
                            Menelusuri perjalanan panjang gerakan Pemberdayaan
                            Kesejahteraan Keluarga dalam membangun dan memperkuat
                            sendi-sendi kehidupan bangsa.
                        </p>
                        <Link
                            href="#sejarah-konten"
                            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#0F172A] font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
                        >
                            Explore History <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── KONTEN SEJARAH ── */}
            <section
                id="sejarah-konten"
                className="py-16 md:py-20 bg-white"
                data-aos="fade-up"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Kiri: Gambar */}
                        <div className="w-full lg:w-5/12">
                            <div className="rounded-xl overflow-hidden border border-gray-200">
                                <img
                                    src="/assets/images/hero.jpg"
                                    alt="Kegiatan PKK Tasikmalaya"
                                    className="w-full h-80 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                                <div className="px-5 py-4 border-t border-gray-200">
                                    <p className="text-[#0F172A] font-semibold text-sm">
                                        PKK Kabupaten Tasikmalaya
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Pemberdayaan &amp; Kesejahteraan Keluarga
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kanan: Teks Sejarah */}
                        <div className="w-full lg:w-7/12">
                            <p className="text-[#1DA599] font-semibold text-xs uppercase tracking-widest mb-2">
                                Jejak Langkah Sejarah Nasional
                            </p>
                            <h2 className="text-3xl font-bold text-[#0F172A] mb-5">
                                Sejarah Singkat PKK
                            </h2>

                            <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
                                <p>
                                    Gerakan Pemberdayaan dan Kesejahteraan Keluarga (PKK)
                                    merupakan gerakan nasional yang tumbuh dan berkembang
                                    dari bawah, dikelola oleh masyarakat dengan perempuan
                                    sebagai penggerak untuk membangun keluarga yang
                                    berakhlak mulia, sehat, sejahtera, maju, dan mandiri.
                                </p>
                                <p>
                                    Sejarah PKK dimulai pada tahun 1960-an sebagai
                                    inisiatif pemberdayaan masyarakat dalam meningkatkan
                                    kualitas hidup keluarga di bidang pendidikan, kesehatan,
                                    ekonomi, dan sosial budaya.
                                </p>
                            </div>

                            {/* Quote sederhana */}
                            <div className="my-6 border-l-4 border-[#1DA599] bg-gray-50 rounded-r-lg px-5 py-4">
                                <p className="text-[#0F172A] font-medium italic leading-relaxed">
                                    "Keluarga adalah unit terkecil yang menentukan masa
                                    depan bangsa."
                                </p>
                            </div>

                            <div className="space-y-4 text-gray-600 text-[15px] leading-relaxed">
                                <p>
                                    Seiring perkembangan zaman, PKK terus menjadi mitra
                                    strategis pemerintah dalam implementasi 10 Program Pokok
                                    PKK yang bertujuan meningkatkan kesejahteraan masyarakat
                                    dan memperkuat ketahanan keluarga secara menyeluruh.
                                </p>
                                <p>
                                    Di Kabupaten Tasikmalaya, PKK hadir sebagai bagian dari
                                    sistem pemberdayaan masyarakat, serta menjangkau seluruh
                                    lapisan masyarakat dari tingkat kabupaten hingga desa,
                                    untuk mewujudkan Kabupaten Tasikmalaya yang sejahtera,
                                    maju, dan berkeadilan bagi seluruh masyarakatnya.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── INOVASI KABUPATEN TASIKMALAYA ── */}
            <section
                className="py-20 bg-gray-50 border-t border-gray-100"
                data-aos="fade-up"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                        <div>
                            <p className="text-[#1DA599] font-semibold text-xs uppercase tracking-widest mb-2">
                                Program Unggulan
                            </p>
                            <h2 className="text-3xl font-bold text-[#0F172A]">
                                Inovasi Kabupaten Tasikmalaya
                            </h2>
                            <p className="text-gray-500 text-sm mt-2 max-w-lg leading-relaxed">
                                Berbagai inovasi yang menjadi bagian dari sejarah dan
                                langkah nyata untuk kemajuan Tasikmalaya.
                            </p>
                        </div>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 border border-[#1DA599] text-[#1DA599] hover:bg-[#1DA599] hover:text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
                        >
                            Lihat Program PKK <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Penanganan Stunting",
                                desc: "Program prioritas intervensi gizi keluarga untuk menurunkan angka stunting di Kabupaten Tasikmalaya.",
                                icon: Shield,
                                img: "/assets/images/hero.jpg",
                                badge: "Pokja IV",
                            },
                            {
                                title: "Pemberdayaan Ekonomi",
                                desc: "Pelatihan usaha, koperasi, dan pemberdayaan ekonomi keluarga melalui berbagai program PKK.",
                                icon: TrendingUp,
                                img: "https://images.unsplash.com/photo-1556910103-1c02745a872e?auto=format&fit=crop&w=600&q=80",
                                badge: "Pokja II",
                            },
                            {
                                title: "Ketahanan Pangan",
                                desc: "Inovasi lahan pangan keluarga dan program ketahanan pangan rumah tangga untuk Tasikmalaya.",
                                icon: Sprout,
                                img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
                                badge: "Pokja III",
                            },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="rounded-xl overflow-hidden border border-gray-200 hover:border-[#1DA599]/40 transition-colors flex flex-col bg-white"
                            >
                                <div className="relative h-44">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=600&q=80";
                                        }}
                                    />
                                    <span className="absolute top-3 left-3 bg-white/95 text-[#0F172A] text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded">
                                        {item.badge}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <item.icon size={16} className="text-[#1DA599]" />
                                        <h3 className="text-base font-semibold text-[#0F172A]">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed flex-grow">
                                        {item.desc}
                                    </p>
                                    <Link
                                        href="#"
                                        className="mt-4 inline-flex items-center text-[#1DA599] text-xs font-semibold hover:underline gap-1"
                                    >
                                        Selengkapnya <ArrowRight size={14} />
                                    </Link>
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