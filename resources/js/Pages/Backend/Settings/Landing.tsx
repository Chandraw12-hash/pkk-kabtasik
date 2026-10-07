import React, { FormEventHandler, useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Card from "@/Components/UI/Card";
import { Head, useForm, router } from "@inertiajs/react";
import {
    LayoutTemplate,
    Save,
    Image as ImageIcon,
    Trash2,
    Eye,
    MessageSquare,
    Phone,
    Share2,
    AlertCircle,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

interface LandingProps {
    settings: Record<string, string>;
}

export default function Landing({ settings }: LandingProps) {
    const [activeTab, setActiveTab] = useState<"hero" | "sambutan" | "kontak">("hero");

    // Preview state untuk foto yang baru dipilih
    const [slide1Preview, setSlide1Preview] = useState<string | null>(
        settings.hero_slide_1 ? `/storage/${settings.hero_slide_1}` : null
    );
    const [slide2Preview, setSlide2Preview] = useState<string | null>(
        settings.hero_slide_2 ? `/storage/${settings.hero_slide_2}` : null
    );
    const [slide3Preview, setSlide3Preview] = useState<string | null>(
        settings.hero_slide_3 ? `/storage/${settings.hero_slide_3}` : null
    );
    const [sambutanFotoPreview, setSambutanFotoPreview] = useState<string | null>(
        settings.sambutan_foto ? `/storage/${settings.sambutan_foto}` : null
    );

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<{
        hero_tagline: string;
        hero_title: string;
        hero_subtitle: string;
        hero_cta_text_1: string;
        hero_cta_link_1: string;
        hero_cta_text_2: string;
        hero_cta_link_2: string;
        hero_slide_1: File | null;
        hero_slide_2: File | null;
        hero_slide_3: File | null;
        sambutan_tag: string;
        sambutan_title: string;
        sambutan_nama_ketua: string;
        sambutan_jabatan: string;
        sambutan_isi: string;
        sambutan_foto: File | null;
        kontak_alamat: string;
        kontak_telepon: string;
        kontak_email: string;
        kontak_facebook: string;
        kontak_instagram: string;
        kontak_youtube: string;
        kontak_twitter: string;
    }>({
        hero_tagline: settings.hero_tagline || "Tim Penggerak PKK Kabupaten Tasikmalaya",
        hero_title: settings.hero_title || "Membangun Keluarga\nSejahtera & Mandiri\nbersama TP PKK",
        hero_subtitle: settings.hero_subtitle || "Media informasi resmi Tim Penggerak PKK Kabupaten Tasikmalaya dalam mewujudkan pemberdayaan dan kesejahteraan keluarga.",
        hero_cta_text_1: settings.hero_cta_text_1 || "Lihat Profil PKK",
        hero_cta_link_1: settings.hero_cta_link_1 || "/profil/sejarah",
        hero_cta_text_2: settings.hero_cta_text_2 || "Lihat Data PKK",
        hero_cta_link_2: settings.hero_cta_link_2 || "#data",
        hero_slide_1: null,
        hero_slide_2: null,
        hero_slide_3: null,
        sambutan_tag: settings.sambutan_tag || "Sambutan",
        sambutan_title: settings.sambutan_title || "Sambutan Ketua TP PKK Kabupaten Tasikmalaya",
        sambutan_nama_ketua: settings.sambutan_nama_ketua || "Hj. Retno Widyastuti, S.E",
        sambutan_jabatan: settings.sambutan_jabatan || "Ketua TP PKK Kabupaten Tasikmalaya",
        sambutan_isi: settings.sambutan_isi || "Assalaamu'alaikum wa rahmatullah wa barakaatuh, Sampurasun,\n\nPuji syukur kepada Allah SWT, website resmi Tim Penggerak PKK Kabupaten Tasikmalaya ini hadir sebagai sarana informasi, komunikasi, dan transparansi kegiatan PKK kepada masyarakat.\n\nMelalui media digital ini, kami berharap program-program PKK dapat diakses dengan mudah serta memberikan manfaat nyata bagi pembinaan kesejahteraan keluarga di Kabupaten Tasikmalaya.\n\nDukungan dan kerja sama dari seluruh pengurus, kader, dan instansi pemerintah sangat kami harapkan untuk menyukseskan setiap program PKK.\n\nSemoga website ini bermanfaat dan meningkatkan kualitas informasi publik di Kabupaten Tasikmalaya. Terima kasih.\n\nWassalamu'alaikum warahmatullahi wa barakatuh.",
        sambutan_foto: null,
        kontak_alamat: settings.kontak_alamat || "Jl. Raya Singaparna, Kabupaten Tasikmalaya, Jawa Barat",
        kontak_telepon: settings.kontak_telepon || "(0265) 123456",
        kontak_email: settings.kontak_email || "pkk@tasikmalayakab.go.id",
        kontak_facebook: settings.kontak_facebook || "",
        kontak_instagram: settings.kontak_instagram || "",
        kontak_youtube: settings.kontak_youtube || "",
        kontak_twitter: settings.kontak_twitter || "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("be.settings.landing.update"), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const handleRemoveImage = (key: string) => {
        if (!confirm("Yakin ingin menghapus foto ini dan mengembalikan ke foto default?")) return;
        router.delete(route("be.settings.landing.remove-image"), {
            data: { key },
            preserveScroll: true,
            onSuccess: () => {
                if (key === "hero_slide_1") setSlide1Preview(null);
                if (key === "hero_slide_2") setSlide2Preview(null);
                if (key === "hero_slide_3") setSlide3Preview(null);
                if (key === "sambutan_foto") setSambutanFotoPreview(null);
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Kelola Konten & Tampilan Website" />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                            <LayoutTemplate size={24} />
                        </span>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Kelola Tampilan Landing Page
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Ubah foto hero banner, sambutan ketua, teks, dan informasi publik website secara langsung
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                        <Eye size={16} />
                        Lihat Landing Page
                    </a>
                </div>
            </div>

            {/* Notification */}
            {recentlySuccessful && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm">
                    <CheckCircle2 size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Perubahan konten landing page berhasil disimpan dan langsung tayang di portal publik!</span>
                </div>
            )}

            {/* Tab navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-6 pb-2">
                <button
                    type="button"
                    onClick={() => setActiveTab("hero")}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                        activeTab === "hero"
                            ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                    <Sparkles size={16} />
                    Hero Banner & Slider Foto
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("sambutan")}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                        activeTab === "sambutan"
                            ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                    <MessageSquare size={16} />
                    Foto & Sambutan Ketua
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("kontak")}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                        activeTab === "kontak"
                            ? "bg-teal-600 text-white shadow-md shadow-teal-500/20"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                    <Phone size={16} />
                    Kontak & Footer
                </button>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* ============================================================
                    TAB 1: HERO BANNER & SLIDES
                ============================================================ */}
                {activeTab === "hero" && (
                    <div className="space-y-6">
                        {/* 3 Slide Foto Hero */}
                        <Card className="p-6">
                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-2">
                                <ImageIcon size={18} className="text-teal-600 dark:text-teal-400" />
                                Foto Background Hero Banner (Slider 3 Foto)
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                Upload foto baru untuk mengganti gambar hero yang tampil bergantian di beranda utama. Rekomendasi resolusi: 1920x1080 px (Format JPG, PNG, WebP max 5MB).
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Slide 1 */}
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                            Foto Slide 1
                                        </span>
                                        {slide1Preview && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage("hero_slide_1")}
                                                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium"
                                                title="Reset ke gambar default"
                                            >
                                                <Trash2 size={13} />
                                                Reset
                                            </button>
                                        )}
                                    </div>

                                    <div className="aspect-video w-full rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative border border-slate-300 dark:border-slate-700">
                                        <img
                                            src={slide1Preview || "/assets/images/hero.jpg"}
                                            alt="Preview Slide 1"
                                            className="w-full h-full object-cover"
                                        />
                                        {!slide1Preview && (
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/70 text-white">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                            Ganti Foto Slide 1:
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData("hero_slide_1", file);
                                                    setSlide1Preview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-slate-800 dark:file:text-slate-300"
                                        />
                                        {errors.hero_slide_1 && (
                                            <p className="text-xs text-rose-500 mt-1">{errors.hero_slide_1}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Slide 2 */}
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                            Foto Slide 2
                                        </span>
                                        {slide2Preview && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage("hero_slide_2")}
                                                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium"
                                                title="Reset ke gambar default"
                                            >
                                                <Trash2 size={13} />
                                                Reset
                                            </button>
                                        )}
                                    </div>

                                    <div className="aspect-video w-full rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative border border-slate-300 dark:border-slate-700">
                                        <img
                                            src={slide2Preview || "/assets/images/hero2.jpg"}
                                            alt="Preview Slide 2"
                                            className="w-full h-full object-cover"
                                        />
                                        {!slide2Preview && (
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/70 text-white">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                            Ganti Foto Slide 2:
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData("hero_slide_2", file);
                                                    setSlide2Preview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-slate-800 dark:file:text-slate-300"
                                        />
                                        {errors.hero_slide_2 && (
                                            <p className="text-xs text-rose-500 mt-1">{errors.hero_slide_2}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Slide 3 */}
                                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                                            Foto Slide 3
                                        </span>
                                        {slide3Preview && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage("hero_slide_3")}
                                                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium"
                                                title="Reset ke gambar default"
                                            >
                                                <Trash2 size={13} />
                                                Reset
                                            </button>
                                        )}
                                    </div>

                                    <div className="aspect-video w-full rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden relative border border-slate-300 dark:border-slate-700">
                                        <img
                                            src={slide3Preview || "/assets/images/hero3.jpg"}
                                            alt="Preview Slide 3"
                                            className="w-full h-full object-cover"
                                        />
                                        {!slide3Preview && (
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/70 text-white">
                                                Default
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                            Ganti Foto Slide 3:
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setData("hero_slide_3", file);
                                                    setSlide3Preview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-slate-800 dark:file:text-slate-300"
                                        />
                                        {errors.hero_slide_3 && (
                                            <p className="text-xs text-rose-500 mt-1">{errors.hero_slide_3}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Teks Hero Banner */}
                        <Card className="p-6 space-y-5">
                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                                Teks & Tombol Hero Banner
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Sub-judul / Tagline Atas
                                </label>
                                <TextInput
                                    type="text"
                                    value={data.hero_tagline}
                                    onChange={(e) => setData("hero_tagline", e.target.value)}
                                    className="w-full py-2"
                                    placeholder="Contoh: Tim Penggerak PKK Kabupaten Tasikmalaya"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Judul Utama Hero (Mendukung baris baru / Enter)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.hero_title}
                                    onChange={(e) => setData("hero_title", e.target.value)}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 text-sm focus:border-teal-500 focus:ring-teal-500"
                                    placeholder="Judul utama di atas background banner..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Deskripsi Singkat Hero
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.hero_subtitle}
                                    onChange={(e) => setData("hero_subtitle", e.target.value)}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 text-sm focus:border-teal-500 focus:ring-teal-500"
                                    placeholder="Penjelasan ringkas di bawah judul..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Teks Tombol 1 (Biru)
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.hero_cta_text_1}
                                        onChange={(e) => setData("hero_cta_text_1", e.target.value)}
                                        className="w-full py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Link Tombol 1
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.hero_cta_link_1}
                                        onChange={(e) => setData("hero_cta_link_1", e.target.value)}
                                        className="w-full py-2"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Teks Tombol 2 (Outline)
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.hero_cta_text_2}
                                        onChange={(e) => setData("hero_cta_text_2", e.target.value)}
                                        className="w-full py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Link Tombol 2
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.hero_cta_link_2}
                                        onChange={(e) => setData("hero_cta_link_2", e.target.value)}
                                        className="w-full py-2"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* ============================================================
                    TAB 2: SAMBUTAN KETUA
                ============================================================ */}
                {activeTab === "sambutan" && (
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="text-teal-600 dark:text-teal-400" size={20} />
                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                                Foto & Isi Sambutan Ketua TP PKK
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Kolom Foto Ketua */}
                            <div className="lg:col-span-4 space-y-3">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Foto Ketua TP PKK
                                </label>
                                <div className="w-full max-w-[280px] mx-auto aspect-[3/4] rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-center">
                                    <img
                                        src={sambutanFotoPreview || "/assets/images/ketuapkk.jpg"}
                                        alt="Foto Ketua"
                                        className="w-full h-full object-cover"
                                    />
                                    {sambutanFotoPreview && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage("sambutan_foto")}
                                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 transition-colors shadow"
                                            title="Hapus foto & kembalikan ke default"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Upload Foto Baru:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setData("sambutan_foto", file);
                                                setSambutanFotoPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-slate-800 dark:file:text-slate-300"
                                    />
                                    {errors.sambutan_foto && (
                                        <p className="text-xs text-rose-500 mt-1">{errors.sambutan_foto}</p>
                                    )}
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Format: JPG, PNG, WebP (maks 5MB). Rasio foto potret 3:4 atau tegak.
                                    </p>
                                </div>
                            </div>

                            {/* Kolom Teks Sambutan */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Nama Lengkap & Gelar Ketua
                                        </label>
                                        <TextInput
                                            type="text"
                                            value={data.sambutan_nama_ketua}
                                            onChange={(e) => setData("sambutan_nama_ketua", e.target.value)}
                                            className="w-full py-2"
                                            placeholder="Contoh: Hj. Retno Widyastuti, S.E"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Jabatan
                                        </label>
                                        <TextInput
                                            type="text"
                                            value={data.sambutan_jabatan}
                                            onChange={(e) => setData("sambutan_jabatan", e.target.value)}
                                            className="w-full py-2"
                                            placeholder="Contoh: Ketua TP PKK Kabupaten Tasikmalaya"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Label / Kategori Atas
                                        </label>
                                        <TextInput
                                            type="text"
                                            value={data.sambutan_tag}
                                            onChange={(e) => setData("sambutan_tag", e.target.value)}
                                            className="w-full py-2"
                                            placeholder="Sambutan"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Judul Sambutan
                                        </label>
                                        <TextInput
                                            type="text"
                                            value={data.sambutan_title}
                                            onChange={(e) => setData("sambutan_title", e.target.value)}
                                            className="w-full py-2"
                                            placeholder="Sambutan Ketua TP PKK Kabupaten Tasikmalaya"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Naskah Sambutan Lengkap
                                    </label>
                                    <textarea
                                        rows={10}
                                        value={data.sambutan_isi}
                                        onChange={(e) => setData("sambutan_isi", e.target.value)}
                                        className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 text-sm focus:border-teal-500 focus:ring-teal-500 font-sans leading-relaxed"
                                        placeholder="Tuliskan naskah sambutan lengkap. Pisahkan antar paragraf dengan dua kali Enter..."
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Tips: Gunakan 2 kali Enter (garis kosong) untuk memisahkan setiap paragraf.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* ============================================================
                    TAB 3: KONTAK & FOOTER
                ============================================================ */}
                {activeTab === "kontak" && (
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Phone className="text-teal-600 dark:text-teal-400" size={20} />
                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                                Informasi Kontak & Tautan Media Sosial
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Alamat Kantor TP PKK
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.kontak_alamat}
                                    onChange={(e) => setData("kontak_alamat", e.target.value)}
                                    className="w-full rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-3 text-sm focus:border-teal-500 focus:ring-teal-500"
                                    placeholder="Alamat kantor..."
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nomor Telepon
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.kontak_telepon}
                                        onChange={(e) => setData("kontak_telepon", e.target.value)}
                                        className="w-full py-2"
                                        placeholder="(0265) 123456"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Email Resmi
                                    </label>
                                    <TextInput
                                        type="email"
                                        value={data.kontak_email}
                                        onChange={(e) => setData("kontak_email", e.target.value)}
                                        className="w-full py-2"
                                        placeholder="pkk@tasikmalayakab.go.id"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                <Share2 size={16} className="text-teal-600 dark:text-teal-400" />
                                Tautan Akun Media Sosial
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Facebook (URL)
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.kontak_facebook}
                                        onChange={(e) => setData("kontak_facebook", e.target.value)}
                                        className="w-full py-2 text-xs"
                                        placeholder="https://facebook.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Instagram (URL)
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.kontak_instagram}
                                        onChange={(e) => setData("kontak_instagram", e.target.value)}
                                        className="w-full py-2 text-xs"
                                        placeholder="https://instagram.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        YouTube (URL)
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.kontak_youtube}
                                        onChange={(e) => setData("kontak_youtube", e.target.value)}
                                        className="w-full py-2 text-xs"
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                        Twitter / X (URL)
                                    </label>
                                    <TextInput
                                        type="text"
                                        value={data.kontak_twitter}
                                        onChange={(e) => setData("kontak_twitter", e.target.value)}
                                        className="w-full py-2 text-xs"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Tombol Simpan Global */}
                <div className="sticky bottom-4 z-20 flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={processing}
                        className="shadow-xl shadow-teal-500/25 px-6 py-3 flex items-center gap-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    >
                        <Save size={18} />
                        <span>{processing ? "Menyimpan Perubahan..." : "Simpan Semua Perubahan Tampilan"}</span>
                    </Button>
                </div>
            </form>
        </MainLayout>
    );
}
