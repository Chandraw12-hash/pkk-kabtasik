import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminDesaLayout from '@/Components/Layout/AdminDesaLayout';
import Card from '@/Components/UI/Card';
import TextInput from '@/Components/Form/TextInput';
import {
    ArrowLeft,
    Save,
    Home,
    Users,
    UserCheck,
    Briefcase,
    FileText,   // ✅ FIXED — ditambahkan
} from 'lucide-react';

interface DataUmumItem {
    id: number;
    tahun: number;
    kecamatan: string;
    desa: string;
    dusun: string | null;
    nama_dusun: string | null;
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

interface EditProps {
    data: DataUmumItem;
}

export default function Edit({ data }: EditProps) {
    const { data: form, setData, put, processing, errors } = useForm({
        tahun: data.tahun,
        dusun: data.dusun || '',
        nama_dusun: data.nama_dusun || '',
        jumlah_dusun: data.jumlah_dusun || 0,
        jumlah_pkk_rw: data.jumlah_pkk_rw || 0,
        jumlah_pkk_rt: data.jumlah_pkk_rt || 0,
        jumlah_dasa_wisma: data.jumlah_dasa_wisma || 0,
        jumlah_krt: data.jumlah_krt || 0,
        jumlah_kk: data.jumlah_kk || 0,
        jiwa_l: data.jiwa_l || 0,
        jiwa_p: data.jiwa_p || 0,
        jiwa_tidak_terpilah: data.jiwa_tidak_terpilah || 0,
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
        put(`/desa/data-umum/${data.id}`);
    };

    return (
        <AdminDesaLayout>
            <Head title={`Edit Data Umum — ${data.nama_dusun || data.dusun}`} />

            <div className="space-y-6 max-w-5xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/desa/data-umum"
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-0.5">
                            Edit Data Umum PKK
                        </p>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {data.nama_dusun || data.dusun || 'Dusun Tidak Diketahui'}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {data.desa}, Kec. {data.kecamatan} — Tahun {data.tahun}
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">i</span>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                        Field <span className="font-semibold">KRT, KK, Jiwa L/P, dan Belum Terpilah</span> akan otomatis di-update dari input kader Flutter setiap ada approval baru.
                        Field lain bisa diisi manual di sini.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* SECTION 1 — Identitas */}
                    <SectionCard title="Identitas Wilayah" icon={Home} color="teal">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Tahun">
                                <TextInput
                                    type="number"
                                    value={form.tahun}
                                    onChange={(e) => setData('tahun', Number(e.target.value))}
                                    className="w-full"
                                />
                                {errors.tahun && <ErrorMsg msg={errors.tahun} />}
                            </Field>

                            <Field label="Level">
                                <input
                                    type="text"
                                    value={data.level}
                                    disabled
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500 text-sm"
                                />
                            </Field>

                            <Field label="Dusun">
                                <TextInput
                                    value={form.dusun}
                                    onChange={(e) => setData('dusun', e.target.value)}
                                    placeholder="Nama dusun"
                                    className="w-full"
                                />
                            </Field>

                            <Field label="Nama Dusun (lengkap)">
                                <TextInput
                                    value={form.nama_dusun}
                                    onChange={(e) => setData('nama_dusun', e.target.value)}
                                    placeholder="Nama lengkap"
                                    className="w-full"
                                />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* SECTION 2 — Jumlah Kelompok */}
                    <SectionCard title="Jumlah Kelompok PKK" icon={Users} color="purple">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <NumberField
                                label="Jumlah Dusun"
                                value={form.jumlah_dusun}
                                onChange={(v) => setData('jumlah_dusun', v)}
                            />
                            <NumberField
                                label="PKK RW"
                                value={form.jumlah_pkk_rw}
                                onChange={(v) => setData('jumlah_pkk_rw', v)}
                            />
                            <NumberField
                                label="PKK RT"
                                value={form.jumlah_pkk_rt}
                                onChange={(v) => setData('jumlah_pkk_rt', v)}
                            />
                            <NumberField
                                label="Dasa Wisma"
                                value={form.jumlah_dasa_wisma}
                                onChange={(v) => setData('jumlah_dasa_wisma', v)}
                            />
                        </div>
                    </SectionCard>

                    {/* SECTION 3 — Data Wilayah */}
                    <SectionCard title="Data KRT, KK & Jiwa" icon={Home} color="blue">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <NumberField
                                label="Jumlah KRT"
                                value={form.jumlah_krt}
                                onChange={(v) => setData('jumlah_krt', v)}
                            />
                            <NumberField
                                label="Jumlah KK"
                                value={form.jumlah_kk}
                                onChange={(v) => setData('jumlah_kk', v)}
                            />
                            <div />

                            <NumberField
                                label="Jiwa Laki-laki"
                                value={form.jiwa_l}
                                onChange={(v) => setData('jiwa_l', v)}
                            />
                            <NumberField
                                label="Jiwa Perempuan"
                                value={form.jiwa_p}
                                onChange={(v) => setData('jiwa_p', v)}
                            />
                            <NumberField
                                label="Belum Terpilah"
                                value={form.jiwa_tidak_terpilah}
                                onChange={(v) => setData('jiwa_tidak_terpilah', v)}
                                highlight
                            />
                        </div>
                    </SectionCard>

                    {/* SECTION 4 — Kader */}
                    <SectionCard title="Data Kader PKK" icon={UserCheck} color="pink">
                        <div className="space-y-4">
                            <SubLabel>Anggota TP PKK</SubLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <NumberField label="Laki-laki" value={form.tp_pkk_l} onChange={(v) => setData('tp_pkk_l', v)} />
                                <NumberField label="Perempuan" value={form.tp_pkk_p} onChange={(v) => setData('tp_pkk_p', v)} />
                            </div>

                            <SubLabel>Kader Umum</SubLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <NumberField label="Laki-laki" value={form.kader_umum_l} onChange={(v) => setData('kader_umum_l', v)} />
                                <NumberField label="Perempuan" value={form.kader_umum_p} onChange={(v) => setData('kader_umum_p', v)} />
                            </div>

                            <SubLabel>Kader Khusus</SubLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <NumberField label="Laki-laki" value={form.kader_khusus_l} onChange={(v) => setData('kader_khusus_l', v)} />
                                <NumberField label="Perempuan" value={form.kader_khusus_p} onChange={(v) => setData('kader_khusus_p', v)} />
                            </div>
                        </div>
                    </SectionCard>

                    {/* SECTION 5 — Sekretariat */}
                    <SectionCard title="Tenaga Sekretariat" icon={Briefcase} color="amber">
                        <div className="space-y-4">
                            <SubLabel>Honorer</SubLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <NumberField label="Laki-laki" value={form.sekretariat_honorer_l} onChange={(v) => setData('sekretariat_honorer_l', v)} />
                                <NumberField label="Perempuan" value={form.sekretariat_honorer_p} onChange={(v) => setData('sekretariat_honorer_p', v)} />
                            </div>

                            <SubLabel>Bantuan</SubLabel>
                            <div className="grid grid-cols-2 gap-4">
                                <NumberField label="Laki-laki" value={form.sekretariat_bantuan_l} onChange={(v) => setData('sekretariat_bantuan_l', v)} />
                                <NumberField label="Perempuan" value={form.sekretariat_bantuan_p} onChange={(v) => setData('sekretariat_bantuan_p', v)} />
                            </div>
                        </div>
                    </SectionCard>

                    {/* SECTION 6 — Keterangan */}
                    <SectionCard title="Keterangan" icon={FileText} color="slate">
                        <textarea
                            value={form.keterangan}
                            onChange={(e) => setData('keterangan', e.target.value)}
                            rows={3}
                            placeholder="Keterangan tambahan..."
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
                        />
                    </SectionCard>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/desa/data-umum"
                            className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
                        >
                            <Save size={16} />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminDesaLayout>
    );
}

// ══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ══════════════════════════════════════════════════════════════

function SectionCard({
    title,
    icon: Icon,
    color,
    children,
}: {
    title: string;
    icon: any;
    color: string;
    children: React.ReactNode;
}) {
    const colorMap: Record<string, string> = {
        teal: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
        blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
        purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
        pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
        amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
        slate: 'bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400',
    };

    return (
        <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-5">
                <div className={`p-2.5 rounded-xl ${colorMap[color]}`}>
                    <Icon size={18} />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {title}
                </h2>
            </div>
            {children}
        </Card>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}

function NumberField({
    label,
    value,
    onChange,
    highlight = false,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    highlight?: boolean;
}) {
    return (
        <Field label={label}>
            <input
                type="number"
                min={0}
                value={value}
                onChange={(e) => onChange(Number(e.target.value) || 0)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    highlight
                        ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
            />
        </Field>
    );
}

function SubLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {children}
        </p>
    );
}

function ErrorMsg({ msg }: { msg: string }) {
    return <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{msg}</p>;
}
