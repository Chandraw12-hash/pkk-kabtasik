import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminKecamatanLayout from '@/Components/Layout/AdminKecamatanLayout';
import {
    ArrowLeft,
    FileText,
    MapPin,
    Home,
    Calendar,
    User,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Image as ImageIcon,
    TrendingUp,
} from 'lucide-react';

interface LaporanDetail {
    id: number;
    judul: string;
    deskripsi: string;
    kategori_pokja: string;
    data_angka: Record<string, number> | string;
    foto: string | null;
    foto_url: string | null;
    kecamatan: string;
    desa_kelurahan: string | null;
    nama_dasawisma: string | null;
    status: string;
    status_label: string;
    status_color: string;
    pokja_display: string;
    reviewed_at: string | null;
    reviewed_by: number | null;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        username: string;
    };
    reviewer?: {
        id: number;
        name: string;
    } | null;
}

interface LaporanShowProps {
    kecamatan: string;
    laporan: LaporanDetail;
}

export default function LaporanShow({ kecamatan, laporan }: LaporanShowProps) {
    // ============================================================
    // PARSE DATA ANGKA
    // ============================================================
    let dataAngka: Record<string, number> = {};

    if (typeof laporan.data_angka === 'string') {
        try {
            const parsed = JSON.parse(laporan.data_angka);
            // Handle double-encoded JSON
            if (typeof parsed === 'string') {
                dataAngka = JSON.parse(parsed);
            } else {
                dataAngka = parsed;
            }
        } catch (e) {
            console.error('Error parsing data_angka:', e);
            dataAngka = {};
        }
    } else if (laporan.data_angka && typeof laporan.data_angka === 'object') {
        dataAngka = laporan.data_angka;
    }

    // ============================================================
    // LABEL FIELD (Mapping nama field ke label yang readable)
    // ============================================================
    const fieldLabels: Record<string, string> = {
        // Pokja I
        pkbn_l: 'PKBN Laki-laki',
        pkbn_p: 'PKBN Perempuan',
        pkdrt_l: 'PKDRT Laki-laki',
        pkdrt_p: 'PKDRT Perempuan',
        pola_asuh_l: 'Pola Asuh Laki-laki',
        pola_asuh_p: 'Pola Asuh Perempuan',
        lansia_l: 'Lansia Laki-laki',
        lansia_p: 'Lansia Perempuan',
        kader_pokja1_l: 'Kader Pokja I Laki-laki',
        kader_pokja1_p: 'Kader Pokja I Perempuan',

        // Pokja II
        warga_buta_l: 'Warga Buta Laki-laki',
        warga_buta_p: 'Warga Buta Perempuan',
        kelompok_belajar_paket_a: 'Kelompok Belajar Paket A',
        kelompok_belajar_paket_b: 'Kelompok Belajar Paket B',
        kelompok_belajar_paket_c: 'Kelompok Belajar Paket C',
        kf: 'Keaksaraan Fungsional',
        paud: 'PAUD',
        koperasi_berbadan_hukum: 'Koperasi Berbadan Hukum',

        // Pokja III
        rumah_sehat: 'Rumah Sehat',
        rumah_tidak_sehat: 'Rumah Tidak Sehat',
        pemanfaatan_pekarangan: 'Pemanfaatan Pekarangan',
        industri_rumah_tangga: 'Industri Rumah Tangga',

        // Pokja IV
        posyandu: 'Posyandu',
        akseptor_kb: 'Akseptor KB',
        phbs: 'PHBS',
        jamban_keluarga: 'Jamban Keluarga',
    };

    // ============================================================
    // STATUS BADGE
    // ============================================================
    const getStatusBadge = (status: string) => {
        const map: Record<string, { label: string; class: string; icon: any }> = {
            pending: {
                label: 'Menunggu Verifikasi',
                class: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800',
                icon: Clock,
            },
            approved: {
                label: 'Disetujui',
                class: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border-green-200 dark:border-green-800',
                icon: CheckCircle2,
            },
            rejected: {
                label: 'Ditolak',
                class: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border-red-200 dark:border-red-800',
                icon: XCircle,
            },
            reviewed: {
                label: 'Sudah Direview',
                class: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800',
                icon: AlertCircle,
            },
        };
        return map[status] || {
            label: status,
            class: 'bg-slate-100 text-slate-700 border-slate-200',
            icon: AlertCircle,
        };
    };

    const statusBadge = getStatusBadge(laporan.status);
    const StatusIcon = statusBadge.icon;

    // ============================================================
    // POKJA BADGE
    // ============================================================
    const getPokjaBadge = (pokja: string) => {
        const map: Record<string, { class: string; bg: string }> = {
            I: {
                class: 'text-teal-700 dark:text-teal-400',
                bg: 'bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800',
            },
            II: {
                class: 'text-blue-700 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
            },
            III: {
                class: 'text-purple-700 dark:text-purple-400',
                bg: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
            },
            IV: {
                class: 'text-pink-700 dark:text-pink-400',
                bg: 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800',
            },
        };
        return map[pokja] || {
            class: 'text-slate-700',
            bg: 'bg-slate-50 border-slate-200',
        };
    };

    const pokjaBadge = getPokjaBadge(laporan.kategori_pokja);

    // ============================================================
    // RENDER
    // ============================================================
    return (
        <AdminKecamatanLayout>
            <Head title={`Detail Laporan - ${laporan.judul}`} />

            <div className="space-y-6">
                {/* ============================================================
                    BACK BUTTON
                ============================================================ */}
                <Link
                    href="/kecamatan/laporan"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Laporan
                </Link>

                {/* ============================================================
                    HEADER CARD
                ============================================================ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    {/* Header dengan gradient */}
                    <div className="relative bg-gradient-to-br from-teal-600 via-teal-600 to-cyan-600 px-6 py-8 text-white">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10">
                            {/* Pokja Badge */}
                            <div className="flex items-center gap-2 flex-wrap mb-4">
                                <span
                                    className={`inline-flex items-center text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30`}
                                >
                                    {laporan.pokja_display}
                                </span>
                                <span
                                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30`}
                                >
                                    <StatusIcon className="w-3 h-3" />
                                    {statusBadge.label}
                                </span>
                            </div>

                            {/* Judul */}
                            <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
                                {laporan.judul}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-teal-50/90">
                                <div className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    <span>{laporan.user?.name || 'Anonim'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {new Date(laporan.created_at).toLocaleDateString(
                                            'id-ID',
                                            {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            }
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detail Info */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Kecamatan
                                </p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {laporan.kecamatan || '-'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <Home className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Desa/Kelurahan
                                </p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {laporan.desa_kelurahan || '-'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <Home className="w-5 h-5 text-slate-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Dasa Wisma
                                </p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {laporan.nama_dasawisma || '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ============================================================
                    DESKRIPSI
                ============================================================ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <h2 className="font-bold text-slate-900 dark:text-slate-100">
                            Deskripsi Kegiatan
                        </h2>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {laporan.deskripsi || 'Tidak ada deskripsi.'}
                    </p>
                </div>

                {/* ============================================================
                    DATA ANGKA
                ============================================================ */}
                {Object.keys(dataAngka).length > 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <h2 className="font-bold text-slate-900 dark:text-slate-100">
                                Data Angka
                            </h2>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(dataAngka).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                                    >
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                            {fieldLabels[key] || key}
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ============================================================
                    FOTO
                ============================================================ */}
                {laporan.foto_url && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            <h2 className="font-bold text-slate-900 dark:text-slate-100">
                                Dokumentasi
                            </h2>
                        </div>
                        <div className="p-6">
                            <img
                                src={laporan.foto_url}
                                alt={laporan.judul}
                                className="w-full max-h-96 object-contain rounded-xl border border-slate-200 dark:border-slate-700"
                            />
                        </div>
                    </div>
                )}

                {/* ============================================================
                    VERIFIKASI INFO (Kalau udah di-approve/reject)
                ============================================================ */}
                {laporan.reviewed_at && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            {laporan.status === 'approved' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : laporan.status === 'rejected' ? (
                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            )}
                            <h2 className="font-bold text-slate-900 dark:text-slate-100">
                                Info Verifikasi
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Diverifikasi Oleh
                                </p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {laporan.reviewer?.name || 'Admin'}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Tanggal Verifikasi
                                </p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {new Date(laporan.reviewed_at).toLocaleDateString(
                                        'id-ID',
                                        {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminKecamatanLayout>
    );
}
