import React, { useEffect, useRef, useState } from "react";
import { Head } from "@inertiajs/react";

import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";

import {
    Users,
    Crown,
    Heart,
    GraduationCap,
    Utensils,
    Stethoscope,
    ArrowRight,
    X,
    User,
    Award,
} from "lucide-react";

// ============================================================
// INTERFACE
// ============================================================

interface PengurusItem {
    id: number;
    nama: string;
    jabatan: string;
    kategori: string;
    pokja: string | null;
    foto: string | null;
    urutan: number;
    is_active: boolean;
    deskripsi: string | null;
    created_at: string;
    updated_at: string;
}

interface StrukturOrganisasiProps {
    ketua: PengurusItem | null;
    pimpinanInti: PengurusItem[];
    pokja: {
        I: PengurusItem[];
        II: PengurusItem[];
        III: PengurusItem[];
        IV: PengurusItem[];
    };
}

// ============================================================
// KONFIGURASI POKJA
// ============================================================

const POKJA_CONFIG = [
    {
        id: "I",
        label: "Pokja I",
        program: "Penghayatan & Pengamalan Pancasila",
        icon: Heart,
    },
    {
        id: "II",
        label: "Pokja II",
        program: "Pendidikan, Keterampilan & Koperasi",
        icon: GraduationCap,
    },
    {
        id: "III",
        label: "Pokja III",
        program: "Pangan, Sandang & Tata Laksana Rumah Tangga",
        icon: Utensils,
    },
    {
        id: "IV",
        label: "Pokja IV",
        program: "Kesehatan, Lingkungan & Perencanaan Sehat",
        icon: Stethoscope,
    },
];

const KETUA_FALLBACK_IMAGE = "/assets/images/ketuapkk.png";

// ============================================================
// CUSTOM STYLE
// ============================================================

const PAGE_STYLE = `
    .struktur-fade-up {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .struktur-fade-up.show {
        opacity: 1;
        transform: translateY(0);
    }
    .struktur-card {
        transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    }
    .struktur-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        border-color: #99f6e4;
    }
    .struktur-button {
        transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
    }
    .struktur-button:hover {
        transform: translateY(-1px);
    }
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    @media (prefers-reduced-motion: reduce) {
        .struktur-fade-up {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
        }
        .struktur-card, .struktur-button {
            transition: none !important;
        }
    }
`;

// ============================================================
// HOOK SCROLL ANIMATION
// ============================================================

