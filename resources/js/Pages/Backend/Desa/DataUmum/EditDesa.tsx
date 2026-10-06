import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import {
    ArrowLeft,
    Save,
    Users,
    UserCheck,
    Briefcase,
    FileText,
    Info,
    Building2,
    RefreshCw,
    Zap,
    Pencil,
    Lock,
    Home,
    HelpCircle,
} from 'lucide-react';

// ══════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════

interface DataUmumItem {
    id: number;
    tahun: number;
    kecamatan: string;
    nama_kecamatan: string | null;
    desa: string;
    nama_desa: string | null;
    level: string;
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
    keterangan: string | null;
}

interface EditDesaProps {
    data: DataUmumItem;
}

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════

export default function EditDesa({ data }: EditDesaProps) {
    const { data: form, setData, put, processing, errors } = useForm({
        tahun: data.tahun,
        // ✅ Field manual aja — field auto ga dikirim
        tp_pkk_l: data.tp_pkk_l || 0,
        tp_pkk_p: data.tp_pkk_p || 0,
        kader_umum_l: data.kader_umum_l || 0,
        kader_umum_p: data.kader_umum_p || 0,
        kader_khusus_l: data.kader_khusus_l || 0,
        kader_khusus_p: data.kader_khusus_p || 0,
        sekretariat_honorer_l: data.sekretariat_honorer_l || 0,
        sekretariat_honorer_p: data.sekretariat_honorer_p || 0,
        sekretariat_bantuan_l: data.sekretariat_bantuan_l || 0,
        sekretariat_bantuan_p: data.sekretariat_bantuan_p || 0,
        keterangan: data.keterangan || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/desa/data-umum/update-desa');
    };

    const handleSync = () => {
        if (!confirm('Sync ulang data dari semua dusun?\n\nField otomatis (KRT, KK, Jiwa, Jumlah Dusun, PKK RW/RT, Dasa Wisma) akan di-refresh.')) return;
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/desa/data-umum/sync-aggregate';

        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrf;
        form.appendChild(csrfInput);

        const tahunInput = document.createElement('input');
        tahunInput.type = 'hidden';
        tahunInput.name = 'tahun';
        tahunInput.value = String(data.tahun);
        form.appendChild(tahunInput);

        document.body.appendChild(form);
        form.submit();
    };

    const totalJiwa = (data.jiwa_l || 0) + (data.jiwa_p || 0) + (data.jiwa_tidak_terpilah || 0);

    return (
        <AdminDesaLayout>
            <Head title={`Edit Data Umum Desa — ${data.nama_desa || data.desa}`} />

            <div className="space-y-5 max-w-5xl">
                {/* ══════════════════════════════════════════════
                    HEADER
                ══════════════════════════════════════════════ */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/desa/data-umum"
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div className="flex-1">
                        <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-0.5">
                            Edit Data Umum Desa
                        </p>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {data.nama_desa || data.desa}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Kec. {data.nama_kecamatan || data.kecamatan} — Tahun {data.tahun}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSync}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        title="Refresh data dari dusun"
                    >
                        <RefreshCw size={16} />
                        Refresh Data
                    </button>
                </div>

                {/* ══════════════════════════════════════════════
                    INFO BANNER
                ══════════════════════════════════════════════ */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                    <div className="shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                        <HelpCircle size={16} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                        <p className="font-bold mb-1">Ada 2 jenis data di halaman ini:</p>
                        <ul className="space-y-1 ml-4 list-disc">
                            <li>
                                <span className="font-semibold inline-flex items-center gap-1">
                                    <Zap size={12} /> Otomatis
                                </span>{' '}
                                — dari input kader Dasawisma (jangan diubah)
                            </li>
                            <li>
                                <span className="font-semibold inline-flex items-center gap-1">
                                    <Pencil size={12} /> Manual
                                </span>{' '}
                                — isi sesuai data desa
                            </li>
                        </ul>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    DATA OTOMATIS (READ ONLY)
                ══════════════════════════════════════════════ */}
                <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden border-2 border-teal-200 dark:border-teal-900">
                    <div className="p-4 border-b border-teal-100 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-950/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400">
                                <Building2 size={18} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                                        Data Otomatis
                                    </h2>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 uppercase tracking-wider">
                                        <Zap size={10} />
                                        Auto
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Dihitung otomatis dari data kader & dusun — tidak bisa diubah
                                </p>
                            </div>
                            <Lock size={16} className="text-slate-400" />
                        </div>
                    </div>

                    <div className="p-5 space-y-5">
                        {/* Group 1 — Jumlah Kelompok */}
                        <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Jumlah Kelompok PKK
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <AutoField label="Jumlah Dusun" value={data.jumlah_dusun} />
                                <AutoField label="PKK RW" value={data.jumlah_pkk_rw} />
                                <AutoField label="PKK RT" value={data.jumlah_pkk_rt} />
                                <AutoField label="Dasa Wisma" value={data.jumlah_dasa_wisma} />
                            </div>
                        </div>

                        {/* Group 2 — Data Warga */}
                        <div>
                            <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">
                                Data Warga
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                <AutoField label="KRT" value={data.jumlah_krt} />
                                <AutoField label="KK" value={data.jumlah_kk} />
                                <AutoField label="Jiwa L" value={data.jiwa_l} />
                                <AutoField label="Jiwa P" value={data.jiwa_p} />
                                <AutoField
                                    label="Belum Terpilah"
                                    value={data.jiwa_tidak_terpilah}
                                    warning={data.jiwa_tidak_terpilah > 0}
                                />
                            </div>
                        </div>

                        {/* Total Jiwa */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 text-white shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold opacity-90 uppercase tracking-wider">
                                        Total Jiwa
                                    </p>
                                    <p className="text-[10px] opacity-75">
                                        L + P + Belum Terpilah
                                    </p>
                                </div>
                                <p className="text-3xl font-bold">
                                    {totalJiwa.toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* ══════════════════════════════════════════════
                    FORM MANUAL
                ══════════════════════════════════════════════ */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* SECTION — KADER */}
                    <SectionCard
                        icon={UserCheck}
                        title="Data Kader PKK"
                        subtitle="Isi sesuai data kader aktif di desa"
                        color="pink"
                        tag="manual"
                    >
                        <div className="space-y-5">
                            <div>
                                <SubLabel>Anggota TP PKK</SubLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <NumberField
                                        label="Laki-laki"
                                        value={form.tp_pkk_l}
                                        onChange={(v) => setData('tp_pkk_l', v)}
                                        gender="L"
                                    />
                                    <NumberField
                                        label="Perempuan"
                                        value={form.tp_pkk_p}
                                        onChange={(v) => setData('tp_pkk_p', v)}
                                        gender="P"
                                    />
                                </div>
                            </div>

                            <div>
                                <SubLabel>Kader Umum</SubLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <NumberField
                                        label="Laki-laki"
                                        value={form.kader_umum_l}
                                        onChange={(v) => setData('kader_umum_l', v)}
                                        gender="L"
                                    />
                                    <NumberField
                                        label="Perempuan"
                                        value={form.kader_umum_p}
                                        onChange={(v) => setData('kader_umum_p', v)}
                                        gender="P"
                                    />
                                </div>
                            </div>

                            <div>
                                <SubLabel>Kader Khusus</SubLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <NumberField
                                        label="Laki-laki"
                                        value={form.kader_khusus_l}
                                        onChange={(v) => setData('kader_khusus_l', v)}
                                        gender="L"
                                    />
                                    <NumberField
                                        label="Perempuan"
                                        value={form.kader_khusus_p}
                                        onChange={(v) => setData('kader_khusus_p', v)}
                                        gender="P"
                                    />
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* SECTION — SEKRETARIAT */}
                    <SectionCard
                        icon={Briefcase}
                        title="Tenaga Sekretariat"
                        subtitle="Isi sesuai data sekretariat desa"
                        color="amber"
                        tag="manual"
                    >
                        <div className="space-y-5">
                            <div>
                                <SubLabel>Honorer</SubLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <NumberField
                                        label="Laki-laki"
                                        value={form.sekretariat_honorer_l}
                                        onChange={(v) => setData('sekretariat_honorer_l', v)}
                                        gender="L"
                                    />
                                    <NumberField
                                        label="Perempuan"
                                        value={form.sekretariat_honorer_p}
                                        onChange={(v) => setData('sekretariat_honorer_p', v)}
                                        gender="P"
                                    />
                                </div>
                            </div>

                            <div>
                                <SubLabel>Bantuan</SubLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <NumberField
                                        label="Laki-laki"
                                        value={form.sekretariat_bantuan_l}
                                        onChange={(v) => setData('sekretariat_bantuan_l', v)}
                                        gender="L"
                                    />
                                    <NumberField
                                        label="Perempuan"
                                        value={form.sekretariat_bantuan_p}
                                        onChange={(v) => setData('sekretariat_bantuan_p', v)}
                                        gender="P"
                                    />
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* SECTION — KETERANGAN */}
                    <SectionCard
                        icon={FileText}
                        title="Keterangan"
                        subtitle="Catatan tambahan (opsional)"
                        color="slate"
                        tag="manual"
                    >
                        <textarea
                            value={form.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            rows={3}
                            placeholder="Contoh: Data per Oktober 2026..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                        />
                    </SectionCard>

                    {/* SUBMIT */}
                    <div className="flex items-center justify-between gap-3 pt-2 sticky bottom-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            💡 Cuma field manual yang disimpan. Field otomatis auto-update.
                        </p>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/desa/data-umum"
                                className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-md"
                            >
                                <Save size={16} />
                                {processing ? 'Menyimpan...' : 'Simpan Data Desa'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminDesaLayout>
    );
}

// ══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ══════════════════════════════════════════════════════════════

function AutoField({
    label,
    value,
    warning = false,
}: {
    label: string;
    value: number;
    warning?: boolean;
}) {
    return (
        <div
            className={`p-3 rounded-xl border ${
                warning
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                    : 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-900'
            }`}
        >
            <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {label}
                </p>
                <Zap size={10} className="text-teal-500 dark:text-teal-400" />
            </div>
            <p
                className={`text-xl font-bold ${
                    warning
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-teal-600 dark:text-teal-400'
                }`}
            >
                {(value || 0).toLocaleString('id-ID')}
            </p>
        </div>
    );
}

function SectionCard({
    title,
    subtitle,
    icon: Icon,
    color,
    tag,
    children,
}: {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    tag: 'auto' | 'manual';
    children: React.ReactNode;
}) {
    const colorMap: Record<string, string> = {
        teal: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
        purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
        amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
        slate: 'bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400',
    };

    return (
        <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {title}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {subtitle}
                        </p>
                    </div>
                </div>
                <span
                    className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        tag === 'auto'
                            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                    }`}
                >
                    {tag === 'auto' ? <Zap size={10} /> : <Pencil size={10} />}
                    {tag === 'auto' ? 'Otomatis' : 'Manual'}
                </span>
            </div>
            {children}
        </Card>
    );
}

function NumberField({
    label,
    value,
    onChange,
    gender,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    gender?: 'L' | 'P';
}) {
    const genderColor = gender === 'L' ? 'text-blue-600 dark:text-blue-400' : gender === 'P' ? 'text-pink-600 dark:text-pink-400' : '';

    return (
        <div>
            <label className={`block text-xs font-semibold mb-1.5 ${genderColor || 'text-slate-600 dark:text-slate-400'}`}>
                {label}
            </label>
            <input
                type="number"
                min={0}
                value={value}
                onChange={(e) => onChange(Number(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
        </div>
    );
}

function SubLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {children}
        </p>
    );
}
