import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import {
    Search,
    Trash2,
    RotateCcw,
    ClipboardList,
    Eye,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";
import axios from "axios";

interface Laporan {
    id: number;
    judul: string;
    deskripsi?: string | null;
    kategori_pokja: string;
    kecamatan?: string | null;
    desa_kelurahan?: string | null;
    nama_dasawisma?: string | null;
    status: string;
    foto_url?: string | null;
    created_at?: string;
    user?: { id: number; name: string } | null;
    reviewer?: { id: number; name: string } | null;
    reviewed_at?: string | null;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: any[];
    last_page: number;
}

interface Props {
    laporans: Paginated<Laporan>;
    filters?: {
        search?: string;
        status?: string;
        pokja?: string;
        per_page?: number | string;
    };
    pendingCount?: number;
    approvedCount?: number;
    rejectedCount?: number;
    reviewedCount?: number;
    totalCount?: number;
}

const formatTanggal = (d?: string) => {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return "—";
    }
};

const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; type: "default" | "success" | "warning" | "danger" | "info" }> = {
        pending: { label: "Menunggu", type: "warning" },
        reviewed: { label: "Sudah Direview", type: "info" },
        approved: { label: "Disetujui ✅", type: "success" },
        rejected: { label: "Ditolak ❌", type: "danger" },
    };
    return statusMap[status] || { label: status, type: "default" };
};

// ✅ BARU: mapping kategori_pokja → label rapi
const getPokjaLabel = (kategori: string): string => {
    const map: Record<string, string> = {
        'I': 'Pokja I',
        'II': 'Pokja II',
        'III': 'Pokja III',
        'IV': 'Pokja IV',
        'IV-PYD': 'Kunjungan PYD',
        'IV-POSYANDU': 'Kegiatan Posyandu',
        'IV-REKAP': 'Rekapitulasi',
        'SEKRETARIAT': 'Sekretariat',
    };
    return map[kategori] || `Pokja ${kategori}`;
};

// ✅ BARU: warna badge per kategori
const getPokjaBadgeType = (kategori: string): "default" | "success" | "warning" | "danger" | "info" => {
    if (kategori === 'IV-PYD') return 'info';
    if (kategori === 'IV-POSYANDU') return 'success';
    if (kategori === 'IV-REKAP') return 'warning';
    return 'info';
};

