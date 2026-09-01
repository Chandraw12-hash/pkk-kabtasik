import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import {
    Search,
    Trash2,
    RotateCcw,
    ClipboardList,
    Eye,
    XCircle,
    ThumbsUp,
    ThumbsDown,
    CheckCircle2,
    AlertTriangle,
    X,
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
}

interface FlashProps {
    success?: string;
    warning?: string;
    error?: string;
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

// ============================================================
// TOAST NOTIFICATION
// Menampilkan flash message dari Laravel (success/warning/error)
// yang sebelumnya dikirim server tapi tidak pernah ditampilkan.
// ============================================================
function FlashToast() {
    const { props } = usePage<{ flash?: FlashProps }>();
    const flash = props.flash || {};

    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<{
        type: "success" | "warning" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        const message = flash.success || flash.warning || flash.error;
        if (!message) return;

        const type = flash.success
            ? "success"
            : flash.warning
            ? "warning"
            : "error";

        setCurrent({ type, message });
        setVisible(true);

        const timer = setTimeout(() => setVisible(false), 5000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash.success, flash.warning, flash.error]);

    if (!current) return null;

    const styles = {
        success: {
            bg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/40 dark:border-emerald-700",
            text: "text-emerald-700 dark:text-emerald-200",
            icon: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
        },
        warning: {
            bg: "bg-amber-50 border-amber-200 dark:bg-amber-900/40 dark:border-amber-700",
            text: "text-amber-700 dark:text-amber-200",
            icon: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
        },
        error: {
            bg: "bg-rose-50 border-rose-200 dark:bg-rose-900/40 dark:border-rose-700",
            text: "text-rose-700 dark:text-rose-200",
            icon: <AlertTriangle size={18} className="text-rose-500 shrink-0" />,
        },
    }[current.type];

    return (
        <div
            className={`fixed top-5 right-5 z-[200] max-w-sm w-full border rounded-2xl shadow-lg px-4 py-3 flex items-start gap-3 transition-all duration-300 ease-in-out ${
                styles.bg
            } ${
                visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
            {styles.icon}
            <p className={`text-sm leading-relaxed flex-1 ${styles.text}`}>
                {current.message}
            </p>
            <button
                onClick={() => setVisible(false)}
                className={`shrink-0 hover:opacity-70 ${styles.text}`}
            >
                <X size={16} />
            </button>
        </div>
    );
}

export default function Index({ laporans, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [pokja, setPokja] = useState(filters.pokja || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [local, setLocal] = useState(laporans);
    const [isLoading, setIsLoading] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState<Laporan | null>(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [actionTarget, setActionTarget] = useState<Laporan | null>(null);
    const first = useRef(true);

    const { delete: destroy, processing, post } = useForm({});

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

    const handleDelete = () => {
        if (!selected) return;
        destroy(route("be.laporan-kegiatan.destroy", selected.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDelete(false);
                setSelected(null);
                fetchData(route("be.laporan-kegiatan.index"), {
                    search: search || undefined,
                    status: status || undefined,
                    pokja: pokja || undefined,
                    per_page: perPage,
                });
            },
        });
    };

    const handleApprove = (item: Laporan) => {
        setActionTarget(item);
        setShowApproveModal(true);
    };

    const handleReject = (item: Laporan) => {
        setActionTarget(item);
        setShowRejectModal(true);
    };

    const confirmApprove = () => {
        if (!actionTarget) return;
        router.patch(
            route("be.laporan-kegiatan.approve", actionTarget.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowApproveModal(false);
                    setActionTarget(null);
                    refreshData();
                },
            }
        );
    };

    const confirmReject = () => {
        if (!actionTarget) return;
        router.patch(
            route("be.laporan-kegiatan.reject", actionTarget.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowRejectModal(false);
                    setActionTarget(null);
                    refreshData();
                },
            }
        );
    };

    const refreshData = () => {
        fetchData(route("be.laporan-kegiatan.index"), {
            search: search || undefined,
            status: status || undefined,
            pokja: pokja || undefined,
            per_page: perPage,
        });
    };

    const rows = local.data || [];

    // Status options untuk filter
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

            <FlashToast />

            <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Laporan Kegiatan
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Kotak masuk laporan dari kader / dasawisma (aplikasi mobile)
                </p>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col lg:flex-row gap-3">
                    <div className="w-full lg:max-w-xs">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari judul, wilayah, dasawisma..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full dark:bg-slate-700 dark:border-slate-600"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm px-3 py-2.5"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={pokja}
                        onChange={(e) => setPokja(e.target.value)}
                        className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm px-3 py-2.5"
                    >
                        <option value="">Semua Pokja</option>
                        <option value="I">Pokja I</option>
                        <option value="II">Pokja II</option>
                        <option value="III">Pokja III</option>
                        <option value="IV">Pokja IV</option>
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
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
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
                            className: "text-center w-24",
                            headerClassName: "text-center",
                            render: (item: Laporan) => (
                                <Badge type="info">
                                    Pokja {item.kategori_pokja}
                                </Badge>
                            ),
                        },
                        {
                            header: "Wilayah",
                            render: (item: Laporan) => (
                                <div className="text-sm text-slate-600 dark:text-slate-300">
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

                                    {/* Tombol Approve - hanya untuk pending */}
                                    {item.status === "pending" && (
                                        <button
                                            type="button"
                                            onClick={() => handleApprove(item)}
                                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                            title="Setujui"
                                        >
                                            <ThumbsUp size={15} />
                                        </button>
                                    )}

                                    {/* Tombol Reject - hanya untuk pending */}
                                    {item.status === "pending" && (
                                        <button
                                            type="button"
                                            onClick={() => handleReject(item)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Tolak"
                                        >
                                            <ThumbsDown size={15} />
                                        </button>
                                    )}

                                    {/* Tombol Hapus */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelected(item);
                                            setShowDelete(true);
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

                <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        {local.from ?? 0}–{local.to ?? 0} dari {local.total ?? 0}
                    </p>
                    <div className="flex items-center gap-3">
                        <select
                            value={perPage}
                            onChange={(e) =>
                                setPerPage(parseInt(e.target.value, 10))
                            }
                            className="rounded-lg border border-slate-200 text-sm px-2 py-1.5 dark:bg-slate-700 dark:border-slate-600"
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

            {/* Modal Konfirmasi Hapus */}
            <ConfirmationModal
                show={showDelete}
                processing={processing}
                title="Hapus Laporan"
                message={
                    selected
                        ? `Hapus laporan "${selected.judul}"?`
                        : "Hapus laporan ini?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDelete(false);
                    setSelected(null);
                }}
            />

            {/* Modal Konfirmasi Approve */}
            <ConfirmationModal
                show={showApproveModal}
                processing={false}
                title="Setujui Laporan"
                message={
                    actionTarget
                        ? `Anda yakin ingin menyetujui laporan "${actionTarget.judul}"? Data akan masuk ke statistik Pokja ${actionTarget.kategori_pokja}.`
                        : "Setujui laporan ini?"
                }
                onConfirm={confirmApprove}
                onCancel={() => {
                    setShowApproveModal(false);
                    setActionTarget(null);
                }}
                confirmText="Setujui"
                cancelText="Batal"
                confirmVariant="success"
            />

            {/* Modal Konfirmasi Reject */}
            <ConfirmationModal
                show={showRejectModal}
                processing={false}
                title="Tolak Laporan"
                message={
                    actionTarget
                        ? `Anda yakin ingin menolak laporan "${actionTarget.judul}"?`
                        : "Tolak laporan ini?"
                }
                onConfirm={confirmReject}
                onCancel={() => {
                    setShowRejectModal(false);
                    setActionTarget(null);
                }}
                confirmText="Tolak"
                cancelText="Batal"
                confirmVariant="danger"
            />
        </MainLayout>
    );
}
