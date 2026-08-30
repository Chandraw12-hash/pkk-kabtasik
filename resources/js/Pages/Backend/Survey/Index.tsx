import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Badge from "@/Components/UI/Badge";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    Search,
    Trash2,
    RotateCcw,
    Eye,
    Download,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";

interface Survey {
    id: number;
    nama: string | null;
    email: string | null;
    rating: number;
    saran: string | null;
    status: string;
    ip_address: string | null;
    created_at: string;
    rating_label?: string;
    rating_color?: string;
}

interface Statistik {
    total: number;
    pending?: number;
    published?: number;
    hidden?: number;
    active?: number;
    inactive?: number;
    rata_rata: number;
    rating_5: number;
    rating_4: number;
    rating_3: number;
    rating_2: number;
    rating_1: number;
}

interface IndexProps {
    surveys: PaginatedData<Survey>;
    statistik: Statistik;
    filters?: {
        search?: string;
        status?: string;
        rating?: string;
        per_page?: number | string;
    };
}

const emptyPagination: PaginatedData<Survey> = {
    data: [],
    current_page: 1,
    per_page: 10,
    from: 0,
    to: 0,
    total: 0,
    links: [],
    first_page_url: "",
    last_page_url: "",
    next_page_url: null,
    prev_page_url: null,
    path: "",
    last_page: 1,
};

const getStatusBadge = (status: string) => {
    if (status === "published") {
        return <Badge type="success">Dipublish</Badge>;
    }
    if (status === "pending") {
        return <Badge type="default">Menunggu</Badge>;
    }
    if (status === "hidden") {
        return <Badge type="warning">Disembunyikan</Badge>;
    }
    if (status === "active") {
        return <Badge type="default">Aktif (lama)</Badge>;
    }
    return <Badge type="default">{status || "-"}</Badge>;
};

const getRatingStars = (rating: number) => {
    const r = Math.min(5, Math.max(0, Number(rating) || 0));
    return "★".repeat(r) + "☆".repeat(5 - r);
};

const ratingLabel = (rating: number) => {
    const map: Record<number, string> = {
        5: "Sangat Puas",
        4: "Puas",
        3: "Cukup",
        2: "Tidak Puas",
        1: "Sangat Tidak Puas",
    };
    return map[rating] || "-";
};

