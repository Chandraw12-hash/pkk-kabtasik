import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    ChevronLeft,
    ChevronRight,
    User,
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
        transition:
            opacity 0.7s ease,
            transform 0.7s ease;
    }

    .struktur-fade-up.show {
        opacity: 1;
        transform: translateY(0);
    }

    .struktur-card {
        transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease;
    }

    .struktur-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
        border-color: #99f6e4;
    }

    .struktur-button {
        transition:
            transform 0.2s ease,
            background-color 0.2s ease,
            color 0.2s ease;
    }

    .struktur-button:hover {
        transform: translateY(-1px);
    }

    @media (prefers-reduced-motion: reduce) {
        .struktur-fade-up {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
        }

        .struktur-card,
        .struktur-button {
            transition: none !important;
        }
    }
`;

// ============================================================
// HOOK ANIMATION
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
            {
                threshold: 0.1,
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return {
        ref,
        isVisible,
    };
};

// ============================================================
// CAROUSEL HOOK
// ============================================================

const useCarousel = (items: PengurusItem[], interval: number = 4500) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex((current) => {
            if (items.length === 0) return 0;
            return Math.min(current, items.length - 1);
        });
    }, [items.length]);

    const next = useCallback(() => {
        if (items.length > 0) {
            setIndex((current) => (current + 1) % items.length);
        }
    }, [items.length]);

    const prev = useCallback(() => {
        if (items.length > 0) {
            setIndex((current) => (current - 1 + items.length) % items.length);
        }
    }, [items.length]);

    const goTo = useCallback((targetIndex: number) => {
        if (targetIndex >= 0 && targetIndex < items.length) {
            setIndex(targetIndex);
        }
    }, [items.length]);

    useEffect(() => {
        if (items.length <= 1) return;

        const timer = setInterval(next, interval);

        return () => clearInterval(timer);
    }, [items.length, interval, next]);

    return {
        index,
        next,
        prev,
        goTo,
    };
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function StrukturOrganisasi({
    ketua,
    pimpinanInti = [],
    pokja: pokjaData = {
        I: [],
        II: [],
        III: [],
        IV: [],
    },
}: StrukturOrganisasiProps) {
    const [selectedPengurus, setSelectedPengurus] =
        useState<PengurusItem | null>(null);

    const [selectedPokjaId, setSelectedPokjaId] =
        useState<string | null>(null);

    const ketuaAnim = useScrollAnimation();
    const strukturAnim = useScrollAnimation();

    const carousel1 = useCarousel(
        useMemo(() => pokjaData.I || [], [pokjaData.I])
    );

    const carousel2 = useCarousel(
        useMemo(() => pokjaData.II || [], [pokjaData.II])
    );

    const carousel3 = useCarousel(
        useMemo(() => pokjaData.III || [], [pokjaData.III])
    );

    const carousel4 = useCarousel(
        useMemo(() => pokjaData.IV || [], [pokjaData.IV])
    );

    // ========================================================
    // DRAG / SWIPE STATE UNTUK CAROUSEL POKJA
    // ========================================================

    const dragStartXRef = useRef<number | null>(null);
    const dragPointerIdRef = useRef<number | null>(null);
    const [dragOffsetX, setDragOffsetX] = useState(0);
    const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);

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

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    // ========================================================
    // BODY SCROLL
    // ========================================================

    useEffect(() => {
        const isModalOpen =
            selectedPengurus !== null ||
            selectedPokjaId !== null;

        if (!isModalOpen) return;

        const originalOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow =
                originalOverflow;
        };
    }, [selectedPengurus, selectedPokjaId]);

    // ========================================================
    // FOTO URL
    // ========================================================

    const getFotoUrl = (
        foto: string | null | undefined,
        isKetua: boolean = false
    ) => {
        if (!foto) {
            return isKetua
                ? KETUA_FALLBACK_IMAGE
                : null;
        }

        if (foto.startsWith("http")) {
            return foto;
        }

        if (foto.startsWith("/assets")) {
            return foto;
        }

        if (foto.startsWith("/storage")) {
            return foto;
        }

        return `/storage/${foto}`;
    };

    // ========================================================
    // EMPTY STATE
    // ========================================================

    const isEmpty =
        !ketua &&
        pimpinanInti.length === 0 &&
        Object.values(pokjaData).every(
            (arr) => arr.length === 0
        );

    // ========================================================
    // GET CAROUSEL
    // ========================================================

    const getActiveCarousel = () => {
        switch (selectedPokjaId) {
            case "I":
                return carousel1;

            case "II":
                return carousel2;

            case "III":
                return carousel3;

            case "IV":
                return carousel4;

            default:
                return null;
        }
    };

    // ========================================================
    // AVATAR
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
                ? "border-yellow-400"
                : ring === "teal"
                  ? "border-teal-500"
                  : "border-slate-200";

        return (
            <div
                className={`rounded-full overflow-hidden bg-teal-50 border-2 ${ringClass} flex items-center justify-center shrink-0`}
                style={{
                    width: size,
                    height: size,
                }}
            >
                {foto ? (
                    <img
                        src={foto}
                        alt={nama}
                        className="w-full h-full object-cover"
                        onError={(event) => {
                            event.currentTarget.style.display =
                                "none";
                        }}
                    />
                ) : (
                    <User
                        size={size * 0.38}
                        className="text-teal-600/50"
                    />
                )}
            </div>
        );
    };

    // ========================================================
    // MEMBER NODE
    // ========================================================

    const MemberNode = ({
        pengurus,
    }: {
        pengurus: PengurusItem;
    }) => {
        const fotoUrl = getFotoUrl(
            pengurus.foto
        );

        const isSelected =
            selectedPengurus?.id ===
            pengurus.id;

        return (
            <button
                type="button"
                onClick={() =>
                    setSelectedPengurus(
                        isSelected
                            ? null
                            : pengurus
                    )
                }
                className={`struktur-card w-full bg-white rounded-2xl border px-4 py-5 flex flex-col items-center text-center ${
                    isSelected
                        ? "border-teal-500 ring-2 ring-teal-100"
                        : "border-slate-200"
                }`}
            >
                <Avatar
                    foto={fotoUrl}
                    nama={pengurus.nama}
                    size={58}
                    ring={
                        isSelected
                            ? "teal"
                            : "default"
                    }
                />

                <p className="text-sm font-semibold text-slate-900 mt-3 leading-snug">
                    {pengurus.nama}
                </p>

                <p className="text-xs text-slate-500 mt-1">
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

        const activeCarousel =
            getActiveCarousel();

        if (!activeCarousel) return null;

        const allPengurus =
            pokjaData[
                selectedPokjaId as keyof typeof pokjaData
            ] || [];

        const {
            index,
            next,
            prev,
            goTo,
        } = activeCarousel;

        const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
            if (allPengurus.length <= 1) return;

            dragStartXRef.current = event.clientX;
            dragPointerIdRef.current = event.pointerId;
            setIsDraggingCarousel(true);
            setDragOffsetX(0);
            event.currentTarget.setPointerCapture?.(event.pointerId);
        };

        const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
            if (dragStartXRef.current === null) return;

            const delta = event.clientX - dragStartXRef.current;
            const maxDrag = 120;
            setDragOffsetX(Math.max(-maxDrag, Math.min(maxDrag, delta)));
        };

        const finishDrag = (event?: React.PointerEvent<HTMLDivElement>) => {
            if (dragStartXRef.current === null) return;

            const endX = event?.clientX ?? dragStartXRef.current;
            const delta = endX - dragStartXRef.current;
            const swipeThreshold = 45;

            if (delta <= -swipeThreshold) {
                next();
            } else if (delta >= swipeThreshold) {
                prev();
            }

            if (event && dragPointerIdRef.current !== null) {
                try {
                    event.currentTarget.releasePointerCapture?.(dragPointerIdRef.current);
                } catch {
                    // Pointer capture bisa sudah dilepas browser. Aman diabaikan.
                }
            }

            dragStartXRef.current = null;
            dragPointerIdRef.current = null;
            setDragOffsetX(0);
            setIsDraggingCarousel(false);
        };

        const pokjaConfig =
            POKJA_CONFIG.find(
                (item) =>
                    item.id ===
                    selectedPokjaId
            );

        const Icon =
            pokjaConfig?.icon ?? Users;

        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                role="dialog"
                aria-modal="true"
                onClick={(event) => {
                    if (
                        event.target ===
                        event.currentTarget
                    ) {
                        setSelectedPokjaId(null);
                    }
                }}
            >
                <div className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
                    <div className="sticky top-0 z-10 bg-white px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                <Icon size={18} />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">
                                    {
                                        pokjaConfig?.label
                                    }
                                </h3>

                                <p className="text-xs text-slate-500">
                                    {
                                        pokjaConfig?.program
                                    }
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setSelectedPokjaId(
                                    null
                                )
                            }
                            className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6 sm:p-8">
                        {allPengurus.length >
                        0 ? (
                            <div className="relative">
                                <div
                                    className={`overflow-hidden select-none ${
                                        isDraggingCarousel ? "cursor-grabbing" : "cursor-grab"
                                    }`}
                                    style={{ touchAction: "pan-y" }}
                                    onPointerDown={handlePointerDown}
                                    onPointerMove={handlePointerMove}
                                    onPointerUp={finishDrag}
                                    onPointerCancel={finishDrag}
                                    onPointerLeave={(event) => {
                                        if (isDraggingCarousel && event.buttons === 0) {
                                            finishDrag(event);
                                        }
                                    }}
                                >
                                    <div
                                        className={`flex ${
                                            isDraggingCarousel
                                                ? ""
                                                : "transition-transform duration-500 ease-in-out"
                                        }`}
                                        style={{
                                            transform: `translateX(calc(-${index * 100}% + ${dragOffsetX}px))`,
                                        }}
                                    >
                                        {allPengurus.map(
                                            (
                                                pengurus
                                            ) => {
                                                const fotoUrl =
                                                    getFotoUrl(
                                                        pengurus.foto
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            pengurus.id
                                                        }
                                                        className="min-w-full px-2"
                                                    >
                                                        <div className="flex flex-col items-center text-center">
                                                            <Avatar
                                                                foto={
                                                                    fotoUrl
                                                                }
                                                                nama={
                                                                    pengurus.nama
                                                                }
                                                                size={
                                                                    120
                                                                }
                                                                ring="teal"
                                                            />

                                                            <h4 className="text-xl font-semibold text-slate-900 mt-5">
                                                                {
                                                                    pengurus.nama
                                                                }
                                                            </h4>

                                                            <p className="text-sm text-slate-500 mt-1">
                                                                {
                                                                    pengurus.jabatan
                                                                }
                                                            </p>

                                                            {pengurus.deskripsi && (
                                                                <p className="text-[15px] italic text-slate-600 mt-5 leading-relaxed max-w-md">
                                                                    &ldquo;
                                                                    {
                                                                        pengurus.deskripsi
                                                                    }
                                                                    &rdquo;
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>

                                {allPengurus.length >
                                    1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={
                                                prev
                                            }
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:border-teal-300 text-slate-700 flex items-center justify-center"
                                        >
                                            <ChevronLeft
                                                size={
                                                    18
                                                }
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={
                                                next
                                            }
                                            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:border-teal-300 text-slate-700 flex items-center justify-center"
                                        >
                                            <ChevronRight
                                                size={
                                                    18
                                                }
                                            />
                                        </button>

                                        <div className="flex justify-center gap-2 mt-8">
                                            {allPengurus.map(
                                                (
                                                    _,
                                                    idx
                                                ) => (
                                                    <button
                                                        key={
                                                            idx
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            goTo(
                                                                idx
                                                            )
                                                        }
                                                        className={`h-2 rounded-full transition-all ${
                                                            idx ===
                                                            index
                                                                ? "w-6 bg-teal-600"
                                                                : "w-2 bg-slate-300"
                                                        }`}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users
                                    size={36}
                                    className="mx-auto mb-3 text-slate-300"
                                />

                                <p className="text-sm text-slate-500">
                                    Belum ada data
                                    pengurus untuk Pokja
                                    ini.
                                </p>
                            </div>
                        )}
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

                <Head title="Struktur Organisasi - PKK Kabupaten Tasikmalaya">
                    <link
                        rel="preconnect"
                        href="https://fonts.googleapis.com"
                    />

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

                <main className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-5">
                            <Users
                                size={30}
                                className="text-teal-600"
                            />
                        </div>

                        <h2 className="text-xl font-semibold text-slate-900">
                            Belum ada data
                            pengurus
                        </h2>

                        <p className="text-sm text-slate-500 mt-2">
                            Data pengurus akan
                            ditampilkan di sini.
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
                <link
                    rel="preconnect"
                    href="https://fonts.googleapis.com"
                />

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

            {/* ====================================================
                HERO / HEADER
            ==================================================== */}

            <section className="relative overflow-hidden bg-slate-50 border-b border-slate-100 pt-24 sm:pt-28 pb-12 sm:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-teal-700 text-xs font-semibold tracking-wider uppercase mb-3">
                            Kepengurusan
                        </p>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
                            Struktur Organisasi
                        </h1>

                        <div className="w-12 h-1 bg-teal-600 rounded-full mt-5 mb-5" />

                        <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl">
                            Struktur kepengurusan Tim
                            Penggerak PKK Kabupaten
                            Tasikmalaya yang bersama-sama
                            menjalankan program pemberdayaan
                            dan kesejahteraan keluarga.
                        </p>
                    </div>
                </div>
            </section>

            {/* ====================================================
                KETUA
            ==================================================== */}

            {ketua && (
                <section
                    ref={ketuaAnim.ref}
                    className={`py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-100 struktur-fade-up ${
                        ketuaAnim.isVisible
                            ? "show"
                            : ""
                    }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center lg:items-start">
                            {/* FOTO */}

                            <div className="w-full lg:w-5/12">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedPengurus(
                                            ketua
                                        )
                                    }
                                    className="struktur-button w-full text-left"
                                >
                                    <div className="rounded-3xl overflow-hidden shadow-xl bg-slate-100">
                                        <img
                                            src={
                                                getFotoUrl(
                                                    ketua.foto,
                                                    true
                                                ) ||
                                                KETUA_FALLBACK_IMAGE
                                            }
                                            alt={
                                                ketua.nama
                                            }
                                            className="w-full h-[300px] sm:h-[380px] md:h-[460px] object-cover object-top"
                                            onError={(
                                                event
                                            ) => {
                                                event.currentTarget.src =
                                                    KETUA_FALLBACK_IMAGE;
                                            }}
                                        />
                                    </div>
                                </button>

                                <div className="mt-4 text-center lg:text-left">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {
                                            ketua.nama
                                        }
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        {
                                            ketua.jabatan
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* DESKRIPSI */}

                            <div className="w-full lg:w-7/12 lg:pt-5">
                                <p className="text-teal-700 text-sm font-medium tracking-wide uppercase mb-2">
                                    Ketua TP PKK
                                </p>

                                <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-6">
                                    Memimpin dengan Semangat
                                    Pemberdayaan Keluarga
                                </h2>

                                <p className="text-slate-600 text-[15px] leading-relaxed">
                                    {
                                        ketua.deskripsi ||
                                            "Pemberdayaan keluarga merupakan pondasi penting dalam membangun masyarakat Kabupaten Tasikmalaya yang sejahtera, mandiri, dan berdaya saing."
                                    }
                                </p>

                                <div className="mt-7 pt-6 border-t border-slate-200">
                                    <p className="font-semibold text-slate-900">
                                        {
                                            ketua.nama
                                        }
                                    </p>

                                    <p className="text-sm text-slate-500 mt-1">
                                        {
                                            ketua.jabatan
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedPengurus(
                                            ketua
                                        )
                                    }
                                    className="struktur-button mt-6 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-3 rounded-lg"
                                >
                                    Lihat Profil Lengkap

                                    <ArrowRight
                                        size={16}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ====================================================
                STRUKTUR ORGANISASI
            ==================================================== */}

            <section
                ref={strukturAnim.ref}
                className={`py-12 sm:py-16 lg:py-20 bg-slate-50 border-b border-slate-100 struktur-fade-up ${
                    strukturAnim.isVisible
                        ? "show"
                        : ""
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* HEADER */}

                    <div className="text-center mb-12">
                        <p className="text-teal-700 text-xs font-semibold tracking-wider uppercase mb-2">
                            Struktur Kepengurusan
                        </p>

                        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                            Bagan Organisasi PKK
                            Kabupaten Tasikmalaya
                        </h2>

                        <div className="w-10 h-0.5 bg-teal-600 mx-auto mb-4" />

                        <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
                            Struktur kepengurusan yang
                            terintegrasi untuk mendukung
                            pelaksanaan program kerja Tim
                            Penggerak PKK Kabupaten
                            Tasikmalaya.
                        </p>
                    </div>

                    {/* KETUA NODE */}

                    {ketua && (
                        <div className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedPengurus(
                                        ketua
                                    )
                                }
                                className="struktur-card bg-white rounded-2xl border border-yellow-300 px-6 sm:px-8 py-5 shadow-sm flex items-center gap-3 min-w-[260px]"
                            >
                                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                    <Crown
                                        size={19}
                                        className="text-yellow-600"
                                    />
                                </div>

                                <div className="text-left">
                                    <p className="text-xs text-slate-500">
                                        Ketua TP PKK
                                    </p>

                                    <p className="text-sm font-semibold text-slate-900 mt-1">
                                        {
                                            ketua.nama
                                        }
                                    </p>
                                </div>
                            </button>

                            <div className="w-px h-10 bg-slate-300" />
                        </div>
                    )}

                    {/* PIMPINAN INTI */}

                    {pimpinanInti.length >
                        0 && (
                        <div className="relative mb-6">
                            <div className="absolute top-0 left-[10%] right-[10%] h-px bg-slate-300 hidden sm:block" />

                            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
                                {pimpinanInti.map(
                                    (
                                        pengurus
                                    ) => (
                                        <div
                                            key={
                                                pengurus.id
                                            }
                                            className="relative pt-6"
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-300 hidden sm:block" />

                                            <MemberNode
                                                pengurus={
                                                    pengurus
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* CONNECTOR */}

                    <div className="flex justify-center">
                        <div className="w-px h-10 bg-slate-300" />
                    </div>

                    {/* POKJA HEADER */}

                    <div className="text-center mb-8">
                        <p className="text-sm text-slate-500">
                            Kelompok Kerja PKK
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                            Pilih salah satu Pokja
                            untuk melihat pengurus
                            lengkap
                        </p>
                    </div>

                    {/* POKJA */}

                    <div className="relative">
                        <div className="absolute top-0 left-[12%] right-[12%] h-px bg-slate-300 hidden lg:block" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {POKJA_CONFIG.map(
                                (config) => {
                                    const Icon =
                                        config.icon;

                                    const count =
                                        pokjaData[
                                            config.id as keyof typeof pokjaData
                                        ]
                                            ?.length ||
                                        0;

                                    return (
                                        <div
                                            key={
                                                config.id
                                            }
                                            className="relative pt-0 lg:pt-6"
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-6 bg-slate-300 hidden lg:block" />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedPokjaId(
                                                        config.id
                                                    )
                                                }
                                                className="struktur-card w-full h-full bg-white rounded-2xl border border-slate-200 p-6 text-left group"
                                            >
                                                <div className="flex items-center justify-between mb-5">
                                                    <div className="w-11 h-11 rounded-xl bg-teal-50 group-hover:bg-teal-600 flex items-center justify-center transition-colors">
                                                        <Icon
                                                            size={
                                                                20
                                                            }
                                                            className="text-teal-600 group-hover:text-white transition-colors"
                                                        />
                                                    </div>

                                                    <span className="text-xs text-slate-400">
                                                        {
                                                            count
                                                        }{" "}
                                                        pengurus
                                                    </span>
                                                </div>

                                                <p className="text-base font-semibold text-slate-900 mb-2">
                                                    {
                                                        config.label
                                                    }
                                                </p>

                                                <p className="text-sm leading-relaxed text-slate-500">
                                                    {
                                                        config.program
                                                    }
                                                </p>

                                                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-600">
                                                    Lihat Pengurus

                                                    <ArrowRight
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </div>
                                            </button>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ====================================================
                MODAL DETAIL PENGURUS
            ==================================================== */}

            {selectedPengurus && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    onClick={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedPengurus(
                                null
                            );
                        }
                    }}
                >
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-7 sm:p-8 max-h-[88vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedPengurus(
                                    null
                                )
                            }
                            className="absolute top-5 right-5 w-9 h-9 rounded-full hover:bg-slate-100 text-slate-500 flex items-center justify-center transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <Avatar
                                foto={getFotoUrl(
                                    selectedPengurus.foto,
                                    selectedPengurus.kategori ===
                                        "ketua"
                                )}
                                nama={
                                    selectedPengurus.nama
                                }
                                size={120}
                                ring={
                                    selectedPengurus.kategori ===
                                    "ketua"
                                        ? "gold"
                                        : "teal"
                                }
                            />

                            <h3 className="text-xl font-semibold text-slate-900 mt-5">
                                {
                                    selectedPengurus.nama
                                }
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                {
                                    selectedPengurus.jabatan
                                }
                            </p>

                            {selectedPengurus.deskripsi && (
                                <p className="text-[15px] text-slate-600 italic mt-5 leading-relaxed">
                                    &ldquo;
                                    {
                                        selectedPengurus.deskripsi
                                    }
                                    &rdquo;
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedPengurus(
                                        null
                                    )
                                }
                                className="mt-7 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ====================================================
                MODAL POKJA
            ==================================================== */}

            {renderPokjaModal()}

            <Footer />
        </div>
    );
}
