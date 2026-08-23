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
    CheckCircle,
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

export default function Index({ laporans, filters = {} }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "");
    const [pokja, setPokja] = useState(filters.pokja || "");
    const [perPage, setPerPage] = useState(Number(filters.per_page) || 10);
    const [local, setLocal] = useState(laporans);
    const [isLoading, setIsLoading] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState<Laporan | null>(null);
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

    const markReviewed = (item: Laporan) => {
        router.patch(
            route("be.laporan-kegiatan.review", item.id),
            {},
            { preserveScroll: true }
        );
    };

    const rows = local.data || [];

    return (
        <MainLayout>
            <Head title="Laporan Kegiatan" />

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
                        <option value="">Semua status</option>
                        <option value="pending">Belum direview</option>
                        <option value="reviewed">Sudah direview</option>
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
                            render: (item: Laporan) => (
                                <Badge
                                    type={
                                        item.status === "reviewed"
                                            ? "success"
                                            : "default"
                                    }
                                >
                                    {item.status === "reviewed"
                                        ? "Direview"
                                        : "Baru"}
                                </Badge>
                            ),
                        },
                        {
                            header: "Aksi",
                            className: "text-center w-36",
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
                                    {item.status !== "reviewed" && (
                                        <button
                                            type="button"
                                            onClick={() => markReviewed(item)}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                            title="Tandai direview"
                                        >
                                            <CheckCircle size={15} />
                                        </button>
                                    )}
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

            <ConfirmationModal
                show={showDelete}
                processing={processing}
                title="Hapus Laporan"
                message={
                    selected
                        ? `Hapus laporan “${selected.judul}”?`
                        : "Hapus laporan ini?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDelete(false);
                    setSelected(null);
                }}
            />
        </MainLayout>
    );
}