export default function Index({
    surveys,
    statistik,
    filters = {},
}: IndexProps) {
    const { auth } = usePage<any>().props;
    const permissions: string[] = auth?.permissions || [];

    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [ratingFilter, setRatingFilter] = useState(filters.rating || "");
    const [perPage, setPerPage] = useState<number>(
        Number(filters.per_page) || 10
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Survey | null>(null);

    const [localData, setLocalData] = useState<PaginatedData<Survey>>(
        surveys?.data ? surveys : emptyPagination
    );
    const [localStatistik, setLocalStatistik] = useState<Statistik>(
        statistik || {
            total: 0,
            rata_rata: 0,
            rating_5: 0,
            rating_4: 0,
            rating_3: 0,
            rating_2: 0,
            rating_1: 0,
        }
    );
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const { delete: destroy, processing } = useForm({});

    useEffect(() => {
        if (surveys?.data) setLocalData(surveys);
        if (statistik) setLocalStatistik(statistik);
    }, [surveys, statistik]);

    const fetchData = (url?: string) => {
        setIsLoading(true);
        const target = url || route("be.survey.index");
        const params = url
            ? {}
            : {
                  search: search || undefined,
                  status: statusFilter || undefined,
                  rating: ratingFilter || undefined,
                  per_page: perPage,
              };

        axios
            .get(target, {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalData(res.data);
                    if (res.data.statistik) {
                        setLocalStatistik(res.data.statistik);
                    }
                }
            })
            .catch((err) => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => fetchData(), 350);
        return () => clearTimeout(timeout);
    }, [search, statusFilter, ratingFilter, perPage]);

    /** Publish ke beranda / tarik dari beranda */
    const setStatus = (item: Survey, nextStatus: "published" | "hidden" | "pending") => {
        axios
            .patch(route("be.survey.toggle-status", item.id), {
                status: nextStatus,
            })
            .then(() => fetchData())
            .catch((err) => console.error("Error update status:", err));
    };

    const openDeleteModal = (item: Survey) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedItem) return;
        destroy(route("be.survey.destroy", selectedItem.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedItem(null);
                fetchData();
            },
        });
    };

    const handleReset = () => {
        setSearch("");
        setStatusFilter("");
        setRatingFilter("");
        setPerPage(10);
    };

    const handlePageChange = (url: string | null) => {
        if (!url) return;
        fetchData(url);
    };

    const handleExport = () => {
        window.open(
            route("be.survey.export", {
                status: statusFilter || undefined,
                rating: ratingFilter || undefined,
            }),
            "_blank"
        );
    };

    const publishedCount =
        localStatistik.published ?? localStatistik.active ?? 0;
    const pendingCount =
        localStatistik.pending ?? localStatistik.inactive ?? 0;

    return (
        <MainLayout>
            <Head title="Survey Kepuasan Masyarakat" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-200">
                        Survey Kepuasan Masyarakat
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Kelola jawaban survey — publish agar tampil di beranda
                    </p>
                </div>
                <Button
                    variant="secondary"
                    onClick={handleExport}
                    className="flex items-center gap-2"
                >
                    <Download size={16} />
                    <span>Export CSV</span>
                </Button>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                <Card className="p-4 dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                        Total
                    </p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {localStatistik.total ?? 0}
                    </p>
                </Card>
                <Card className="p-4 border-l-4 border-l-green-500 dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                        Dipublish
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                        {publishedCount}
                    </p>
                </Card>
                <Card className="p-4 border-l-4 border-l-gray-500 dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                        Menunggu
                    </p>
                    <p className="text-2xl font-bold text-gray-600">
                        {pendingCount}
                    </p>
                </Card>
                <Card className="p-4 border-l-4 border-l-yellow-500 dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                        Rata-rata
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {localStatistik.rata_rata ?? 0}
                    </p>
                </Card>
                <Card className="p-4 border-l-4 border-l-teal-500 dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                        ⭐ 5
                    </p>
                    <p className="text-2xl font-bold text-teal-600">
                        {localStatistik.rating_5 ?? 0}
                    </p>
                </Card>
                <Card className="p-4 border-l-4 border-l-red-500 dark:bg-slate-800 dark:border-slate-700">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                        ⭐ 1
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                        {localStatistik.rating_1 ?? 0}
                    </p>
                </Card>
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative flex-1 min-w-[180px] max-w-md">
                            <TextInput
                                iconLeft={<Search size={18} />}
                                placeholder="Cari nama, email, atau saran..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                containerClassName="relative w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Menunggu</option>
                            <option value="published">Dipublish</option>
                            <option value="hidden">Disembunyikan</option>
                        </select>

                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="text-sm rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 outline-none"
                        >
                            <option value="">Semua Rating</option>
                            <option value="5">⭐ 5 - Sangat Puas</option>
                            <option value="4">⭐ 4 - Puas</option>
                            <option value="3">⭐ 3 - Cukup</option>
                            <option value="2">⭐ 2 - Tidak Puas</option>
                            <option value="1">⭐ 1 - Sangat Tidak Puas</option>
                        </select>

                        {(search ||
                            statusFilter ||
                            ratingFilter ||
                            perPage !== 10) && (
                            <Button
                                variant="secondary"
                                onClick={handleReset}
                                className="flex items-center gap-2"
                            >
                                <RotateCcw size={16} />
                                <span>Reset</span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table
                        isLoading={isLoading}
                        columns={[
                            {
                                header: "#",
                                className:
                                    "text-center text-sm font-medium text-slate-400 w-14",
                                headerClassName: "text-center w-14",
                                render: (_: Survey, index: number) => {
                                    const currentPage =
                                        localData.current_page ?? 1;
                                    const perPageVal =
                                        localData.per_page ?? 10;
                                    return (
                                        (currentPage - 1) * perPageVal +
                                        index +
                                        1
                                    );
                                },
                            },
                            {
                                header: "Responden",
                                render: (item: Survey) => (
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                            {item.nama || "Anonim"}
                                        </p>
                                        {item.email && (
                                            <p className="text-xs text-slate-400">
                                                {item.email}
                                            </p>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                header: "Rating",
                                className: "text-center w-36",
                                headerClassName: "text-center",
                                render: (item: Survey) => (
                                    <div>
                                        <p className="text-lg font-bold text-yellow-500">
                                            {getRatingStars(item.rating)}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {item.rating_label ||
                                                ratingLabel(item.rating)}
                                        </p>
                                    </div>
                                ),
                            },
                            {
                                header: "Saran",
                                className: "min-w-[160px]",
                                render: (item: Survey) => (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                                        {item.saran || "-"}
                                    </p>
                                ),
                            },
                            {
                                header: "Status",
                                className: "text-center w-32",
                                headerClassName: "text-center",
                                render: (item: Survey) =>
                                    getStatusBadge(item.status),
                            },
                            {
                                header: "Tanggal",
                                className: "w-36",
                                render: (item: Survey) => (
                                    <span className="text-sm text-slate-500">
                                        {new Date(
                                            item.created_at
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                ),
                            },
                            {
                                header: "Aksi",
                                headerClassName: "text-center w-40",
                                className: "text-center w-40",
                                render: (item: Survey) => (
                                    <div className="flex items-center justify-center gap-1">
                                        <Link
                                            href={route(
                                                "be.survey.show",
                                                item.id
                                            )}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="Detail"
                                        >
                                            <Eye size={15} />
                                        </Link>

                                        {item.status !== "published" ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setStatus(
                                                        item,
                                                        "published"
                                                    )
                                                }
                                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                title="Publish ke beranda"
                                            >
                                                <CheckCircle size={15} />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setStatus(item, "hidden")
                                                }
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                title="Tarik dari beranda"
                                            >
                                                <XCircle size={15} />
                                            </button>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDeleteModal(item)
                                            }
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            title="Hapus"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        data={localData.data || []}
                    />
                </div>

                <div className="p-6 border-t border-slate-50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20 dark:bg-slate-700/20">
                    <p className="text-sm text-slate-500 dark:text-slate-200">
                        Menampilkan{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localData.from ?? 0}
                        </span>{" "}
                        sampai{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localData.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                            {localData.total ?? 0}
                        </span>{" "}
                        data
                    </p>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                        <span>Tampilkan</span>
                        <select
                            value={perPage}
                            onChange={(e) =>
                                setPerPage(parseInt(e.target.value, 10))
                            }
                            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 block py-1.5 px-3 outline-none dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <Pagination
                        links={localData.links || []}
                        onPageChange={handlePageChange}
                    />
                </div>
            </Card>

            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Data Survey"
                message={
                    selectedItem
                        ? `Hapus survey dari "${selectedItem.nama || "Anonim"}"? Data tidak dapat dikembalikan.`
                        : "Hapus data survey ini?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                }}
            />
        </MainLayout>
    );
}