const useScrollAnimation = () => {
    const ref = useRef<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function StrukturOrganisasi({
    ketua,
    pimpinanInti = [],
    pokja: pokjaData = { I: [], II: [], III: [], IV: [] },
}: StrukturOrganisasiProps) {
    const [selectedPengurus, setSelectedPengurus] = useState<PengurusItem | null>(null);
    const [selectedPokjaId, setSelectedPokjaId] = useState<string | null>(null);

    const ketuaAnim = useScrollAnimation();
    const strukturAnim = useScrollAnimation();

    // ========================================================
    // ESC KEY
    // ========================================================
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedPengurus(null);
                setSelectedPokjaId(null);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // ========================================================
    // BODY SCROLL LOCK
    // ========================================================
    useEffect(() => {
        const isModalOpen = selectedPengurus !== null || selectedPokjaId !== null;
        if (!isModalOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [selectedPengurus, selectedPokjaId]);

    // ========================================================
    // FOTO URL
    // ========================================================
    const getFotoUrl = (foto: string | null | undefined, isKetua: boolean = false) => {
        if (!foto) return isKetua ? KETUA_FALLBACK_IMAGE : null;
        if (foto.startsWith("http")) return foto;
        if (foto.startsWith("/assets")) return foto;
        if (foto.startsWith("/storage")) return foto;
        return `/storage/${foto}`;
    };

    // ========================================================
    // EMPTY STATE
    // ========================================================
    const isEmpty =
        !ketua &&
        pimpinanInti.length === 0 &&
        Object.values(pokjaData).every((arr) => arr.length === 0);

    // ========================================================
    // AVATAR — BULAT, FOTO COVER
    // ========================================================
    const Avatar = ({
        foto,
        nama,
        size = 56,
        ring = "default",
    }: {
        foto: string | null;
        nama: string;
        size?: number;
        ring?: "default" | "gold" | "teal";
    }) => {
        const ringClass =
            ring === "gold"
                ? "border-slate-300"
                : ring === "teal"
                    ? "border-[#0072BC]"
                    : "border-slate-200";

        return (
            <div
                className={`rounded-full overflow-hidden bg-slate-100 border-2 ${ringClass} flex items-center justify-center shrink-0`}
                style={{ width: size, height: size }}
            >
                {foto ? (
                    <img
                        src={foto}
                        alt={nama}
                        className="w-full h-full object-cover object-top"
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <User size={size * 0.4} className="text-slate-400" />
                )}
            </div>
        );
    };

    // ========================================================
    // MEMBER NODE — KARTU TINGGI SERAGAM
    // ========================================================
    const MemberNode = ({ pengurus }: { pengurus: PengurusItem }) => {
        const fotoUrl = getFotoUrl(pengurus.foto);
        const isSelected = selectedPengurus?.id === pengurus.id;

        return (
            <button
                type="button"
                onClick={() => setSelectedPengurus(isSelected ? null : pengurus)}
                className={`struktur-card w-full h-full min-h-[170px] bg-white rounded-2xl border px-4 py-5 flex flex-col items-center justify-start text-center ${
                    isSelected
                        ? "border-[#0072BC] ring-2 ring-[#0072BC]/20"
                        : "border-slate-200"
                }`}
            >
                <Avatar
                    foto={fotoUrl}
                    nama={pengurus.nama}
                    size={64}
                    ring={isSelected ? "teal" : "default"}
                />
                <p className="text-sm font-semibold text-slate-900 mt-4 leading-snug line-clamp-2 w-full">
                    {pengurus.nama}
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-snug line-clamp-2 w-full">
                    {pengurus.jabatan}
                </p>
            </button>
        );
    };

    // ========================================================
    // POKJA MODAL
    // ========================================================
    const renderPokjaModal = () => {
        if (!selectedPokjaId) return null;

        const allPengurus = pokjaData[selectedPokjaId as keyof typeof pokjaData] || [];
        const pokjaConfig = POKJA_CONFIG.find((item) => item.id === selectedPokjaId);
        const Icon = pokjaConfig?.icon ?? Users;

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                onClick={(event) => {
                    if (event.target === event.currentTarget) setSelectedPokjaId(null);
                }}
            >
                <div className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
                    <div className="sticky top-0 z-10 bg-white px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0072BC]/10 text-[#0072BC] flex items-center justify-center">
                                <Icon size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {pokjaConfig?.label}
                                </h3>
                                <p className="text-xs text-slate-500">{pokjaConfig?.program}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedPokjaId(null)}
                            className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6">
                        {allPengurus.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {allPengurus.map((pengurus) => {
                                    const fotoUrl = getFotoUrl(pengurus.foto);
                                    return (
                                        <button
                                            key={pengurus.id}
                                            type="button"
                                            onClick={() => setSelectedPengurus(pengurus)}
                                            className="struktur-card flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl text-left hover:border-[#0072BC] transition-colors"
                                        >
                                            <Avatar
                                                foto={fotoUrl}
                                                nama={pengurus.nama}
                                                size={48}
                                                ring="teal"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-slate-900 truncate">
                                                    {pengurus.nama}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {pengurus.jabatan}
                                                </p>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-400 shrink-0" />
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users size={36} className="mx-auto mb-3 text-slate-300" />
                                <p className="text-sm text-slate-500">
                                    Belum ada data pengurus untuk Pokja ini.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ========================================================
    // PENGURUS DETAIL MODAL — FOTO 4x4 FULL POTRAIT
    // ========================================================
    const renderPengurusModal = () => {
        if (!selectedPengurus) return null;

        const isKetua = selectedPengurus.kategori === "ketua";
        const fotoUrl = getFotoUrl(selectedPengurus.foto, isKetua);

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                onClick={(event) => {
                    if (event.target === event.currentTarget) setSelectedPengurus(null);
                }}
            >
                <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setSelectedPengurus(null)}
                        className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                        aria-label="Tutup"
                    >
                        <X size={18} />
                    </button>

                    <div className="p-6 pb-0">
                        <div
                            className="relative mx-auto rounded-2xl overflow-hidden border-4 border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-lg"
                            style={{ width: "100%", maxWidth: 280 }}
                        >
                            <div className="relative aspect-[3/4] w-full flex items-end justify-center">
                                {fotoUrl ? (
                                    <img
                                        src={fotoUrl}
                                        alt={selectedPengurus.nama}
                                        className="w-full h-full object-contain object-bottom"
                                        onError={(event) => {
                                            event.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                        <User size={80} className="text-slate-300" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-5 text-center">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                            {selectedPengurus.nama}
                        </h3>
                        <p className="text-sm font-semibold mt-2 text-[#0072BC]">
                            {selectedPengurus.jabatan}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // ========================================================
    // EMPTY STATE
    // ========================================================
    if (isEmpty) {
        return (
            <div className="min-h-screen flex flex-col bg-white font-['Poppins',_sans-serif]">
                <style>{PAGE_STYLE}</style>
                <Head title="Struktur Organisasi - PKK Kabupaten Tasikmalaya" />
                <Navbar />
                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#0072BC]/10 flex items-center justify-center mx-auto mb-5">
                            <Users size={30} className="text-[#0072BC]" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            Belum ada data pengurus
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            Data pengurus akan ditampilkan di sini.
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // ========================================================
    // MAIN RENDER
    // ========================================================
    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-800 font-['Poppins',_sans-serif]">
            <style>{PAGE_STYLE}</style>

            <Head title="Struktur Organisasi - PKK Kabupaten Tasikmalaya">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <Navbar />

            {/* HERO */}
            <section className="relative overflow-hidden bg-slate-50 border-b border-slate-100 pt-24 sm:pt-28 pb-12 sm:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase mb-3">
                            Kepengurusan
                        </p>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
                            Struktur Organisasi
                        </h1>
                        <div className="w-12 h-1 bg-[#0072BC] rounded-full mt-5 mb-5" />
                        <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl">
                            Struktur kepengurusan Tim Penggerak PKK Kabupaten Tasikmalaya yang
                            bersama-sama menjalankan program pemberdayaan dan kesejahteraan
                            keluarga.
                        </p>
                    </div>
                </div>
            </section>

            {/* KETUA — SECTION CLEAN & ELEGAN */}
            {ketua && (
                <section
                    ref={ketuaAnim.ref}
                    className={`py-14 sm:py-20 lg:py-24 bg-white border-b border-slate-100 struktur-fade-up ${
                        ketuaAnim.isVisible ? "show" : ""
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-center">
                            <div className="w-full lg:w-5/12 max-w-sm mx-auto lg:mx-0">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPengurus(ketua)}
                                    className="struktur-button w-full text-left group"
                                >
                                    <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-b from-slate-50 to-white ring-1 ring-slate-200">
                                        <div className="relative aspect-[3/4] w-full flex items-end justify-center p-6">
                                            <img
                                                src={
                                                    getFotoUrl(ketua.foto, true) ||
                                                    KETUA_FALLBACK_IMAGE
                                                }
                                                alt={ketua.nama}
                                                className="w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.03]"
                                                onError={(event) => {
                                                    event.currentTarget.src =
                                                        KETUA_FALLBACK_IMAGE;
                                                }}
                                            />
                                        </div>
                                        <div className="relative px-5 pb-5">
                                            <div className="inline-flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-full shadow-md shadow-slate-200/50">
                                                <Crown size={14} className="shrink-0" />
                                                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                                                    Ketua TP PKK
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <div className="w-full lg:w-7/12">
                                <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase mb-3">
                                    Ketua TP PKK
                                </p>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900 leading-tight mb-6">
                                    Memimpin dengan Semangat <br className="hidden sm:block" />
                                    Pemberdayaan Keluarga
                                </h2>
                                <div className="w-12 h-1 bg-[#0072BC] rounded-full mb-6" />
                                <p className="text-slate-600 text-[15px] sm:text-base leading-relaxed max-w-xl">
                                    {ketua.deskripsi ||
                                        "Pemberdayaan keluarga merupakan pondasi penting dalam membangun masyarakat Kabupaten Tasikmalaya yang sejahtera, mandiri, dan berdaya saing."}
                                </p>
                                <div className="my-8 h-px bg-gradient-to-r from-slate-200 via-slate-200 to-transparent max-w-xl" />
                                <div>
                                    <p className="font-semibold text-slate-900 text-lg">
                                        {ketua.nama}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {ketua.jabatan}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPengurus(ketua)}
                                    className="struktur-button mt-8 inline-flex items-center gap-2 bg-[#0072BC] hover:bg-[#005A94] text-white text-sm font-medium px-6 py-3 rounded-xl shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50"
                                >
                                    Lihat Profil Lengkap
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* STRUKTUR — LAYOUT BARU */}
            <section
                ref={strukturAnim.ref}
                className={`py-12 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100 struktur-fade-up ${
                    strukturAnim.isVisible ? "show" : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase mb-2">
                            Struktur Kepengurusan
                        </p>
                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                            Bagan Organisasi PKK Kabupaten Tasikmalaya
                        </h2>
                        <div className="w-10 h-0.5 bg-[#0072BC] mx-auto mb-4" />
                        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
                            Struktur kepengurusan yang terintegrasi untuk mendukung pelaksanaan
                            program kerja Tim Penggerak PKK Kabupaten Tasikmalaya.
                        </p>
                    </div>

                    {/* Ketua Node — KOTAK ABU SERAGAM */}
                    {ketua && (
                        <div className="flex flex-col items-center">
                            <div className="w-full max-w-[220px]">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPengurus(ketua)}
                                    className="struktur-card w-full bg-white rounded-2xl border border-slate-200 px-4 py-5 flex flex-col items-center justify-start text-center min-h-[170px]"
                                >
                                    <Avatar
                                        foto={getFotoUrl(ketua.foto, true)}
                                        nama={ketua.nama}
                                        size={64}
                                        ring="default"
                                    />
                                    <p className="text-sm font-semibold text-slate-900 mt-4 leading-snug line-clamp-2 w-full">
                                        {ketua.nama}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 leading-snug line-clamp-2 w-full">
                                        Ketua TP PKK
                                    </p>
                                </button>
                            </div>
                            <div className="w-px h-10 bg-slate-300" />
                        </div>
                    )}

                    {/* Pimpinan Inti — GRID */}
                    {pimpinanInti.length > 0 && (
                        <div className="relative">
                            {pimpinanInti.length > 1 && (
                                <div className="hidden lg:block absolute top-0 left-0 right-0 h-px">
                                    <div
                                        className="absolute top-0 h-px bg-slate-300"
                                        style={{
                                            left: `${100 / pimpinanInti.length / 2}%`,
                                            right: `${100 / pimpinanInti.length / 2}%`,
                                        }}
                                    />
                                </div>
                            )}

                            <div
                                className="grid gap-4 sm:gap-5"
                                style={{
                                    gridTemplateColumns: `repeat(${Math.min(
                                        pimpinanInti.length,
                                        5
                                    )}, minmax(0, 1fr))`,
                                }}
                            >
                                {pimpinanInti.map((pengurus) => (
                                    <div key={pengurus.id} className="relative pt-8">
                                        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-300" />
                                        <MemberNode pengurus={pengurus} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Garis vertikal ke Pokja */}
                    <div className="flex justify-center mt-2">
                        <div className="w-px h-10 bg-slate-300" />
                    </div>

                    {/* Label Pokja */}
                    <div className="text-center mb-8">
                        <p className="text-sm font-medium text-slate-600">Kelompok Kerja PKK</p>
                        <p className="text-xs text-slate-400 mt-1">
                            Pilih salah satu Pokja untuk melihat pengurus lengkap
                        </p>
                    </div>

                    {/* Pokja — GRID */}
                    <div className="relative">
                        <div className="hidden lg:block absolute top-0 left-0 right-0 h-px">
                            <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-slate-300" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                            {POKJA_CONFIG.map((config) => {
                                const Icon = config.icon;
                                const count =
                                    pokjaData[config.id as keyof typeof pokjaData]?.length || 0;

                                return (
                                    <div key={config.id} className="relative lg:pt-8">
                                        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-300" />
                                        <button
                                            type="button"
                                            onClick={() => setSelectedPokjaId(config.id)}
                                            className="struktur-card w-full h-full bg-white rounded-2xl border border-slate-200 p-6 text-left group"
                                        >
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="w-11 h-11 rounded-xl bg-[#0072BC]/10 group-hover:bg-[#0072BC] flex items-center justify-center transition-colors">
                                                    <Icon
                                                        size={20}
                                                        className="text-[#0072BC] group-hover:text-white transition-colors"
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {count} pengurus
                                                </span>
                                            </div>
                                            <p className="text-base font-semibold text-slate-900 mb-2">
                                                {config.label}
                                            </p>
                                            <p className="text-sm leading-relaxed text-slate-500 line-clamp-2">
                                                {config.program}
                                            </p>
                                            <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#0072BC]">
                                                Lihat Pengurus
                                                <ArrowRight size={15} />
                                            </div>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* MODAL POKJA */}
            {renderPokjaModal()}

            {/* MODAL PENGURUS */}
            {renderPengurusModal()}

            <Footer />
        </div>
    );
}
