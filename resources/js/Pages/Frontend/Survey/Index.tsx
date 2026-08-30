import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Navbar from "@/Pages/Frontend/Layouts/Navbar";
import Footer from "@/Pages/Frontend/Layouts/Footer";
import {
    Star,
    Send,
    CheckCircle,
    Mail,
    User,
    MessageSquare,
    ArrowLeft,
    ClipboardList,
} from "lucide-react";

interface SurveyFormData {
    nama: string;
    email: string;
    rating: number;
    saran: string;
}

interface SurveyIndexProps {
    isActive: boolean;
}

export default function SurveyIndex({ isActive }: SurveyIndexProps) {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm<SurveyFormData>({
            nama: "",
            email: "",
            rating: 5,
            saran: "",
        });

    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ✅ PAKAI ROUTE NAME YANG BENAR
        post(route("fe.survey.kepuasan.store"));
    };

    const handleRatingClick = (rating: number) => {
        setData("rating", rating);
    };

    const getRatingLabel = (rating: number): string => {
        const labels: Record<number, string> = {
            1: "Sangat Kurang",
            2: "Kurang",
            3: "Cukup",
            4: "Puas",
            5: "Sangat Puas",
        };
        return labels[rating] || "";
    };

    if (!isActive) {
        return (
            <div className="min-h-screen flex flex-col bg-[#f7f8fa] pt-14">
                <Head title="Survey Kepuasan - PKK Kab. Tasikmalaya" />
                <Navbar />
                <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                            <ClipboardList size={32} className="text-amber-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 mb-2">
                            Survey Sedang Tidak Aktif
                        </h1>
                        <p className="text-slate-500 mb-6">
                            Saat ini survey kepuasan masyarakat sedang tidak aktif.
                            Silakan cek kembali beberapa saat lagi.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f7f8fa] pt-14">
            <Head title="Survey Kepuasan - PKK Kab. Tasikmalaya" />
            <Navbar />

            <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-5">
                        <h1 className="text-xl font-bold text-white">
                            Survey Kepuasan Masyarakat
                        </h1>
                        <p className="text-teal-100 text-sm mt-1">
                            Bantu kami meningkatkan kualitas website PKK Kabupaten Tasikmalaya
                        </p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {recentlySuccessful ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                                    <CheckCircle size={36} className="text-green-500" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Terima Kasih! 🙏
                                </h2>
                                <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                                    Tanggapan Anda sangat berharga untuk kemajuan website
                                    PKK Kabupaten Tasikmalaya.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-block mt-6 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        <span className="flex items-center gap-2">
                                            <User size={16} className="text-slate-400" />
                                            Nama
                                        </span>
                                        <span className="text-slate-400 font-normal text-xs">
                                            (opsional)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nama}
                                        onChange={(e) => setData("nama", e.target.value)}
                                        placeholder="Masukkan nama Anda..."
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all bg-white"
                                    />
                                    {errors.nama && (
                                        <p className="text-rose-500 text-xs mt-1">
                                            {errors.nama}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        <span className="flex items-center gap-2">
                                            <Mail size={16} className="text-slate-400" />
                                            Email
                                        </span>
                                        <span className="text-slate-400 font-normal text-xs">
                                            (opsional)
                                        </span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        placeholder="Masukkan email Anda..."
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all bg-white"
                                    />
                                    {errors.email && (
                                        <p className="text-rose-500 text-xs mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Bagaimana penilaian Anda terhadap website ini?
                                        <span className="text-rose-500 ml-1">*</span>
                                    </label>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleRatingClick(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(null)}
                                                className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star
                                                    size={36}
                                                    className={`
                                                        transition-colors
                                                        ${
                                                            star <= (hoverRating ?? data.rating)
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-slate-300"
                                                        }
                                                    `}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-sm text-slate-500 font-medium min-w-[100px]">
                                            {getRatingLabel(data.rating)}
                                        </span>
                                    </div>
                                    {errors.rating && (
                                        <p className="text-rose-500 text-xs mt-1">
                                            {errors.rating}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                                        <span className="flex items-center gap-2">
                                            <MessageSquare size={16} className="text-slate-400" />
                                            Saran & Kritik
                                        </span>
                                        <span className="text-slate-400 font-normal text-xs">
                                            (opsional)
                                        </span>
                                    </label>
                                    <textarea
                                        value={data.saran}
                                        onChange={(e) => setData("saran", e.target.value)}
                                        rows={4}
                                        placeholder="Tulis saran atau kritik untuk perbaikan website..."
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all resize-none bg-white"
                                    />
                                    {errors.saran && (
                                        <p className="text-rose-500 text-xs mt-1">
                                            {errors.saran}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                    {processing ? "Mengirim..." : "Kirim Survey"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-slate-400">
                    <p>
                        Data Anda akan dijaga kerahasiaannya dan hanya digunakan untuk
                        keperluan evaluasi.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
