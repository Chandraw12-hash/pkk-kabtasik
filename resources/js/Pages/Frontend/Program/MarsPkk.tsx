import React, { useState, useRef, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Music,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Share2,
    Users,
    Download,
} from "lucide-react";

const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function MarsPkk() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (audioRef.current) audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        setVolume(val);
        setIsMuted(val === 0);
    };

    const skipBackward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, currentTime - 10);
        }
    };

    const skipForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(duration, currentTime + 10);
        }
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: "Mars PKK — TP PKK Kabupaten Tasikmalaya",
                    url: window.location.href,
                })
                .catch(() => {});
        } else {
            navigator.clipboard?.writeText(window.location.href);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Mars PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            <audio
                ref={audioRef}
                src="/sound/mars-pkk.mp3"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                preload="metadata"
            />

            {/* Header halaman */}
            <section className="bg-slate-50 border-b border-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
                    <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase mb-2">
                        Program
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
                        Mars PKK
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base max-w-xl leading-relaxed">
                        Lagu kebangsaan gerakan PKK — diputar dan dilantunkan
                        pada kegiatan resmi Tim Penggerak PKK.
                    </p>
                </div>
            </section>

            {/* Player */}
            <section className="border-b border-slate-100 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                            {/* Cover + info */}
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div
                                    className={`w-14 h-14 rounded-xl bg-[#0072BC] flex items-center justify-center shrink-0 shadow-sm ${
                                        isPlaying ? "ring-2 ring-[#0072BC] ring-offset-2" : ""
                                    }`}
                                >
                                    <Music size={22} className="text-white" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                                        Mars PKK
                                    </h2>
                                    <p className="text-xs text-slate-500 truncate">
                                        Paduan Suara TP PKK Kab. Tasikmalaya
                                    </p>
                                </div>
                            </div>

                            {/* Controls + progress */}
                            <div className="flex-1 flex flex-col gap-2.5 min-w-0">
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <button
                                        type="button"
                                        onClick={skipBackward}
                                        title="Mundur 10 detik"
                                        className="p-1.5 text-slate-400 hover:text-[#0072BC] transition-colors rounded-md"
                                    >
                                        <SkipBack size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        id="mars-pkk-play-btn"
                                        onClick={() => setIsPlaying((p) => !p)}
                                        className="w-11 h-11 rounded-full bg-[#0072BC] hover:bg-[#0072BC] flex items-center justify-center text-white transition-colors shadow-md"
                                        aria-label={
                                            isPlaying
                                                ? "Jeda Mars PKK"
                                                : "Putar Mars PKK"
                                        }
                                    >
                                        {isPlaying ? (
                                            <Pause size={18} fill="currentColor" />
                                        ) : (
                                            <Play
                                                size={18}
                                                fill="currentColor"
                                                className="ml-0.5"
                                            />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={skipForward}
                                        title="Maju 10 detik"
                                        className="p-1.5 text-slate-400 hover:text-[#0072BC] transition-colors rounded-md"
                                    >
                                        <SkipForward size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 w-full">
                                    <span className="text-[11px] tabular-nums text-slate-400 w-9 text-right shrink-0">
                                        {formatTime(currentTime)}
                                    </span>
                                    <div className="relative flex-1 h-1.5 bg-slate-200 rounded-full">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-[#0072BC] rounded-full pointer-events-none transition-[width] duration-100"
                                            style={{
                                                width: `${progressPercent}%`,
                                            }}
                                        />
                                        <input
                                            type="range"
                                            min={0}
                                            max={duration || 0}
                                            step={0.1}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            aria-label="Posisi lagu"
                                        />
                                    </div>
                                    <span className="text-[11px] tabular-nums text-slate-400 w-9 shrink-0">
                                        {formatTime(duration)}
                                    </span>
                                </div>
                            </div>

                            {/* Volume + download */}
                            <div className="flex items-center justify-center sm:justify-end gap-3 shrink-0">
                                <div className="hidden md:flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsMuted((m) => !m)}
                                        className="text-slate-400 hover:text-[#0072BC] transition-colors"
                                        aria-label={isMuted ? "Suara nyala" : "Bisukan"}
                                    >
                                        {isMuted || volume === 0 ? (
                                            <VolumeX size={16} />
                                        ) : (
                                            <Volume2 size={16} />
                                        )}
                                    </button>
                                    <div className="relative w-20 h-1.5 bg-slate-200 rounded-full">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-slate-400 rounded-full pointer-events-none"
                                            style={{
                                                width: `${(isMuted ? 0 : volume) * 100}%`,
                                            }}
                                        />
                                        <input
                                            type="range"
                                            min={0}
                                            max={1}
                                            step={0.01}
                                            value={isMuted ? 0 : volume}
                                            onChange={handleVolumeChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            aria-label="Volume"
                                        />
                                    </div>
                                </div>
                                <a
                                    href="/sound/mars-pkk.mp3"
                                    download
                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#0072BC] border border-slate-200 hover:border-[#FFC72C] px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    <Download size={13} />
                                    Unduh
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lirik */}
            <section id="lirik" className="py-14 lg:py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 sm:mb-10">
                        <p className="text-[#0072BC] text-xs font-semibold tracking-wider uppercase mb-1.5">
                            Lirik
                        </p>
                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                            Mars PKK
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        <div className="lg:col-span-5">
                            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                <img
                                    src="/assets/images/hero.jpg"
                                    alt="Tim PKK Kabupaten Tasikmalaya"
                                    className="w-full aspect-[4/3] object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1592424005742-8820c744f9ea?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                            </div>
                            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                                &ldquo;Membangun keluarga yang sejahtera dengan
                                PKK.&rdquo;
                            </p>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="space-y-5 text-slate-600 text-[15px] leading-[1.8]">
                                <p>
                                    Marilah hai semua Rakyat Indonesia
                                    <br />
                                    Membangun segara
                                    <br />
                                    Membangun keluarga yang sejahtera
                                    <br />
                                    Dengan PKK
                                </p>
                                <p>
                                    Hayati dan amalkan Pancasila
                                    <br />
                                    Untuk Negara
                                    <br />
                                    Hidup gotong royong, makmur pangan dan
                                    sandang
                                    <br />
                                    Rumah sehat sentosa
                                </p>
                                <p>
                                    Tata laksana di dalam rumah tangga
                                    <br />
                                    Rapi dan indah
                                    <br />
                                    Didiklah putra berkepribadian bangsa
                                    <br />
                                    Tampil dan sehat
                                </p>
                                <p>
                                    Kembangkan koperasi, jagalah lingkungan
                                    <br />
                                    Dan sekitarnya
                                    <br />
                                    Aman dan bahagia keluarga berencana
                                    <br />
                                    <span className="font-semibold text-slate-900">
                                        Hidup Jaya PKK
                                    </span>
                                </p>
                            </div>

                            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wide mb-0.5">
                                        Ciptaan
                                    </p>
                                    <p className="text-sm font-medium text-slate-800">
                                        Tim Penggerak PKK Pusat
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0072BC] hover:text-[#0072BC] self-start sm:self-auto"
                                >
                                    <Share2 size={14} />
                                    Bagikan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA ringkas */}
            <section className="py-12 lg:py-14 bg-slate-50 border-t border-slate-100">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                    <div className="w-10 h-10 rounded-lg bg-[#0072BC]/10 flex items-center justify-center mx-auto mb-3">
                        <Users size={18} className="text-[#0072BC]" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">
                        Ingin bergabung menjadi kader?
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-md mx-auto">
                        Jadilah bagian dari gerakan pemberdayaan keluarga di
                        Kabupaten Tasikmalaya.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <Link
                            href="/profil/tugas-fungsi"
                            className="inline-flex items-center gap-2 bg-[#0072BC] hover:bg-[#0072BC] text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
                        >
                            Pelajari organisasi
                        </Link>
                        <Link
                            href="/berita"
                            className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors bg-white"
                        >
                            Lihat kegiatan
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
