import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import { Search, Edit2, Trash2, RotateCcw, Plus, Upload, Download, X, FileSpreadsheet, CheckCircle2, ChevronDown, ClipboardList, BookOpenText, FileText } from "lucide-react";
import axios from "axios";

type TabId = "rekap" | "laporan";

interface BukuRow {
    nama?: string;
    jabatan?: string | null;
    tanggal?: string | null;
    tempat?: string | null;
    uraian?: string | null;
}

interface LaporanItem {
    id: number;
    judul: string;
    deskripsi?: string | null;
    kategori_pokja: string;
    kecamatan?: string | null;
    desa_kelurahan?: string | null;
    nama_dasawisma?: string | null;
    status: string;
    created_at?: string;
    user?: { id: number; name: string } | null;
    data_angka?: {
        jenis_formulir?: string | null;
        buku_kegiatan?: BukuRow[] | null;
        buku_kegiatan_count?: number | null;
        [key: string]: any;
    } | null;
}

const isBukuKegiatan = (item: LaporanItem): boolean =>
    item.kategori_pokja === "I" &&
    item.data_angka?.jenis_formulir === "buku_kegiatan_lampiran_413" &&
    Array.isArray(item.data_angka?.buku_kegiatan);

const formatTanggal = (d?: string | null) => {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
        return "—";
    }
};

const formatTanggalBuku = (d?: string | null) => {
    if (!d) return "—";
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d.trim());
    try {
        const dt = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(d);
        return dt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {
        return d;
    }
};

const getStatusBadge = (status: string): { label: string; type: "default" | "success" | "warning" | "danger" | "info" } => {
    const map: Record<string, { label: string; type: "default" | "success" | "warning" | "danger" | "info" }> = {
        pending: { label: "Menunggu", type: "warning" },
        reviewed: { label: "Sudah Direview", type: "info" },
        approved: { label: "Disetujui", type: "success" },
        rejected: { label: "Ditolak", type: "danger" },
    };
    return map[status] || { label: status, type: "default" };
};

