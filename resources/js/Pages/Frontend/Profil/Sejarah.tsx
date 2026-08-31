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
                                Sejarah Singkat Gerakan PKK
                            </h2>

                            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                                <p>
                                    PKK yang merupakan gerakan pembangunan masyarakat bermula dari Seminar <em>Home Economic</em> di Bogor pada tahun 1957, yang menghasilkan rumusan 10 Segi Kehidupan Keluarga.
                                </p>
                                <p>
                                    Kemudian ditindak lanjuti oleh Kementrian Pendidikan, Pengajaran dan Kebudayaan pada tahun 1961 yang menetapkan 10 Segi Kehidupan Keluarga sebagai Kurikulum Pendidikan Kesejahteraan Keluarga yang diajarkan di sekolah-sekolah oleh Pendidikan Masyarakat (PENMAS).
                                </p>
                                <p>
                                    Pada bulan Mei tahun 1962 di Desa Salaman Kabupaten Magelang, Provinsi Jawa Tengah, didirikan Pusat Latihan Pendidikan Masyarakat (PLPM) untuk menyebarluaskan 10 Segi Kehidupan Keluarga.
                                </p>
                                <p>
                                    Sekitar tahun 1967 kehidupan sebagian masyarakat Jawa Tengah sangat menyedihkan, khususnya di daerah Dieng Kabupaten Wonosobo diantara mereka banyak yang menderita <em>Honger Odeem</em> (HO). Kenyataan ini menyentuh hati Ibu Isriati Moenadi, sebagai Isteri Gubernur Jawa Tengah saat itu. Beliau merasa bertanggung jawab terhadap kesejahteraan masyarakatnya dan berinisiatif membentuk PKK di Jawa Tengah, dari tingkat Provinsi sampai ketingkat Desa dan Kelurahan, dengan susunan pengurus terdiri dari unsur-unsur Isteri Pimpinan Daerah, Tokoh-tokoh masyarakat, perempuan dan laki-laki untuk melaksanakan 10 Pokok PKK secara intensif.
                                </p>
                                <p>
                                    Dari keberhasilan PKK di Jawa Tengah, maka Presiden RI menganjurkan kepada Menteri Dalam Negeri agar PKK dilaksanakan di daerah-daerah seluruh Indonesia.
                                </p>
                                <p>
                                    Pada tanggal 27 Desember 1972 Menteri Dalam Negeri mengirimkan Surat Kawat Nomor SUS 3/6/12 tanggal 27 Desember 1972 kepada Gubernur Jawa Tengah untuk merubah nama Pendidikan Kesejahteraan Keluarga menjadi Pembinaan Kesejahteraan Keluarga, tembusan disampaikan kepada Gubernur seluruh Indonesia.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <Footer />
        </div>
    );
}
