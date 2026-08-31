import React, { useState } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import Navbar from "@/Pages/Frontend/Layouts/Navbar";
import Footer from "@/Pages/Frontend/Layouts/Footer";
import { Star, ArrowLeft } from "lucide-react";

interface SurveyFormData {
    nama: string;
    email: string;
    rating: number;
    saran: string;
    website: string; // honeypot
}

interface SurveyIndexProps {
    isActive: boolean;
}

const RATING_LABEL: Record<number, string> = {
    1: "Sangat kurang",
    2: "Kurang",
    3: "Cukup",
    4: "Puas",
    5: "Sangat puas",
};

export default function SurveyIndex({ isActive }: SurveyIndexProps) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm<SurveyFormData>({
            nama: "",
            email: "",
            rating: 5,
            saran: "",
            website: "",
        });

    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("fe.survey.kepuasan.store"));
    };

    if (!isActive) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50 pt-14">
                <Head title="Survey Kepuasan — TP PKK Kab. Tasikmalaya" />
                <Navbar />
                <main className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-8 text-center">
                        <h1 className="text-lg font-semibold text-slate-900 mb-2">
                            Survey sedang tidak dibuka
                        </h1>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Form survey kepuasan sementara tidak aktif. Silakan
                            kembali lagi nanti.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
                        >
                            <ArrowLeft size={16} />
                            Kembali ke beranda
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 pt-14">
            <Head title="Survey Kepuasan — TP PKK Kab. Tasikmalaya" />
            <Navbar />

            <main className="flex-1 max-w-lg mx-auto w-full px-4 py-10 sm:py-14">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
                    >
                        <ArrowLeft size={15} />
                        Beranda
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <p className="text-xs font-semibold tracking-wider uppercase text-teal-700 mb-1">
                            TP PKK Kabupaten Tasikmalaya
                        </p>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Survey kepuasan masyarakat
                        </h1>
                        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                            Penilaian Anda membantu kami meningkatkan layanan
                            informasi dan program PKK.
                        </p>
                    </div>

                    <div className="px-6 py-6">
                        {(recentlySuccessful || flash?.success) && (
                            <div className="text-center py-6">
                                <p className="text-base font-semibold text-slate-900 mb-1">
                                    Terima kasih
                                </p>
                                <p className="text-sm text-slate-500 mb-6">
                                    Tanggapan Anda telah kami terima dan akan
                                    ditinjau oleh admin.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
                                >
                                    Kembali ke beranda
                                </Link>
                            </div>
                        )}

                        {flash?.error && !recentlySuccessful && (
                            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                {flash.error}
                            </div>
                        )}

                        {!recentlySuccessful && !flash?.success && (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Honeypot anti-bot — jangan tampil ke user */}
                                <div
                                    className="absolute opacity-0 h-0 w-0 overflow-hidden"
                                    aria-hidden="true"
                                >
                                    <label htmlFor="website">Website</label>
                                    <input
                                        id="website"
                                        type="text"
                                        name="website"
                                        value={data.website}
                                        onChange={(e) =>
                                            setData("website", e.target.value)
                                        }
                                        autoComplete="off"
                                        tabIndex={-1}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="nama"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Nama{" "}
                                        <span className="text-slate-400 font-normal">
                                            (opsional)
                                        </span>
                                    </label>
                                    <input
                                        id="nama"
                                        type="text"
                                        value={data.nama}
                                        onChange={(e) =>
                                            setData("nama", e.target.value)
                                        }
                                        placeholder="Nama Anda"
                                        maxLength={100}
                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                                    />
                                    {errors.nama && (
                                        <p className="text-xs text-rose-600 mt-1">
                                            {errors.nama}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Email{" "}
                                        <span className="text-slate-400 font-normal">
                                            (opsional)
                                        </span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        placeholder="email@contoh.com"
                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-rose-600 mt-1">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <p className="block text-sm font-medium text-slate-700 mb-2">
                                        Penilaian website{" "}
                                        <span className="text-rose-500">*</span>
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const active =
                                                star <=
                                                (hoverRating ?? data.rating);
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        setData("rating", star)
                                                    }
                                                    onMouseEnter={() =>
                                                        setHoverRating(star)
                                                    }
                                                    onMouseLeave={() =>
                                                        setHoverRating(null)
                                                    }
                                                    className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
                                                    aria-label={`${star} bintang`}
                                                >
                                                    <Star
                                                        size={28}
                                                        className={
                                                            active
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-slate-300"
                                                        }
                                                    />
                                                </button>
                                            );
                                        })}
                                        <span className="ml-2 text-sm text-slate-500">
                                            {RATING_LABEL[data.rating]}
                                        </span>
                                    </div>
                                    {errors.rating && (
                                        <p className="text-xs text-rose-600 mt-1">
                                            {errors.rating}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="saran"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Saran atau kritik{" "}
                                        <span className="text-slate-400 font-normal">
                                            (opsional)
                                        </span>
                                    </label>
                                    <textarea
                                        id="saran"
                                        value={data.saran}
                                        onChange={(e) =>
                                            setData("saran", e.target.value)
                                        }
                                        rows={4}
                                        maxLength={500}
                                        placeholder="Tuliskan masukan Anda singkat dan jelas"
                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 resize-y min-h-[100px]"
                                    />
                                    {errors.saran && (
                                        <p className="text-xs text-rose-600 mt-1">
                                            {errors.saran}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing
                                        ? "Mengirim..."
                                        : "Kirim penilaian"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
                    Data digunakan untuk evaluasi internal TP PKK Kabupaten
                    Tasikmalaya.
                </p>
            </main>

            <Footer />
        </div>
    );
}