function BukuKegiatanSheet({ rows }: { rows: BukuRow[] }) {
    const clean = (rows || []).filter((r) => r && (r.nama || r.uraian));
    if (clean.length === 0) return null;
    const th = "border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 text-center";
    const td = "border border-slate-300 px-3 py-2 text-sm text-slate-700 align-top";
    return (
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1 text-center">
                    <h3 className="text-sm font-bold tracking-wide text-slate-800 dark:text-slate-100">BUKU KEGIATAN</h3>
                </div>
                <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">LAMPIRAN 4.13</p>
            </div>
            <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full border-collapse min-w-[760px]">
                    <thead>
                        <tr>
                            <th className={th} rowSpan={2}>NO</th>
                            <th className={th} rowSpan={2}>NAMA</th>
                            <th className={th} rowSpan={2}>JABATAN</th>
                            <th className={th} colSpan={3}>KEGIATAN</th>
                            <th className={th} rowSpan={2}>TANDA TANGAN</th>
                        </tr>
                        <tr>
                            <th className={th}>TANGGAL</th>
                            <th className={th}>TEMPAT</th>
                            <th className={th}>URAIAN</th>
                        </tr>
                        <tr>
                            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                <th key={n} className={`${th} font-semibold text-slate-400`}>{n}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {clean.map((r, i) => (
                            <tr key={i}>
                                <td className={`${td} text-center`}>{i + 1}</td>
                                <td className={`${td} font-medium`}>{r.nama || "—"}</td>
                                <td className={td}>{r.jabatan || "—"}</td>
                                <td className={`${td} whitespace-nowrap`}>{formatTanggalBuku(r.tanggal)}</td>
                                <td className={td}>{r.tempat || "—"}</td>
                                <td className={`${td} whitespace-pre-wrap`}>{r.uraian || "—"}</td>
                                <td className={td}>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-center text-[11px] italic text-slate-400">Kementerian Dalam Negeri &amp; Tim Penggerak PKK Pusat</p>
        </div>
    );
}

export default function Index({ pokjas, laporan_kegiatan, buku_kegiatan_count = 0, laporan_loaded = false, filters = {} }) {
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeTab, setActiveTab] = useState<TabId>(filters.active_tab || "rekap");

    // Sheet Laporan Kegiatan
    const [laporanSearch, setLaporanSearch] = useState(filters.laporan_search || "");
    const [laporanStatus, setLaporanStatus] = useState(filters.laporan_status || "");

    // State untuk Modal Import Excel
    const [showImportModal, setShowImportModal] = useState(false);
    const {
        data: importData,
        setData: setImportData,
        post,
        processing: importProcessing,
        reset: resetImport,
        errors: importErrors,
        clearErrors: clearImportErrors,
    } = useForm({ file: null });

    const [localPokjas, setLocalPokjas] = useState({
        ...pokjas,
        data: pokjas?.data || [],
    });
    const [localLaporan, setLocalLaporan] = useState({
        ...(laporan_kegiatan || {}),
        data: laporan_kegiatan?.data || [],
    });
    const [bukuCount, setBukuCount] = useState(buku_kegiatan_count || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLaporanLoading, setIsLaporanLoading] = useState(false);
    const isFirstRender = React.useRef(true);

    const { delete: destroy, processing } = useForm({});

    const fetchData = (url, params = {}) => {
        setIsLoading(true);
        axios
            .get(url, { params, headers: { Accept: "application/json" } })
            .then((res) => {
                const payload = res.data?.pokjas ? res.data.pokjas : res.data;
                if (payload && typeof payload === "object" && "data" in payload) {
                    setLocalPokjas(payload);
                } else if (Array.isArray(payload)) {
                    setLocalPokjas((prev) => ({ ...prev, data: payload }));
                }
                if (res.data?.laporan_kegiatan) setLocalLaporan(res.data.laporan_kegiatan);
                if (typeof res.data?.buku_kegiatan_count === "number") setBukuCount(res.data.buku_kegiatan_count);
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    };

    const fetchLaporan = (params = {}) => {
        setIsLaporanLoading(true);
        axios
            .get(route("be.pokja1.index"), { params, headers: { Accept: "application/json" } })
            .then((res) => {
                if (res.data?.laporan_kegiatan) setLocalLaporan(res.data.laporan_kegiatan);
                if (typeof res.data?.buku_kegiatan_count === "number") setBukuCount(res.data.buku_kegiatan_count);
            })
            .catch((err) => console.error("Error fetching laporan:", err))
            .finally(() => setIsLaporanLoading(false));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            if (activeTab === "rekap") {
                fetchData(route("be.pokja1.index"), { search, per_page: perPage });
            } else {
                fetchLaporan({ laporan_search: laporanSearch, laporan_status: laporanStatus, laporan_per_page: 10 });
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [search, perPage, laporanSearch, laporanStatus, activeTab]);

    useEffect(() => {
        if (pokjas) setLocalPokjas({ ...pokjas, data: pokjas?.data || [] });
    }, [pokjas]);

    useEffect(() => {
        if (laporan_kegiatan) setLocalLaporan({ ...laporan_kegiatan, data: laporan_kegiatan?.data || [] });
        if (typeof buku_kegiatan_count === "number") setBukuCount(buku_kegiatan_count);
    }, [laporan_kegiatan, buku_kegiatan_count]);

    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedItem) return;

        destroy(route("be.pokja1.destroy", selectedItem.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedItem(null);
                fetchData(route("be.pokja1.index"), { search, per_page: perPage });
            },
        });
    };

    const closeImportModal = () => {
        setShowImportModal(false);
        resetImport();
        clearImportErrors();
    };

    const handleImportSubmit = (e) => {
        e.preventDefault();
        post(route("be.pokja1.import"), {
            onSuccess: () => {
                closeImportModal();
                fetchData(route("be.pokja1.index"), { search, per_page: perPage });
            },
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "";
        const kb = bytes / 1024;
        return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
    };

    const tabs: Array<{ id: TabId; label: string; icon: any }> = [
        { id: "rekap", label: "Rekapitulasi", icon: ClipboardList },
        { id: "laporan", label: "Laporan Kegiatan", icon: BookOpenText },
    ];

    return (
        <MainLayout>
            <Head title="Manajemen Data Pokja I" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Manajemen Data Pokja I
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola data kegiatan dan program kerja Pokja I TP PKK
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        href={route("be.pokja1.export", search ? { search } : {})}
                        target="_blank"
                        className="flex items-center gap-2 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                    >
                        <Download size={16} />
                        <span>Export Excel</span>
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => setShowImportModal(true)}
                        className="flex items-center gap-2 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                    >
                        <Upload size={16} />
                        <span>Import Excel</span>
                    </Button>

                    <Button
                        variant="primary"
                        href={route("be.pokja1.create")}
                        className="shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Tambah Pokja I</span>
                    </Button>
                </div>
            </div>

            {/* ─── TABS / SHEET ─── */}
            <div className="mb-0 overflow-hidden rounded-t-2xl border border-b-0 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-1 overflow-x-auto px-2 sm:px-4" role="tablist" aria-label="Sheet Pokja I">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-4 text-sm font-medium transition-colors focus-visible:outline-none ${
                                    isActive
                                        ? "border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300"
                                        : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                }`}
                            >
                                <Icon size={16} aria-hidden="true" />
                                <span>{tab.label}</span>
                                {tab.id === "laporan" && (
                                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                                        {localLaporan.total ?? localLaporan.data?.length ?? 0}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {activeTab === "rekap" && (
            <Card className="rounded-t-none dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari judul kegiatan..."
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {search && (
                        <Button
                            variant="danger"
                            onClick={() => { setSearch(""); setPerPage(10); }}
                            className="flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            <span>Reset</span>
                        </Button>
                    )}
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {isLoading ? (
                        <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            Memuat data Pokja I...
                        </p>
                    ) : localPokjas.data.length > 0 ? (
                        localPokjas.data.map((item, index) => {
                            const hasTitle =
                                item.judul_kegiatan &&
                                item.judul_kegiatan !== "-";
                            const hasDesc =
                                item.deskripsi && item.deskripsi !== "-";
                            const currentPage = localPokjas.current_page ?? 1;
                            const perPageVal = localPokjas.per_page ?? 10;
                            const detailGroups = [
                                {
                                    title: "Wilayah & kader",
                                    fields: [
                                        { key: "kecamatan", label: "Kecamatan" },
                                        { key: "nama_kecamatan", label: "Nama kecamatan" },
                                        { key: "nama_wilayah", label: "Nama wilayah" },
                                        { key: "tahun", label: "Tahun" },
                                        { key: "kategori", label: "Kategori" },
                                        { key: "kader_umum", label: "Kader umum" },
                                        { key: "kader_khusus", label: "Kader khusus" },
                                    ],
                                },
                                ...[
                                    ["KISAH", "kisah"],
                                    ["KILAS", "kilas"],
                                    ["KRISAN", "krisan"],
                                    ["KIAT", "kiat"],
                                    ["KISAK", "kisak"],
                                    ["PKBN", "pkbn"],
                                ].map(([title, prefix]) => ({
                                    title,
                                    fields: [
                                        { key: `${prefix}_kegiatan`, label: "Kegiatan" },
                                        { key: `${prefix}_volume`, label: "Volume" },
                                        { key: `${prefix}_metode`, label: "Metode" },
                                        { key: `${prefix}_sasaran`, label: "Sasaran" },
                                    ],
                                })),
                                {
                                    title: "Keterangan tambahan",
                                    fields: [
                                        { key: "judul_kegiatan", label: "Judul kegiatan" },
                                        { key: "deskripsi", label: "Deskripsi" },
                                        { key: "keterangan", label: "Keterangan" },
                                        { key: "foto", label: "Foto" },
                                    ],
                                },
                            ];
                            const summaryMetrics = [
                                {
                                    label: "Kader umum",
                                    value: item.kader_umum ?? 0,
                                },
                                {
                                    label: "Kader khusus",
                                    value: item.kader_khusus ?? 0,
                                },
                                {
                                    label: "Tahun",
                                    value: item.tahun ?? "—",
                                },
                                {
                                    label: "Kategori",
                                    value: item.kategori || "Pokja I",
                                },
                            ];

                            return (
                                <article
                                    key={item.id}
                                    className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-700/30 sm:flex-row sm:items-start sm:px-6"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold tabular-nums text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                        {(currentPage - 1) * perPageVal +
                                            index +
                                            1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex flex-wrap items-center gap-2">
                                            <h2 className="min-w-0 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                {hasTitle
                                                    ? item.judul_kegiatan
                                                    : `Rekap Data — ${
                                                          item.kecamatan ||
                                                          "Tanpa Kecamatan"
                                                      }`}
                                            </h2>
                                            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                                                {item.kategori || "Pokja I"}
                                            </span>
                                        </div>
                                        <p className="line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                            {hasDesc
                                                ? item.deskripsi
                                                : `Kecamatan: ${
                                                      item.kecamatan || "-"
                                                  }`}
                                        </p>
                                    </div>
                                    <details className="group min-w-0 flex-1">
                                        <summary className="list-none cursor-pointer rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 [&::-webkit-details-marker]:hidden">
                                                <div className="flex flex-col gap-4 py-1 xl:flex-row xl:items-center">
                                                    <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4 xl:max-w-3xl">
                                                        {summaryMetrics.map((metric) => (
                                                            <div key={metric.label} className="min-w-0">
                                                                <dt className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                                    {metric.label}
                                                                </dt>
                                                                <dd className="mt-0.5 truncate text-sm font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                                                                    {metric.value}
                                                                </dd>
                                                            </div>
                                                        ))}
                                                    </dl>
                                                    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                                                        <span className="group-open:hidden">Lihat rincian</span>
                                                        <span className="hidden group-open:inline">Tutup rincian</span>
                                                        <ChevronDown size={16} className="transition-transform group-open:rotate-180" aria-hidden="true" />
                                                    </span>
                                                </div>
                                        </summary>
                                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/40 sm:p-5">
                                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                                                    {detailGroups.map((group) => (
                                                        <section key={group.title} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                                                            <h3 className="mb-3 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                                                {group.title}
                                                            </h3>
                                                            <dl className="space-y-2 text-sm">
                                                                {group.fields.map((field) => (
                                                                    <div key={field.key} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-3">
                                                                        <dt className="min-w-0 break-words text-slate-500 dark:text-slate-400">{field.label}</dt>
                                                                        <dd className="min-w-0 whitespace-pre-wrap break-words text-right font-medium tabular-nums text-slate-700 dark:text-slate-200">
                                                                            {item[field.key] === null || item[field.key] === undefined || item[field.key] === ""
                                                                                ? "—"
                                                                                : item[field.key]}
                                                                        </dd>
                                                                    </div>
                                                                ))}
                                                            </dl>
                                                        </section>
                                                    ))}
                                                </div>
                                        </div>
                                    </details>
                                    <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
                                        <Link
                                            href={route(
                                                "be.pokja1.edit",
                                                item.id
                                            )}
                                            aria-label="Edit data Pokja I"
                                            className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
                                        >
                                            <Edit2 size={16} />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDeleteModal(item)
                                            }
                                            aria-label="Hapus data Pokja I"
                                            className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-slate-300 dark:hover:bg-rose-950/50 dark:hover:text-rose-300"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            Belum ada data kegiatan Pokja I. Tambahkan data
                            baru atau import dari Excel.
                        </p>
                    )}
                </div>

                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan <span className="font-bold text-slate-800 dark:text-slate-200">{localPokjas.from ?? 0}</span> sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">{localPokjas.to ?? 0}</span> dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">{localPokjas.total ?? 0}</span> data
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) => setPerPage(parseInt(e.target.value))}
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-3 focus:ring-indigo-500/10 focus:border-indigo-500 block py-1.5 px-3 transition-all outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                    </div>

                    <Pagination links={localPokjas.links} onPageChange={(url) => fetchData(url)} />
                </div>
            </Card>
            )}

            {activeTab === "laporan" && (
            <Card className="rounded-t-none dark:bg-slate-800 dark:border-slate-700">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                    <div className="mb-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                        <FileText size={18} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
                        <div className="text-sm">
                            <p className="font-semibold text-blue-800 dark:text-blue-300">Sheet Laporan Kegiatan Pokja I — Kabupaten</p>
                            <p className="mt-0.5 text-blue-700 dark:text-blue-400">
                                Berisi laporan mobile kategori Pokja I yang masuk ke kabupaten, termasuk Buku Kegiatan Lampiran 4.13
                                ({bukuCount} baris kegiatan) dan laporan numerik (KISAH, KILAS, KRISAN, KIAT, KISAK, PKBN).
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <div className="relative w-full max-w-md">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari judul / kecamatan / desa..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={laporanSearch}
                                onChange={(e) => setLaporanSearch(e.target.value)}
                            />
                        </div>
                        <select
                            value={laporanStatus}
                            onChange={(e) => setLaporanStatus(e.target.value)}
                            className="text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                            aria-label="Filter status laporan"
                        >
                            <option value="">Semua status</option>
                            <option value="pending">Menunggu</option>
                            <option value="reviewed">Sudah Direview</option>
                            <option value="approved">Disetujui</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                        {(laporanSearch || laporanStatus) && (
                            <Button variant="danger" onClick={() => { setLaporanSearch(""); setLaporanStatus(""); }} className="flex items-center gap-2">
                                <RotateCcw size={16} />
                                <span>Reset</span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {isLaporanLoading ? (
                        <p className="px-6 py-10 text-center text-sm text-slate-500">Memuat laporan kegiatan...</p>
                    ) : localLaporan.data?.length > 0 ? (
                        localLaporan.data.map((item: LaporanItem, index: number) => {
                            const st = getStatusBadge(item.status);
                            const buku = isBukuKegiatan(item);
                            const currentPage = localLaporan.current_page ?? 1;
                            const perPageVal = localLaporan.per_page ?? 10;
                            return (
                                <article key={item.id} className="px-5 py-4 sm:px-6">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold tabular-nums text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                                            {(currentPage - 1) * perPageVal + index + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.judul}</h2>
                                                <Badge type={st.type}>{st.label}</Badge>
                                                {buku && <Badge type="info">Buku Kegiatan • Lamp. 4.13</Badge>}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {[item.desa_kelurahan, item.kecamatan].filter(Boolean).join(", ") || "—"}
                                                {" • "}{item.user?.name || item.nama_dasawisma || "—"}
                                                {" • "}{formatTanggal(item.created_at)}
                                            </p>
                                            {item.deskripsi && (
                                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.deskripsi}</p>
                                            )}
                                        </div>
                                        <Link
                                            href={route("be.laporan-kegiatan.show", item.id)}
                                            className="shrink-0 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50 dark:border-slate-600 dark:text-teal-300 dark:hover:bg-teal-950/40"
                                        >
                                            Buka laporan
                                        </Link>
                                    </div>
                                    {buku ? (
                                        <BukuKegiatanSheet rows={item.data_angka?.buku_kegiatan || []} />
                                    ) : (
                                        <details className="group mt-3">
                                            <summary className="list-none cursor-pointer text-xs font-semibold text-teal-700 dark:text-teal-300 [&::-webkit-details-marker]:hidden">
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="group-open:hidden">Lihat rincian angka</span>
                                                    <span className="hidden group-open:inline">Tutup rincian</span>
                                                    <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                                                </span>
                                            </summary>
                                            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                {["kader_umum", "kader_khusus", "kisah_volume", "kisah_sasaran", "kilas_volume", "kilas_sasaran", "krisan_volume", "krisan_sasaran", "kiat_volume", "kiat_sasaran", "kisak_volume", "kisak_sasaran", "pkbn_volume", "pkbn_sasaran"].map((k) => (
                                                    <div key={k} className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/40">
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{k}</p>
                                                        <p className="text-sm font-bold tabular-nums text-slate-700 dark:text-slate-200">{item.data_angka?.[k] ?? 0}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    )}
                                </article>
                            );
                        })
                    ) : (
                        <p className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                            {laporan_loaded
                                ? "Belum ada laporan kegiatan Pokja I untuk filter ini."
                                : "Belum ada laporan kegiatan Pokja I."}
                        </p>
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-50 p-6 dark:border-slate-700">
                    <p className="text-sm text-slate-500">
                        Menampilkan <span className="font-bold text-slate-800">{localLaporan.from ?? 0}</span> sampai{" "}
                        <span className="font-bold text-slate-800">{localLaporan.to ?? 0}</span> dari{" "}
                        <span className="font-bold text-slate-800">{localLaporan.total ?? 0}</span> laporan
                    </p>
                    <Pagination links={localLaporan.links} onPageChange={(url) => fetchLaporanFromUrl(url)} />
                </div>
            </Card>
            )}

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Data Pokja I"
                message="Apakah Anda yakin ingin menghapus data kegiatan Pokja I ini? Data yang dihapus tidak dapat dikembalikan."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
            />

            {/* Modal Import Excel */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 dark:border-slate-700 relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <Upload size={20} className="text-indigo-600" />
                                Import Data Excel Pokja I
                            </h3>
                            <button
                                onClick={closeImportModal}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleImportSubmit} className="space-y-4 pt-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Pilih File Excel (.xlsx, .xls, .csv)
                                </label>

                                {!importData.file ? (
                                    <label
                                        htmlFor="import-file-input"
                                        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl py-8 px-4 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-slate-700/40 transition-colors"
                                    >
                                        <Upload size={22} className="text-slate-400" />
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            Klik untuk memilih file, atau seret file ke sini
                                        </span>
                                        <span className="text-xs text-slate-400">Maks. 2 MB</span>
                                        <input
                                            id="import-file-input"
                                            type="file"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={(e) => setImportData("file", e.target.files[0])}
                                            className="hidden"
                                        />
                                    </label>
                                ) : (
                                    <div className="flex items-center gap-3 border border-slate-200 dark:border-slate-600 rounded-xl p-3">
                                        <FileSpreadsheet size={22} className="text-emerald-600 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                                {importData.file.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {formatFileSize(importData.file.size)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setImportData("file", null)}
                                            className="text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}

                                {importErrors.file && (
                                    <p className="text-xs text-rose-500 mt-1.5">{importErrors.file}</p>
                                )}
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 flex gap-2">
                                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                                <span>
                                    Pastikan file memuat kolom <code className="font-mono">kecamatan</code>,{" "}
                                    <code className="font-mono">kategori</code>, dan kolom angka sesuai template
                                    (PKBN, PKDRT, Pola Asuh, Lansia, Kader Pokja I).
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={closeImportModal}
                                    className="dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={importProcessing || !importData.file}
                                    className="flex items-center gap-2"
                                >
                                    {importProcessing ? "Mengunggah..." : "Upload & Import"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );

    function fetchLaporanFromUrl(url: string) {
        if (!url) return;
        setIsLaporanLoading(true);
        axios
            .get(url, { headers: { Accept: "application/json" } })
            .then((res) => {
                const payload = res.data?.laporan_kegiatan ? res.data.laporan_kegiatan : res.data;
                if (payload && typeof payload === "object" && "data" in payload) setLocalLaporan(payload);
            })
            .catch((err) => console.error("Error fetching laporan page:", err))
            .finally(() => setIsLaporanLoading(false));
    }
}