export default function Index({
    laporans,
    filters = {},
    pendingCount = 0,
    approvedCount = 0,
    rejectedCount = 0,
    reviewedCount = 0,
    totalCount = 0,
}: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [pokja, setPokja] = useState(filters.pokja || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [local, setLocal] = useState(laporans);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState<Laporan | null>(null);
    const first = useRef(true);

    const { delete: destroy, processing } = useForm({});

    useEffect(() => {
        if (laporans?.data) setLocal(laporans);
    }, [laporans]);

    const fetchData = (url: string, params: Record<string, unknown> = {}) => {
        setIsLoading(true);
        axios
            .get(url, {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data?.data) setLocal(res.data);
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        const t = setTimeout(() => {
            fetchData(route("be.laporan-kegiatan.index"), {
                search: search || undefined,
                status: status || undefined,
                pokja: pokja || undefined,
                per_page: perPage,
            });
        }, 350);
        return () => clearTimeout(t);
    }, [search, status, pokja, perPage]);

    const refreshData = () => {
        fetchData(route("be.laporan-kegiatan.index"), {
            search: search || undefined,
            status: status || undefined,
            pokja: pokja || undefined,
            per_page: perPage,
        });
    };

    // 🔥 SWEETALERT - DELETE
    const handleDelete = () => {
        if (!selected) return;
        Swal.fire({
            title: "Hapus Laporan?",
            text: `Yakin ingin menghapus laporan "${selected.judul}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route("be.laporan-kegiatan.destroy", selected.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSelected(null);
                        refreshData();
                        Swal.fire({
                            title: "Terhapus!",
                            text: "Laporan berhasil dihapus.",
                            icon: "success",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                    },
                });
            }
        });
    };

    // 🔥 SWEETALERT - APPROVE
    const handleApprove = (item: Laporan) => {
        Swal.fire({
            title: "Setujui Laporan?",
            html: `
                <p>Anda yakin ingin menyetujui laporan:</p>
                <p class="font-bold text-teal-600">"${item.judul}"</p>
                <p class="text-sm text-slate-500">Data akan masuk ke statistik ${getPokjaLabel(item.kategori_pokja)}</p>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "✅ Setujui",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(
                    route("be.laporan-kegiatan.approve", item.id),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            refreshData();
                            Swal.fire({
                                title: "Disetujui!",
                                text: "Laporan berhasil disetujui dan data masuk ke statistik Pokja.",
                                icon: "success",
                                timer: 2500,
                                showConfirmButton: false,
                            });
                        },
                        onError: () => {
                            Swal.fire({
                                title: "Gagal!",
                                text: "Terjadi kesalahan saat menyetujui laporan.",
                                icon: "error",
                                timer: 2000,
                                showConfirmButton: false,
                            });
                        },
                    }
                );
            }
        });
    };

    // 🔥 SWEETALERT - REJECT
    const handleReject = (item: Laporan) => {
        Swal.fire({
            title: "Tolak Laporan?",
            html: `
                <p>Anda yakin ingin menolak laporan:</p>
                <p class="font-bold text-rose-600">"${item.judul}"</p>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "❌ Tolak",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.patch(
                    route("be.laporan-kegiatan.reject", item.id),
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            refreshData();
                            Swal.fire({
                                title: "Ditolak!",
                                text: "Laporan berhasil ditolak.",
                                icon: "error",
                                timer: 2000,
                                showConfirmButton: false,
                            });
                        },
                    }
                );
            }
        });
    };

    const rows = local.data || [];

    const statusOptions = [
        { value: "", label: "Semua status" },
        { value: "pending", label: "Menunggu" },
        { value: "reviewed", label: "Sudah Direview" },
        { value: "approved", label: "Disetujui" },
        { value: "rejected", label: "Ditolak" },
    ];

    return (
        <MainLayout>
            <Head title="Laporan Kegiatan" />

            {/* ─── HEADER ─── */}
            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                    Laporan Kegiatan
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Kotak masuk laporan dari kader / dasawisma (aplikasi mobile)
                </p>
            </div>

            {/* ─── STATISTIK ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <p className="text-2xl font-bold text-slate-700">{totalCount}</p>
                    <p className="text-xs text-slate-400">Total</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                    <p className="text-xs text-slate-400">Menunggu</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
                    <p className="text-xs text-slate-400">Disetujui</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <p className="text-2xl font-bold text-rose-600">{rejectedCount}</p>
                    <p className="text-xs text-slate-400">Ditolak</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{reviewedCount}</p>
                    <p className="text-xs text-slate-400">Direview</p>
                </div>
            </div>

            {/* ─── FILTER ─── */}
            <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row gap-3">
                    <div className="w-full lg:max-w-xs">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari judul, wilayah, dasawisma..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white text-sm px-3 py-2.5"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {/* ✅ UPDATE: filter Pokja — tambah 3 sheet baru */}
                    <select
                        value={pokja}
                        onChange={(e) => setPokja(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white text-sm px-3 py-2.5"
                    >
                        <option value="">Semua Pokja</option>
                        <optgroup label="Pokja Utama">
                            <option value="I">Pokja I</option>
                            <option value="II">Pokja II</option>
                            <option value="III">Pokja III</option>
                            <option value="IV">Pokja IV</option>
                        </optgroup>
                        <optgroup label="Pokja IV — Sheet">
                            <option value="IV-PYD">Kunjungan PYD</option>
                            <option value="IV-POSYANDU">Kegiatan Posyandu</option>
                            <option value="IV-REKAP">Rekapitulasi</option>
                        </optgroup>
                    </select>
                    {(search || status || pokja) && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                setPokja("");
                            }}
                            className="inline-flex items-center gap-2"
                        >
                            <RotateCcw size={15} /> Reset
                        </Button>
                    )}
                </div>

                {/* ─── TABLE ─── */}
                <Table
                    isLoading={isLoading}
                    columns={[
                        {
                            header: "#",
                            className: "w-12 text-center text-slate-400 text-sm",
                            headerClassName: "text-center w-12",
                            render: (_: Laporan, i: number) =>
                                ((local.current_page ?? 1) - 1) *
                                    (local.per_page ?? 10) +
                                i +
                                1,
                        },
                        {
                            header: "Laporan",
                            render: (item: Laporan) => (
                                <div className="min-w-0 py-0.5">
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {item.judul}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {item.nama_dasawisma ||
                                            item.user?.name ||
                                            "—"}{" "}
                                        · {formatTanggal(item.created_at)}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            header: "Pokja",
                            className: "text-center w-40",
                            headerClassName: "text-center",
                            render: (item: Laporan) => (
                                <Badge type={getPokjaBadgeType(item.kategori_pokja)}>
                                    {getPokjaLabel(item.kategori_pokja)}
                                </Badge>
                            ),
                        },
                        {
                            header: "Wilayah",
                            render: (item: Laporan) => (
                                <div className="text-sm text-slate-600">
                                    <p>{item.kecamatan || "—"}</p>
                                    {item.desa_kelurahan && (
                                        <p className="text-xs text-slate-400">
                                            {item.desa_kelurahan}
                                        </p>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Status",
                            className: "text-center w-32",
                            headerClassName: "text-center",
                            render: (item: Laporan) => {
                                const statusInfo = getStatusBadge(item.status);
                                return (
                                    <Badge type={statusInfo.type}>
                                        {statusInfo.label}
                                    </Badge>
                                );
                            },
                        },
                        {
                            header: "Aksi",
                            className: "text-center w-52",
                            headerClassName: "text-center",
                            render: (item: Laporan) => (
                                <div className="flex items-center justify-center gap-1">
                                    <Link
                                        href={route(
                                            "be.laporan-kegiatan.show",
                                            item.id
                                        )}
                                        className="p-2 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg"
                                        title="Detail"
                                    >
                                        <Eye size={15} />
                                    </Link>

                                    {item.status === "pending" && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleApprove(item)}
                                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                                title="Setujui"
                                            >
                                                <ThumbsUp size={15} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleReject(item)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Tolak"
                                            >
                                                <ThumbsDown size={15} />
                                            </button>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelected(item);
                                            // Langsung panggil handleDelete, tapi tunggu state setSelected
                                            setTimeout(() => handleDelete(), 100);
                                        }}
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                        title="Hapus"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={rows}
                />

                {!isLoading && rows.length === 0 && (
                    <div className="py-14 text-center">
                        <ClipboardList
                            size={36}
                            className="mx-auto text-slate-300 mb-3"
                        />
                        <p className="text-sm text-slate-500">
                            Belum ada laporan masuk.
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Laporan akan muncul setelah kader mengirim dari
                            aplikasi mobile.
                        </p>
                    </div>
                )}

                {/* ─── PAGINATION ─── */}
                <div className="px-4 py-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        {local.from ?? 0}–{local.to ?? 0} dari {local.total ?? 0}
                    </p>
                    <div className="flex items-center gap-3">
                        <select
                            value={perPage}
                            onChange={(e) =>
                                setPerPage(parseInt(e.target.value, 10))
                            }
                            className="rounded-lg border border-slate-200 text-sm px-2 py-1.5"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <Pagination
                            links={local.links || []}
                            onPageChange={(url: string) => url && fetchData(url)}
                        />
                    </div>
                </div>
            </Card>
        </MainLayout>
    );
}
