import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import {
    Building2,
    Edit3,
    Eye,
    X,
    RefreshCw,
    Users,
    Info,
    Upload,
    Download,
    HelpCircle,
    MapPin,
    UserCheck,
    Briefcase,
    FileSpreadsheet,
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface DataDusunItem {
    id: number;
    tahun: number;
    dusun: string | null;
    nama_dusun: string | null;
    level: string;
    jumlah_kk: number;
    jumlah_krt: number;
    jiwa_l: number;
    jiwa_p: number;
    jiwa_tidak_terpilah: number;
    jumlah_dasa_wisma: number;
}

interface AggregateDesa {
    id: number;
    tahun: number;
    kecamatan: string;
    nama_kecamatan: string | null;
    desa: string;
    nama_desa: string | null;
    jumlah_dusun: number;
    jumlah_pkk_rw: number;
    jumlah_pkk_rt: number;
    jumlah_dasa_wisma: number;
    jumlah_krt: number;
    jumlah_kk: number;
    jiwa_l: number;
    jiwa_p: number;
    jiwa_tidak_terpilah: number;
    tp_pkk_l: number;
    tp_pkk_p: number;
    kader_umum_l: number;
    kader_umum_p: number;
    kader_khusus_l: number;
    kader_khusus_p: number;
    sekretariat_honorer_l: number;
    sekretariat_honorer_p: number;
    sekretariat_bantuan_l: number;
    sekretariat_bantuan_p: number;
}

interface DataUmumIndexProps {
    aggregateDesa: AggregateDesa;
    dataDusun: {
        data: DataDusunItem[];
        total: number;
    };
    filters: {
        tahun?: string;
    };
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function Index({ aggregateDesa, dataDusun, filters }: DataUmumIndexProps) {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [tahun] = useState(filters.tahun || '2026');

    const handleSync = () => {
        if (!confirm('Refresh data dari semua dusun?\n\nAngka akan diupdate dari input kader terbaru.')) return;
        router.post('/desa/data-umum/sync-aggregate', { tahun });
    };

    const totalJiwa =
        (aggregateDesa.jiwa_l || 0) +
        (aggregateDesa.jiwa_p || 0) +
        (aggregateDesa.jiwa_tidak_terpilah || 0);

    const totalKader =
        (aggregateDesa.tp_pkk_l || 0) + (aggregateDesa.tp_pkk_p || 0) +
        (aggregateDesa.kader_umum_l || 0) + (aggregateDesa.kader_umum_p || 0) +
        (aggregateDesa.kader_khusus_l || 0) + (aggregateDesa.kader_khusus_p || 0);

    const totalSekretariat =
        (aggregateDesa.sekretariat_honorer_l || 0) + (aggregateDesa.sekretariat_honorer_p || 0) +
        (aggregateDesa.sekretariat_bantuan_l || 0) + (aggregateDesa.sekretariat_bantuan_p || 0);

    return (
        <AdminDesaLayout>
            <Head title="Data Umum PKK" />

            <div className="space-y-5 max-w-6xl">
                {/* ══════════════════════════════════════════════
                    HEADER — dengan tombol aksi
                ══════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
                            Data Umum PKK
                        </p>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {aggregateDesa.nama_desa || aggregateDesa.desa}
                        </h1>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                            <MapPin size={13} />
                            <span>Kec. {aggregateDesa.nama_kecamatan || aggregateDesa.kecamatan}</span>
                            <span>•</span>
                            <span>Tahun {aggregateDesa.tahun}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setShowHelpModal(true)}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <HelpCircle size={15} />
                            <span className="hidden sm:inline">Panduan</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleSync}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            <RefreshCw size={15} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                        <Link
                            href={`/desa/data-umum/edit-desa?tahun=${aggregateDesa.tahun}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors shadow-sm"
                        >
                            <Edit3 size={15} />
                            <span>Edit Data</span>
                        </Link>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    INFO BANNER — 1 aja
                ══════════════════════════════════════════════ */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                    <Info size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                        <span className="font-semibold">Data ini otomatis</span> dari input kader Dasawisma.
                        Kalau ada angka yang salah, klik <span className="font-semibold">Refresh</span> atau hubungi kader.
                        Field kader & sekretariat bisa di-edit manual lewat tombol <span className="font-semibold">Edit Data</span>.
                    </p>
                </div>

                {/* ══════════════════════════════════════════════
                    RINGKASAN UTAMA — 4 STAT CARD
                ══════════════════════════════════════════════ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <BigStatCard
                        label="Total Jiwa"
                        value={totalJiwa}
                        icon={Users}
                        color="teal"
                    />
                    <BigStatCard
                        label="Total KK"
                        value={aggregateDesa.jumlah_kk}
                        icon={Building2}
                        color="blue"
                    />
                    <BigStatCard
                        label="Total Kader"
                        value={totalKader}
                        icon={UserCheck}
                        color="pink"
                    />
                    <BigStatCard
                        label="Dasa Wisma"
                        value={aggregateDesa.jumlah_dasa_wisma}
                        icon={Briefcase}
                        color="purple"
                    />
                </div>

                {/* ══════════════════════════════════════════════
                    BLOK 1 — DATA WARGA (dari kader)
                ══════════════════════════════════════════════ */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
                                <Users size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    Data Warga
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Total dari {dataDusun.total} dusun — otomatis dari kader
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDetailModal(true)}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <Eye size={14} />
                            <span>Lihat Per Dusun</span>
                        </button>
                    </div>

                    <div className="p-5">
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            <SmallStat label="KRT" value={aggregateDesa.jumlah_krt} />
                            <SmallStat label="KK" value={aggregateDesa.jumlah_kk} />
                            <SmallStat label="Laki-laki" value={aggregateDesa.jiwa_l} color="blue" />
                            <SmallStat label="Perempuan" value={aggregateDesa.jiwa_p} color="pink" />
                            <SmallStat
                                label="Belum Terpilah"
                                value={aggregateDesa.jiwa_tidak_terpilah}
                                color={aggregateDesa.jiwa_tidak_terpilah > 0 ? 'amber' : 'slate'}
                                full
                            />
                        </div>
                    </div>
                </Card>

                {/* ══════════════════════════════════════════════
                    BLOK 2 & 3 — WILAYAH + KADER (GRID 2 COL)
                ══════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* BLOK 2 — WILAYAH */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                                <Building2 size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    Wilayah
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Jumlah kelompok PKK
                                </p>
                            </div>
                        </div>
                        <div className="p-5 grid grid-cols-2 gap-3">
                            <SmallStat label="Jumlah Dusun" value={aggregateDesa.jumlah_dusun} />
                            <SmallStat label="Dasa Wisma" value={aggregateDesa.jumlah_dasa_wisma} />
                            <SmallStat label="PKK RW" value={aggregateDesa.jumlah_pkk_rw} />
                            <SmallStat label="PKK RT" value={aggregateDesa.jumlah_pkk_rt} />
                        </div>
                    </Card>

                    {/* BLOK 3 — KADER */}
                    <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400">
                                <UserCheck size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    Kader PKK
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Total {totalKader} orang
                                </p>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            <GenderRow label="Anggota TP PKK" l={aggregateDesa.tp_pkk_l} p={aggregateDesa.tp_pkk_p} />
                            <GenderRow label="Kader Umum" l={aggregateDesa.kader_umum_l} p={aggregateDesa.kader_umum_p} />
                            <GenderRow label="Kader Khusus" l={aggregateDesa.kader_khusus_l} p={aggregateDesa.kader_khusus_p} />
                        </div>
                    </Card>
                </div>

                {/* ══════════════════════════════════════════════
                    BLOK 4 — SEKRETARIAT (kalau ada)
                ══════════════════════════════════════════════ */}
                {totalSekretariat > 0 && (
                    <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
                                <Briefcase size={18} />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                    Tenaga Sekretariat
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Total {totalSekretariat} orang
                                </p>
                            </div>
                        </div>
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <GenderRow label="Honorer" l={aggregateDesa.sekretariat_honorer_l} p={aggregateDesa.sekretariat_honorer_p} />
                            <GenderRow label="Bantuan" l={aggregateDesa.sekretariat_bantuan_l} p={aggregateDesa.sekretariat_bantuan_p} />
                        </div>
                    </Card>
                )}

                {/* ══════════════════════════════════════════════
                    TOOLS — Import & Template
                ══════════════════════════════════════════════ */}
                <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                            <FileSpreadsheet size={18} className="text-slate-400" />
                            <div>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Butuh import data?
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Gunakan template supaya formatnya sesuai
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/desa/data-umum/import"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            >
                                <Upload size={15} />
                                <span>Import</span>
                            </Link>
                            <a
                                href="/desa/data-umum/template"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            >
                                <Download size={15} />
                                <span>Template</span>
                            </a>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ══════════════════════════════════════════════
                MODAL — DETAIL PER DUSUN
            ══════════════════════════════════════════════ */}
            {showDetailModal && (
                <Modal onClose={() => setShowDetailModal(false)}>
                    <ModalHeader
                        icon={Users}
                        title="Detail Per Dusun"
                        subtitle={`${dataDusun.total} dusun di ${aggregateDesa.nama_desa || aggregateDesa.desa}`}
                        onClose={() => setShowDetailModal(false)}
                    />

                    <div className="p-6">
                        {dataDusun.data.length > 0 ? (
                            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                                        <tr className="text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            <th className="px-4 py-3">No</th>
                                            <th className="px-4 py-3">Nama Dusun</th>
                                            <th className="px-4 py-3 text-right">KRT</th>
                                            <th className="px-4 py-3 text-right">KK</th>
                                            <th className="px-4 py-3 text-right">L</th>
                                            <th className="px-4 py-3 text-right">P</th>
                                            <th className="px-4 py-3 text-right">Belum Terpilah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {dataDusun.data.map((item, idx) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                                                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                    {item.nama_dusun || item.dusun || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                    {item.jumlah_krt?.toLocaleString('id-ID') || 0}
                                                </td>
                                                <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                    {item.jumlah_kk?.toLocaleString('id-ID') || 0}
                                                </td>
                                                <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                    {item.jiwa_l?.toLocaleString('id-ID') || 0}
                                                </td>
                                                <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                                    {item.jiwa_p?.toLocaleString('id-ID') || 0}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span
                                                        className={
                                                            (item.jiwa_tidak_terpilah || 0) > 0
                                                                ? 'font-bold text-amber-600 dark:text-amber-400'
                                                                : 'text-slate-700 dark:text-slate-300'
                                                        }
                                                    >
                                                        {item.jiwa_tidak_terpilah?.toLocaleString('id-ID') || 0}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <Users size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    Belum ada data dusun
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Data akan muncul otomatis dari input kader
                                </p>
                            </div>
                        )}
                    </div>

                    <ModalFooter onClose={() => setShowDetailModal(false)} />
                </Modal>
            )}

            {/* ══════════════════════════════════════════════
                MODAL — PANDUAN SINGKAT
            ══════════════════════════════════════════════ */}
            {showHelpModal && (
                <Modal onClose={() => setShowHelpModal(false)} small>
                    <ModalHeader
                        icon={HelpCircle}
                        title="Panduan Singkat"
                        subtitle="Cara pakai halaman ini"
                        onClose={() => setShowHelpModal(false)}
                    />

                    <div className="p-6 space-y-4">
                        <HelpStep
                            number={1}
                            title="Data Warga"
                            desc="Otomatis dari input kader. Kalau ada angka salah, klik tombol Refresh."
                        />
                        <HelpStep
                            number={2}
                            title="Wilayah & Kader"
                            desc="Jumlah dusun, RW, RT, kader — diisi manual. Klik Edit Data untuk mengubah."
                        />
                        <HelpStep
                            number={3}
                            title="Detail Per Dusun"
                            desc="Klik Lihat Per Dusun untuk melihat rincian tiap dusun (CIPANAS, Cipasung, dll)."
                        />
                    </div>

                    <ModalFooter onClose={() => setShowHelpModal(false)} />
                </Modal>
            )}
        </AdminDesaLayout>
    );
}

// ══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ══════════════════════════════════════════════════════════════

function BigStatCard({
    label,
    value,
    icon: Icon,
    color,
}: {
    label: string;
    value: number;
    icon: any;
    color: 'teal' | 'blue' | 'pink' | 'purple';
}) {
    const colorMap = {
        teal: {
            bg: 'bg-teal-50 dark:bg-teal-900/20',
            border: 'border-teal-200 dark:border-teal-900',
            iconBg: 'bg-teal-100 dark:bg-teal-900/50',
            iconColor: 'text-teal-600 dark:text-teal-400',
            value: 'text-teal-700 dark:text-teal-300',
        },
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-900',
            iconBg: 'bg-blue-100 dark:bg-blue-900/50',
            iconColor: 'text-blue-600 dark:text-blue-400',
            value: 'text-blue-700 dark:text-blue-300',
        },
        pink: {
            bg: 'bg-pink-50 dark:bg-pink-900/20',
            border: 'border-pink-200 dark:border-pink-900',
            iconBg: 'bg-pink-100 dark:bg-pink-900/50',
            iconColor: 'text-pink-600 dark:text-pink-400',
            value: 'text-pink-700 dark:text-pink-300',
        },
        purple: {
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            border: 'border-purple-200 dark:border-purple-900',
            iconBg: 'bg-purple-100 dark:bg-purple-900/50',
            iconColor: 'text-purple-600 dark:text-purple-400',
            value: 'text-purple-700 dark:text-purple-300',
        },
    };

    const c = colorMap[color];

    return (
        <div className={`p-4 rounded-2xl border ${c.bg} ${c.border}`}>
            <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={c.iconColor} />
            </div>
            <p className={`text-2xl font-bold ${c.value}`}>
                {(value || 0).toLocaleString('id-ID')}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {label}
            </p>
        </div>
    );
}

function SmallStat({
    label,
    value,
    color = 'slate',
    full = false,
}: {
    label: string;
    value: number;
    color?: 'slate' | 'blue' | 'pink' | 'amber';
    full?: boolean;
}) {
    const colorMap = {
        slate: 'text-slate-900 dark:text-slate-100',
        blue: 'text-blue-600 dark:text-blue-400',
        pink: 'text-pink-600 dark:text-pink-400',
        amber: 'text-amber-600 dark:text-amber-400',
    };

    return (
        <div className={full ? 'col-span-2 sm:col-span-1' : ''}>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                {label}
            </p>
            <p className={`text-xl font-bold ${colorMap[color]}`}>
                {(value || 0).toLocaleString('id-ID')}
            </p>
        </div>
    );
}

function GenderRow({
    label,
    l,
    p,
}: {
    label: string;
    l: number;
    p: number;
}) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {label}
            </p>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        L
                    </p>
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {(l || 0).toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="w-px h-8 bg-slate-300 dark:bg-slate-600"></div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                        P
                    </p>
                    <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {(p || 0).toLocaleString('id-ID')}
                    </p>
                </div>
            </div>
        </div>
    );
}

function Modal({
    children,
    onClose,
    small = false,
}: {
    children: React.ReactNode;
    onClose: () => void;
    small?: boolean;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className={`relative w-full ${
                    small ? 'max-w-md' : 'max-w-5xl'
                } max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl`}
            >
                {children}
            </div>
        </div>
    );
}

function ModalHeader({
    icon: Icon,
    title,
    subtitle,
    onClose,
}: {
    icon: any;
    title: string;
    subtitle: string;
    onClose: () => void;
}) {
    return (
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors"
            >
                <X size={18} />
            </button>
        </div>
    );
}

function ModalFooter({ onClose }: { onClose: () => void }) {
    return (
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold transition-colors"
            >
                Tutup
            </button>
        </div>
    );
}

function HelpStep({
    number,
    title,
    desc,
}: {
    number: number;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <div className="shrink-0 w-7 h-7 rounded-full bg-teal-500 text-white font-bold text-xs flex items-center justify-center">
                {number}
            </div>
            <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {title}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    );
}
