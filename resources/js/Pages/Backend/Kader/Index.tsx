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
    Edit2,
    Trash2,
    RotateCcw,
    Users,
    Phone,
    UserPlus,
    Download,
} from "lucide-react";
import { PaginatedData } from "@/types/model";
import axios from "axios";

interface Kader {
    id: number;
    nama: string;
    nik: string | null;
    jabatan: string;
    pokja: string | null;
    kecamatan: string | null;
    desa_kelurahan: string | null;
    no_hp: string | null;
    status_aktif: boolean;
    user_id?: number | null;
    user?: { id: number; username: string } | null;
}

interface KaderStats {
    total: number;
    aktif: number;
    per_pokja: Record<string, number>;
}

interface IndexProps {
    kaders: PaginatedData<Kader>;
    filters?: {
        search?: string;
        pokja?: string;
        per_page?: number | string;
    };
    stats?: KaderStats;
}

const POKJA_FILTERS = [
    { value: "", label: "Semua Pokja" },
    { value: "I", label: "Pokja I" },
    { value: "II", label: "Pokja II" },
    { value: "III", label: "Pokja III" },
    { value: "IV", label: "Pokja IV" },
    { value: "DASAWISMA", label: "Dasawisma" },
];

const emptyPagination: PaginatedData<Kader> = {
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

export default function Index({ kaders, filters = {}, stats }: IndexProps) {
    const { auth } = usePage<any>().props;
    const permissions: string[] = auth?.permissions || [];
    const roles: string[] = auth?.roles || [];
    const isSuperAdmin = roles.includes("super-admin");

    const canEdit = permissions.includes("edit-kader");
    const canDelete = permissions.includes("delete-kader");

    const [search, setSearch] = useState(filters.search || "");
    const [pokja, setPokja] = useState(filters.pokja || "");
    const [perPage, setPerPage] = useState<number>(
        Number(filters.per_page) || 10
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedKader, setSelectedKader] = useState<Kader | null>(null);
    const [localKaders, setLocalKaders] = useState<PaginatedData<Kader>>(
        kaders?.data ? kaders : emptyPagination
    );
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    const { delete: destroy, processing } = useForm({});

    useEffect(() => {
        if (kaders?.data) setLocalKaders(kaders);
    }, [kaders]);

    const fetchData = (url: string, params: Record<string, unknown> = {}) => {
        setIsLoading(true);
        axios
            .get(url, {
                params,
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data && typeof res.data === "object" && "data" in res.data) {
                    setLocalKaders(res.data);
                }
            })
            .catch((err) => console.error("Gagal memuat data kader:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const timeout = setTimeout(() => {
            fetchData(route("be.kader.index"), {
                search: search || undefined,
                pokja: pokja || undefined,
                per_page: perPage,
            });
        }, 350);
        return () => clearTimeout(timeout);
    }, [search, perPage, pokja]);

    const openDeleteModal = (kader: Kader) => {
        setSelectedKader(kader);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedKader) return;
        destroy(route("be.kader.destroy", selectedKader.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedKader(null);
                fetchData(route("be.kader.index"), {
                    search: search || undefined,
                    pokja: pokja || undefined,
                    per_page: perPage,
                });
            },
        });
    };

    const handleReset = () => {
        setSearch("");
        setPokja("");
        setPerPage(10);
    };

    const rows = localKaders.data || [];
    const hasFilter = Boolean(search) || Boolean(pokja) || perPage !== 10;

    const summary: KaderStats = stats || { total: 0, aktif: 0, per_pokja: {} };
    const perPokja = summary.per_pokja || {};
    const statCards = [
        { key: "", label: "Total Kader", count: summary.total, sub: `${summary.aktif} aktif` },
        { key: "DASAWISMA", label: "Dasawisma", count: Number(perPokja["DASAWISMA"]) || 0 },
        { key: "I", label: "Pokja I", count: Number(perPokja["I"]) || 0 },
        { key: "II", label: "Pokja II", count: Number(perPokja["II"]) || 0 },
        { key: "III", label: "Pokja III", count: Number(perPokja["III"]) || 0 },
        { key: "IV", label: "Pokja IV", count: Number(perPokja["IV"]) || 0 },
    ];

    return (
        <MainLayout>
            <Head title="Data Kader PKK" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight dark:text-slate-100">
                        Data Kader PKK
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Terisi otomatis dari akun pengguna — kader lapor ke
                        super-admin untuk dibuatkan akun
                    </p>
                </div>
            </div>

            {/* Ringkasan + filter cepat per pokja (klik kartu = filter) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
                {statCards.map((c) => {
                    const active = pokja === c.key;
                    return (
                        <button
                            key={c.key || "total"}
                            type="button"
                            onClick={() => setPokja(c.key)}
                            className={`text-left rounded-xl border p-3 transition-colors ${
                                active
                                    ? "border-teal-500 ring-1 ring-teal-500 bg-teal-50/60 dark:bg-teal-900/20"
                                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700"
                            }`}
                        >
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                {c.count}
                            </p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                                {c.label}
                            </p>
                            {c.sub && (
                                <p className="text-[11px] text-teal-600 dark:text-teal-400">
                                    {c.sub}
                                </p>
                            )}
                        </button>
                    );
                })}
            </div>

            <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative w-full sm:max-w-sm">
                        <TextInput
                            iconLeft={<Search size={18} />}
                            placeholder="Cari nama, kecamatan, atau desa..."
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                            containerClassName="relative w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={pokja}
                        onChange={(e) => setPokja(e.target.value)}
                        className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shrink-0"
                    >
                        {POKJA_FILTERS.map((o) => (
                            <option key={o.value || "all"} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>

                    <a
                        href={route("be.kader.export", {
                            search: search || undefined,
                            pokja: pokja || undefined,
                        })}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shrink-0"
                    >
                        <Download size={15} />
                        Export
                    </a>

                    {hasFilter && (
                        <Button
                            variant="secondary"
                            onClick={handleReset}
                            className="inline-flex items-center gap-2 shrink-0"
                        >
                            <RotateCcw size={15} />
                            Reset
                        </Button>
                    )}

                    <p className="text-xs text-slate-400 sm:ml-auto">
                        {localKaders.total ?? 0} kader
                    </p>
                </div>

                <Table
                    isLoading={isLoading}
                    columns={[
                        {
                            header: "#",
                            className: "text-center w-14 text-sm text-slate-400",
                            headerClassName: "text-center w-14",
                            render: (_: Kader, index: number) => {
                                const page = localKaders.current_page ?? 1;
                                const size = localKaders.per_page ?? 10;
                                return (page - 1) * size + index + 1;
                            },
                        },
                        {
                            header: "Kader",
                            className: "min-w-[200px]",
                            render: (kader: Kader) => (
                                <div className="flex items-center gap-3 py-0.5">
                                    <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 flex items-center justify-center text-xs font-bold border border-teal-100 dark:border-teal-800 shrink-0 uppercase">
                                        {(kader.nama || "??")
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                            {kader.nama}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            {kader.jabatan || "—"}
                                        </p>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            header: "Pokja",
                            className: "text-center w-28",
                            headerClassName: "text-center w-28",
                            render: (kader: Kader) => (
                                <div className="flex justify-center">
                                    {kader.pokja ? (
                                        <Badge
                                            type={
                                                kader.pokja === "DASAWISMA"
                                                    ? "success"
                                                    : "info"
                                            }
                                        >
                                            {kader.pokja === "DASAWISMA"
                                                ? "Dasawisma"
                                                : `Pokja ${kader.pokja}`}
                                        </Badge>
                                    ) : (
                                        <span className="text-xs text-slate-400">
                                            —
                                        </span>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Wilayah",
                            className: "min-w-[140px]",
                            render: (kader: Kader) => (
                                <div className="min-w-0">
                                    <p className="text-sm text-slate-700 dark:text-slate-200 truncate">
                                        {kader.kecamatan || "—"}
                                    </p>
                                    {kader.desa_kelurahan && (
                                        <p className="text-xs text-slate-400 truncate">
                                            {kader.desa_kelurahan}
                                        </p>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Kontak",
                            className: "w-36",
                            render: (kader: Kader) =>
                                kader.no_hp ? (
                                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                                        <Phone
                                            size={13}
                                            className="text-slate-400 shrink-0"
                                        />
                                        {kader.no_hp}
                                    </span>
                                ) : (
                                    <span className="text-xs text-slate-400">
                                        —
                                    </span>
                                ),
                        },
                        {
                            header: "Status",
                            className: "text-center w-28",
                            headerClassName: "text-center w-28",
                            render: (kader: Kader) => (
                                <div className="flex justify-center">
                                    <Badge
                                        type={
                                            kader.status_aktif
                                                ? "success"
                                                : "default"
                                        }
                                    >
                                        {kader.status_aktif
                                            ? "Aktif"
                                            : "Nonaktif"}
                                    </Badge>
                                </div>
                            ),
                        },
                        {
                            header: "Akun",
                            className: "text-center w-32",
                            headerClassName: "text-center w-32",
                            render: (kader: Kader) => (
                                <div className="flex flex-col items-center gap-1">
                                    {kader.user_id ? (
                                        <Badge type="info">
                                            {kader.user?.username || "Ada akun"}
                                        </Badge>
                                    ) : (
                                        <span className="text-xs text-slate-400">
                                            Belum ada
                                        </span>
                                    )}
                                    {!kader.nik && (
                                        <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                                            NIK kosong
                                        </span>
                                    )}
                                </div>
                            ),
                        },
                        {
                            header: "Aksi",
                            headerClassName: "text-center w-28",
                            className: "text-center w-28",
                            render: (kader: Kader) => (
                                <div className="flex items-center justify-center gap-1">
                                    {isSuperAdmin && !kader.user_id && (
                                        <Link
                                            href={route(
                                                "be.users.create",
                                                { kader_id: kader.id }
                                            )}
                                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
                                            title="Buatkan Akun"
                                        >
                                            <UserPlus size={15} />
                                        </Link>
                                    )}
                                    {canEdit && (
                                        <Link
                                            href={route(
                                                "be.kader.edit",
                                                kader.id
                                            )}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={15} />
                                        </Link>
                                    )}
                                    {canDelete && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDeleteModal(kader)
                                            }
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                    data={rows}
                />

                {!isLoading && rows.length === 0 && (
                    <div className="py-14 text-center">
                        <Users
                            size={36}
                            className="mx-auto text-slate-300 mb-3"
                        />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {search
                                ? "Tidak ada kader yang cocok."
                                : "Belum ada data kader. Buat akun di User Management, baris kader terisi otomatis."}
                        </p>
                    </div>
                )}

                <div className="px-4 sm:px-5 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/40 dark:bg-slate-900/30">
                    <p className="text-sm text-slate-500 dark:text-slate-400 order-2 md:order-1">
                        Menampilkan{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {localKaders.from ?? 0}
                        </span>
                        –
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {localKaders.to ?? 0}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {localKaders.total ?? 0}
                        </span>
                    </p>

                    <div className="flex items-center gap-4 order-1 md:order-2">
                        <label className="flex items-center gap-2 text-sm text-slate-500">
                            <span>Tampil</span>
                            <select
                                value={perPage}
                                onChange={(e) =>
                                    setPerPage(parseInt(e.target.value, 10))
                                }
                                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm rounded-lg py-1.5 px-2.5 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </label>

                        <Pagination
                            links={localKaders.links || []}
                            onPageChange={(url: string) => {
                                if (url) fetchData(url);
                            }}
                        />
                    </div>
                </div>
            </Card>

            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Kader"
                message={
                    selectedKader
                        ? `Hapus data kader “${selectedKader.nama}”? Tindakan ini tidak dapat dibatalkan.`
                        : "Hapus data kader ini?"
                }
                onConfirm={handleDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedKader(null);
                }}
            />
        </MainLayout>
    );
}
