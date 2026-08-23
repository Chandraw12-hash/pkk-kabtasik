import React from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Frontend/Layouts/Navbar";
import Footer from "../Frontend/Layouts/Footer";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-800 pt-14">
            <Head title="Halaman Tidak Ditemukan — TP PKK Kab. Tasikmalaya" />
            <Navbar />

            <main className="flex-grow flex items-center justify-center px-4 py-16">
                <div className="max-w-lg w-full text-center">
                    <p className="text-7xl sm:text-8xl font-bold text-teal-700/15 leading-none select-none mb-2">
                        404
                    </p>
                    <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-3">
                        Halaman tidak ditemukan
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-8">
                        Maaf, alamat yang Anda buka tidak tersedia, sudah
                        dipindahkan, atau belum dipublikasikan.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
                        >
                            <Home size={16} />
                            Kembali ke Beranda
                        </Link>
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
                        >
                            <Search size={16} />
                            Lihat Berita
                        </Link>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="mt-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-700 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Kembali ke halaman sebelumnya
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
