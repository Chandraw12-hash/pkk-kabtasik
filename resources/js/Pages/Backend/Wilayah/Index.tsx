import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import Card from "@/Components/UI/Card";
import { Head, useForm, router } from "@inertiajs/react";
import {
    Map as MapIcon,
    Search,
    RotateCcw,
    Plus,
    ChevronDown,
    Power,
    Building2,
    Home,
    Info,
} from "lucide-react";

interface DesaRow {
    id: number;
    desa: string;
    is_active: boolean;
}

interface IndexProps {
    grouped: Record<string, DesaRow[]>;
    stats: {
        kecamatan: number;
        desa: number;
        desa_aktif: number;
        desa_nonaktif: number;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ grouped, stats, filters = {} }: IndexProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [open, setOpen] = useState<string | null>(null);

    const formKec = useForm({ kecamatan: "", desa: "" });
    const formDesa = useForm({ kecamatan: "", desa: "" });

    const kecamatanNames = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

    const filtered = kecamatanNames.filter((kec) => {
        if (!search.trim()) return true;
        const q = search.trim().toLowerCase();
        if (kec.toLowerCase().includes(q)) return true;
        return (grouped[kec] || []).some((d) => d.desa.toLowerCase().includes(q));
    });

    const submitKecamatan = (e: React.FormEvent) => {
        e.preventDefault();
        formKec.post(route("be.wilayah.store-kecamatan"), {
            onSuccess: () => formKec.reset(),
        });
    };

    const submitDesa = (e: React.FormEvent) => {
        e.preventDefault();
        formDesa.post(route("be.wilayah.store-desa"), {
            onSuccess: () => formDesa.reset("desa"),
        });
    };

