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
} from "lucide-react";

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
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

    // Sync play/pause with audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Sync volume
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

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Mars PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src="/sound/mars-pkk.mp3"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                preload="metadata"
            />

            {/* ==================== AUDIO PLAYER ==================== */}
            <section className="py-8 bg-slate-50 border-b border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Info */}
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 transition-transform ${isPlaying ? "animate-spin-slow" : ""}`}
                                style={{ animation: isPlaying ? "spin 4s linear infinite" : "none" }}
                            >
                                <Music size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 text-sm">
                                    Mars PKK
                                </h3>
                                <p className="text-slate-500 text-xs">
                                    Paduan Suara TP PKK Kab. Tasikmalaya
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex-1 w-full flex flex-col items-center gap-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={skipBackward}
                                    title="Mundur 10 detik"
                                    className="text-slate-400 hover:text-teal-600 transition-colors"
                                >
                                    <SkipBack size={18} />
                                </button>
                                <button
                                    id="mars-pkk-play-btn"
                                    onClick={() => setIsPlaying((p) => !p)}
                                    className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-500 flex items-center justify-center text-white transition-colors shadow-md"
                                    aria-label={isPlaying ? "Pause Mars PKK" : "Putar Mars PKK"}
                                >
                                    {isPlaying ? (
                                        <Pause size={16} fill="currentColor" />
                                    ) : (
                                        <Play size={16} fill="currentColor" className="ml-0.5" />
                                    )}
                                </button>
                                <button
                                    onClick={skipForward}
                                    title="Maju 10 detik"
                                    className="text-slate-400 hover:text-teal-600 transition-colors"
                                >
                                    <SkipForward size={18} />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex items-center gap-2 w-full max-w-sm">
                                <span className="text-[10px] text-slate-400 w-8 text-right">
                                    {formatTime(currentTime)}
                                </span>
                                <div className="relative flex-1 h-1.5 bg-slate-200 rounded-full cursor-pointer">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-teal-600 rounded-full pointer-events-none"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                    <input
                                        type="range"
                                        min={0}
                                        max={duration || 0}
                                        step={0.1}
                                        value={currentTime}
                                        onChange={handleSeek}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                <span className="text-[10px] text-slate-400 w-8">
                                    {formatTime(duration)}
                                </span>
                            </div>
                        </div>

                        {/* Volume */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                onClick={() => setIsMuted((m) => !m)}
                                className="text-slate-400 hover:text-teal-600 transition-colors"
                                aria-label={isMuted ? "Unmute" : "Mute"}
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
                                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== LIRIK ==================== */}
            <section id="lirik" className="py-20 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                            Lirik Lagu
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Mars PKK
                        </h2>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                        {/* Gambar */}
                        <div className="w-full lg:w-5/12">
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <img
                                    src="/assets/images/hero.jpg"
                                    alt="Tim PKK Kabupaten Tasikmalaya"
                                    className="w-full h-80 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1592424005742-8820c744f9ea?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                            </div>
                            <p className="text-sm text-slate-500 mt-3 italic">
                                &ldquo;Membangun keluarga yang sejahtera dengan
                                PKK...&rdquo;
                            </p>
                        </div>

                        {/* Teks Lirik */}
                        <div className="w-full lg:w-7/12">
                            <div className="space-y-5 text-slate-600 text-[15px] leading-relaxed">
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
                                    Hidup gotong royong, makmur pangan dan sandang
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
                                    Kembangkan koperas jagalah lingkungan
                                    <br />
                                    Dan sekitarnya
                                    <br />
                                    Aman dan bahagia keluarga berencana
                                    <br />
                                    <strong className="text-slate-900 font-semibold">
                                        Hidup Jaya PKK
                                    </strong>
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">
                                        Ciptaan
                                    </p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        Tim Penggerak PKK Pusat
                                    </p>
                                </div>
                                <button className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                                    <Share2 size={14} />
                                    Bagikan Lirik
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== CTA ==================== */}
            <section className="py-20 lg:py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
                    <div className="w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center mx-auto mb-4">
                        <Users size={20} className="text-teal-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Ingin Bergabung Menjadi Kader?
                    </h2>
                    <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto mb-8">
                        Jadilah bagian dari perubahan untuk Kabupaten Tasikmalaya
                        yang lebih mandiri dan sejahtera.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                        >
                            Daftar Kader Sekarang
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
                        >
                            Pelajari Program Pokja
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