    return (
        <MainLayout>
            <Head title="Master Wilayah" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Master Wilayah
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kecamatan & desa se-Kabupaten Tasikmalaya — sumber dropdown HP, validasi akun, peta & rekap
                    </p>
                </div>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                    { label: "Kecamatan", value: stats.kecamatan, icon: Building2, cls: "bg-teal-50 text-teal-600 border-teal-100" },
                    { label: "Total Desa", value: stats.desa, icon: Home, cls: "bg-blue-50 text-blue-600 border-blue-100" },
                    { label: "Desa Aktif", value: stats.desa_aktif, icon: MapIcon, cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                    { label: "Desa Nonaktif", value: stats.desa_nonaktif, icon: Power, cls: "bg-slate-100 text-slate-500 border-slate-200" },
                ].map((s) => (
                    <Card key={s.label} className="p-4 dark:bg-slate-800 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${s.cls}`}>
                                <s.icon size={18} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{s.value}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Aturan main */}
            <div className="flex gap-3 p-4 mb-6 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200">
                <Info size={18} className="shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold mb-1">Aturan main master wilayah</p>
                    <ul className="list-disc ml-4 space-y-0.5 text-[13px]">
                        <li><b>Boleh:</b> tambah kecamatan/desa baru (pemekaran) & menonaktifkan.</li>
                        <li><b>Dilarang:</b> ubah nama & hapus — nama tersimpan sebagai teks di data lama (akun, KK, rekap), rename akan memutusnya.</li>
                        <li>Yang dinonaktifkan hilang dari dropdown & validasi, tapi data lamanya tetap utuh.</li>
                        <li>Desa baru belum punya akun — buatkan akun admin desa & dasawisma via <b>Manajemen Pengguna</b>.</li>
                    </ul>
                </div>
            </div>

            {/* Form tambah */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-2">
                        <Plus size={15} /> Tambah Kecamatan
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">Kecamatan baru wajib langsung punya 1 desa awal.</p>
                    <form onSubmit={submitKecamatan} className="space-y-3">
                        <div>
                            <TextInput
                                placeholder="Nama kecamatan baru"
                                value={formKec.data.kecamatan}
                                onChange={(e) => formKec.setData("kecamatan", e.target.value)}
                            />
                            {formKec.errors.kecamatan && (
                                <p className="text-xs text-rose-600 mt-1">{formKec.errors.kecamatan}</p>
                            )}
                        </div>
                        <div>
                            <TextInput
                                placeholder="Desa awal di kecamatan ini"
                                value={formKec.data.desa}
                                onChange={(e) => formKec.setData("desa", e.target.value)}
                            />
                            {formKec.errors.desa && (
                                <p className="text-xs text-rose-600 mt-1">{formKec.errors.desa}</p>
                            )}
                        </div>
                        <Button
                            variant="primary"
                            className="bg-teal-600 hover:bg-teal-700"
                            disabled={formKec.processing}
                        >
                            Simpan Kecamatan
                        </Button>
                    </form>
                </Card>

                <Card className="p-5 dark:bg-slate-800 dark:border-slate-700">
                    <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-2">
                        <Plus size={15} /> Tambah Desa (Pemekaran)
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">Desa baru masuk ke kecamatan yang sudah ada.</p>
                    <form onSubmit={submitDesa} className="space-y-3">
                        <div>
                            <select
                                value={formDesa.data.kecamatan}
                                onChange={(e) => formDesa.setData("kecamatan", e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 py-2.5 px-3.5 transition-all outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            >
                                <option value="">— Pilih kecamatan —</option>
                                {kecamatanNames.map((k) => (
                                    <option key={k} value={k}>{k}</option>
                                ))}
                            </select>
                            {formDesa.errors.kecamatan && (
                                <p className="text-xs text-rose-600 mt-1">{formDesa.errors.kecamatan}</p>
                            )}
                        </div>
                        <div>
                            <TextInput
                                placeholder="Nama desa baru"
                                value={formDesa.data.desa}
                                onChange={(e) => formDesa.setData("desa", e.target.value)}
                            />
                            {formDesa.errors.desa && (
                                <p className="text-xs text-rose-600 mt-1">{formDesa.errors.desa}</p>
                            )}
                        </div>
                        <Button
                            variant="primary"
                            className="bg-teal-600 hover:bg-teal-700"
                            disabled={formDesa.processing}
                        >
                            Simpan Desa
                        </Button>
                    </form>
                </Card>
            </div>

            {/* Daftar */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[180px] max-w-sm">
                            <TextInput
                                iconLeft={<Search size={17} />}
                                placeholder="Cari kecamatan / desa..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {search && (
                            <Button
                                variant="secondary"
                                onClick={() => setSearch("")}
                                className="flex items-center gap-1.5 text-sm"
                            >
                                <RotateCcw size={14} />
                                <span>Reset</span>
                            </Button>
                        )}
                        <p className="text-xs text-slate-400 ml-auto">
                            {filtered.length} kecamatan ditampilkan
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filtered.map((kec) => {
                        const list = grouped[kec] || [];
                        const aktif = list.filter((d) => d.is_active).length;
                        const isOpen = open === kec;
                        return (
                            <div key={kec}>
                                <button
                                    type="button"
                                    onClick={() => setOpen(isOpen ? null : kec)}
                                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left transition-colors"
                                >
                                    <ChevronDown
                                        size={16}
                                        className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                    />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex-1">
                                        {kec}
                                    </span>
                                    <Badge type={aktif === list.length ? "success" : "default"}>
                                        {aktif}/{list.length} aktif
                                    </Badge>
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        title={aktif > 0 ? "Nonaktifkan kecamatan (semua desanya ikut)" : "Aktifkan kecamatan kembali"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(
                                                aktif > 0
                                                    ? `Nonaktifkan Kecamatan ${kec}? Semua ${list.length} desanya ikut hilang dari dropdown & validasi. Data lama tetap utuh.`
                                                    : `Aktifkan kembali Kecamatan ${kec}?`
                                            )) {
                                                router.patch(route("be.wilayah.toggle-kecamatan"), { kecamatan: kec });
                                            }
                                        }}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        className={`p-1.5 rounded-lg transition-all ${aktif > 0 ? "text-slate-400 hover:text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                                    >
                                        <Power size={15} />
                                    </span>
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-4 pl-12 flex flex-wrap gap-2">
                                        {list.map((d) => (
                                            <button
                                                key={d.id}
                                                type="button"
                                                title={d.is_active ? `Nonaktifkan Desa ${d.desa}` : `Aktifkan Desa ${d.desa}`}
                                                onClick={() => {
                                                    if (window.confirm(
                                                        d.is_active
                                                            ? `Nonaktifkan Desa ${d.desa}? Hilang dari dropdown & validasi. Data lama tetap utuh.`
                                                            : `Aktifkan kembali Desa ${d.desa}?`
                                                    )) {
                                                        router.patch(route("be.wilayah.toggle-desa", d.id));
                                                    }
                                                }}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                                    d.is_active
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                                                        : "bg-slate-100 text-slate-400 border-slate-200 line-through hover:bg-emerald-50 hover:text-emerald-700 hover:no-underline"
                                                }`}
                                            >
                                                <Power size={11} />
                                                {d.desa}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                                <MapIcon size={32} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">Tidak ketemu</p>
                            <p className="text-xs text-slate-400 mt-0.5">Coba kata kunci lain atau tambah data baru di atas</p>
                        </div>
                    )}
                </div>
            </Card>
        </MainLayout>
    );
}
