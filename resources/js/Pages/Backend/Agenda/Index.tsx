import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import Table from "@/Components/Data/Table";
import Pagination from "@/Components/Data/Pagination";
import Card from "@/Components/UI/Card";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Search,
    Edit2,
    Trash2,
    RotateCcw,
    Plus,
    CalendarDays,
    MapPin,
    Clock,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    Calendar,
    ClipboardList,
    CheckCircle2,
} from "lucide-react";
import axios from "axios";

interface AgendaType {
    id: number;
    judul: string;
    deskripsi: string | null;
    tanggal: string;
    waktu: string | null;
    lokasi: string | null;
    status: string;
    slug: string | null;
    gambar: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginatedAgenda {
    data: AgendaType[];
    current_page: number;
    per_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: any[];
}

interface StatistikType {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    cancelled: number;
    hari_ini: number;
}

interface Props {
    agendas: PaginatedAgenda;
    statistik?: StatistikType;
    filters?: {
        search?: string;
        per_page?: number | string;
        status?: string;
        bulan?: string;
        tahun?: string;
    };
}

const formatTanggal = (tanggal: string) => {
    try {
        return new Date(tanggal).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch {
        return tanggal;
    }
};

const formatTanggalShort = (tanggal: string) => {
    try {
        return new Date(tanggal).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    } catch {
        return tanggal;
    }
};

const formatWaktu = (waktu: string | null) => {
    if (!waktu) return null;
    return waktu.slice(0, 5);
};

const getStatusBadge = (status: string) => {
    const statusMap: Record<
        string,
        {
            label: string;
            color: string;
            dot: string;
        }
    > = {
        upcoming: {
            label: "Akan Datang",
            color: "bg-blue-50 text-blue-700 border-blue-100",
            dot: "bg-blue-500",
        },
        // ongoing: {
        //     label: "Berlangsung",
        //     color: "bg-emerald-50 text-emerald-700 border-emerald-100",
        //     dot: "bg-emerald-500",
        // },
        completed: {
            label: "Selesai",
            color: "bg-slate-100 text-slate-600 border-slate-200",
            dot: "bg-slate-400",
        },
        cancelled: {
            label: "Dibatalkan",
            color: "bg-rose-50 text-rose-700 border-rose-100",
            dot: "bg-rose-500",
        },
    };

    return (
        statusMap[status] || {
            label: status,
            color: "bg-slate-100 text-slate-600 border-slate-200",
            dot: "bg-slate-400",
        }
    );
};

const getStatusIcon = (status: string) => {
    const iconMap: Record<string, any> = {
        upcoming: ClockIcon,
        ongoing: Calendar,
        completed: CheckCircle,
        cancelled: XCircle,
    };

    return iconMap[status] || ClockIcon;
};

export default function Index({
    agendas,
    statistik,
    filters = {},
}: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const [perPage, setPerPage] = useState(
        Number(filters.per_page) || 10
    );
    const [statusFilter, setStatusFilter] = useState(
        filters.status || ""
    );
    const [bulanFilter, setBulanFilter] = useState(
        filters.bulan || ""
    );
    const [tahunFilter, setTahunFilter] = useState(
        filters.tahun || new Date().getFullYear().toString()
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedItem, setSelectedItem] =
        useState<AgendaType | null>(null);

    const [localAgendas, setLocalAgendas] =
        useState<PaginatedAgenda>({
            ...agendas,
            data: agendas?.data || [],
        });

    const [localStatistik, setLocalStatistik] =
        useState<StatistikType | undefined>(statistik);

    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    // ✅ STATE BARU: Notif auto-complete
    const [autoCompleteNotif, setAutoCompleteNotif] = useState<string | null>(null);

    const { delete: destroy, processing } = useForm({});

    const fetchData = (
        url: string,
        params: Record<string, unknown> = {}
    ) => {
        setIsLoading(true);

        axios
            .get(url, {
                params: {
                    ...params,
                    search,
                    per_page: perPage,
                    status: statusFilter,
                    bulan: bulanFilter,
                    tahun: tahunFilter,
                },
                headers: {
                    Accept: "application/json",
                },
            })
            .then((res) => {
                if (res.data?.data) {
                    setLocalAgendas(res.data);

                    if (res.data?.statistik) {
                        setLocalStatistik(res.data.statistik);
                    }
                }
            })
            .catch((err) =>
                console.error("Error fetching data:", err)
            )
            .finally(() => setIsLoading(false));
    };

    // ✅ FIX: Ganti route 'auto-complete' → 'auto-update-status'
    useEffect(() => {
        axios
            .post(route("be.agenda.auto-update-status"), {}, {
                headers: { Accept: "application/json" },
            })
            .then((res) => {
                if (res.data?.updated > 0) {
                    setAutoCompleteNotif(res.data.message);

                    // Refresh data biar status terbaru muncul
                    setTimeout(() => {
                        fetchData(route("be.agenda.index"));
                    }, 500);

                    // Hilangkan notif setelah 6 detik
                    setTimeout(() => {
                        setAutoCompleteNotif(null);
                    }, 6000);
                }
            })
            .catch((err) => {
                // Silent fail — jangan ganggu user kalau gagal
                console.warn("Auto-update gagal:", err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            fetchData(route("be.agenda.index"));
        }, 300);

        return () => clearTimeout(timeout);
    }, [
        search,
        perPage,
        statusFilter,
        bulanFilter,
        tahunFilter,
    ]);

    const openDeleteModal = (item: AgendaType) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        if (!selectedItem) return;

        destroy(
            route("be.agenda.destroy", selectedItem.id),
            {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                    fetchData(route("be.agenda.index"));
                },
            }
        );
    };

    const handleReset = () => {
        setSearch("");
        setPerPage(10);
        setStatusFilter("");
        setBulanFilter("");
        setTahunFilter(
            new Date().getFullYear().toString()
        );
    };

    const handleExport = () => {
        window.open(
            route("be.agenda.export", {
                search,
                status: statusFilter,
            }),
            "_blank"
        );
    };

    const bulanOptions = [
        { value: "", label: "Semua Bulan" },
        { value: "1", label: "Januari" },
        { value: "2", label: "Februari" },
        { value: "3", label: "Maret" },
        { value: "4", label: "April" },
        { value: "5", label: "Mei" },
        { value: "6", label: "Juni" },
        { value: "7", label: "Juli" },
        { value: "8", label: "Agustus" },
        { value: "9", label: "September" },
        { value: "10", label: "Oktober" },
        { value: "11", label: "November" },
        { value: "12", label: "Desember" },
    ];

    const tahunOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];

        for (
            let i = currentYear;
            i >= currentYear - 5;
            i--
        ) {
            years.push({
                value: i.toString(),
                label: i.toString(),
            });
        }

        return years;
    };

    const statItems = localStatistik
        ? [
              {
                  label: "Total Agenda",
                  value: localStatistik.total,
                  icon: ClipboardList,
                  iconClass:
                      "bg-slate-100 text-slate-600",
                  valueClass:
                      "text-slate-800 dark:text-slate-100",
              },
              {
                  label: "Akan Datang",
                  value: localStatistik.upcoming,
                  icon: ClockIcon,
                  iconClass:
                      "bg-blue-50 text-blue-600",
                  valueClass: "text-blue-700",
              },
            //   {
            //       label: "Berlangsung",
            //       value: localStatistik.ongoing,
            //       icon: Calendar,
            //       iconClass:
            //           "bg-emerald-50 text-emerald-600",
            //       valueClass: "text-emerald-700",
            //   },
              {
                  label: "Selesai",
                  value: localStatistik.completed,
                  icon: CheckCircle,
                  iconClass:
                      "bg-slate-100 text-slate-500",
                  valueClass:
                      "text-slate-600 dark:text-slate-300",
              },
              {
                  label: "Dibatalkan",
                  value: localStatistik.cancelled,
                  icon: XCircle,
                  iconClass:
                      "bg-rose-50 text-rose-600",
                  valueClass: "text-rose-700",
              },
              {
                  label: "Hari Ini",
                  value: localStatistik.hari_ini,
                  icon: CalendarDays,
                  iconClass:
                      "bg-teal-50 text-teal-600",
                  valueClass: "text-teal-700",
              },
          ]
        : [];

    return (
        <MainLayout>
            <Head title="Kelola Agenda" />

            <div className="space-y-6 pb-8">
                {/* ✅ NOTIF AUTO-COMPLETE */}
                {autoCompleteNotif && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <CheckCircle2
                                size={18}
                                className="text-emerald-600"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-emerald-800">
                                Agenda Selesai Otomatis
                            </p>
                            <p className="text-xs text-emerald-700 mt-0.5">
                                {autoCompleteNotif}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAutoCompleteNotif(null)}
                            className="shrink-0 text-emerald-600 hover:text-emerald-800 transition-colors"
                            aria-label="Tutup notifikasi"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* =====================================================
                    PAGE HEADER
                ====================================================== */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
                    <div className="flex items-start gap-3">
                        <div className="hidden sm:flex w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 items-center justify-center shrink-0">
                            <CalendarDays
                                size={21}
                                className="text-teal-700"
                            />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">
                                    Manajemen Konten
                                </span>
                            </div>

                            <h1 className="text-2xl lg:text-[28px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Kelola Agenda
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Kelola jadwal kegiatan PKK yang
                                ditampilkan pada website.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Button
                            variant="secondary"
                            onClick={handleExport}
                            className="h-10 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shadow-none flex items-center gap-2"
                        >
                            <Download size={15} />
                            <span>Export</span>
                        </Button>

                        <Button
                            variant="primary"
                            href={route("be.agenda.create")}
                            className="h-10 px-4 rounded-lg bg-teal-700 hover:bg-teal-800 shadow-sm flex items-center gap-2"
                        >
                            <Plus size={16} />
                            <span>Tambah Agenda</span>
                        </Button>
                    </div>
                </div>

                {/* =====================================================
                    STATISTIK
                ====================================================== */}
                {localStatistik && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
                        {statItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Card
                                    key={item.label}
                                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-none dark:bg-slate-800 dark:border-slate-700"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-tight min-h-[26px] flex items-start">
    {item.label === "Total Agenda" ? "Total (Semua)" : item.label}
</p>

                                            <p
                                                className={`mt-1 text-2xl font-bold ${item.valueClass}`}
                                            >
                                                {item.value}
                                            </p>
                                        </div>

                                        <div
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.iconClass}`}
                                        >
                                            <Icon size={17} />
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* =====================================================
                    MAIN CONTENT
                ====================================================== */}
                <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:bg-slate-800 dark:border-slate-700">
                    {/* Filter Header */}
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                    <Filter
                                        size={15}
                                        className="text-slate-500 dark:text-slate-300"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        Filter Agenda
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Gunakan filter untuk menemukan data.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                                <div className="relative w-full sm:w-[250px]">
                                    <TextInput
                                        iconLeft={
                                            <Search size={17} />
                                        }
                                        placeholder="Cari judul atau lokasi..."
                                        className="w-full h-10 rounded-lg dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                        containerClassName="relative w-full"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                    }
                                    className="h-10 min-w-[145px] text-sm rounded-lg border border-slate-200 bg-white text-slate-600 px-3 outline-none transition-all focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                >
                                    <option value="">
                                        Semua Status
                                    </option>
                                    <option value="upcoming">
                                        Akan Datang
                                    </option>
                                    {/* <option value="ongoing">
                                        Berlangsung
                                    </option> */}
                                    <option value="completed">
                                        Selesai
                                    </option>
                                    <option value="cancelled">
                                        Dibatalkan
                                    </option>
                                </select>

                                <select
                                    value={bulanFilter}
                                    onChange={(e) =>
                                        setBulanFilter(
                                            e.target.value
                                        )
                                    }
                                    className="h-10 min-w-[135px] text-sm rounded-lg border border-slate-200 bg-white text-slate-600 px-3 outline-none transition-all focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                >
                                    {bulanOptions.map(
                                        (option) => (
                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {option.label}
                                            </option>
                                        )
                                    )}
                                </select>

                                <select
                                    value={tahunFilter}
                                    onChange={(e) =>
                                        setTahunFilter(
                                            e.target.value
                                        )
                                    }
                                    className="h-10 min-w-[105px] text-sm rounded-lg border border-slate-200 bg-white text-slate-600 px-3 outline-none transition-all focus:border-teal-500 focus:ring-3 focus:ring-teal-500/10 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
                                >
                                    {tahunOptions().map(
                                        (option) => (
                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >
                                                {option.label}
                                            </option>
                                        )
                                    )}
                                </select>

                                {(search ||
                                    statusFilter ||
                                    bulanFilter ||
                                    tahunFilter !==
                                        new Date()
                                            .getFullYear()
                                            .toString() ||
                                    perPage !== 10) && (
                                    <Button
                                        variant="secondary"
                                        onClick={handleReset}
                                        className="h-10 px-3.5 rounded-lg flex items-center gap-2 border border-slate-200 shadow-none"
                                    >
                                        <RotateCcw size={15} />
                                        <span className="hidden sm:inline">
                                            Reset
                                        </span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <Table
                            isLoading={isLoading}
                            emptyMessage="Belum ada agenda. Tambahkan agenda kegiatan pertama."
                            columns={[
                                {
                                    header: "#",
                                    className:
                                        "text-center text-xs font-semibold text-slate-400 dark:text-slate-300 w-14",
                                    headerClassName:
                                        "text-center w-14",
                                    render: (
                                        _: AgendaType,
                                        index: number
                                    ) => {
                                        const currentPage =
                                            localAgendas.current_page ??
                                            1;
                                        const perPageVal =
                                            localAgendas.per_page ??
                                            10;

                                        return (
                                            <span className="text-xs text-slate-400">
                                                {(currentPage -
                                                    1) *
                                                    perPageVal +
                                                    index +
                                                    1}
                                            </span>
                                        );
                                    },
                                },
                                {
                                    header: "Tanggal & Waktu",
                                    className: "w-52",
                                    headerClassName: "w-52",
                                    render: (
                                        item: AgendaType
                                    ) => (
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                                                <CalendarDays
                                                    size={16}
                                                    className="text-teal-700"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                                    {formatTanggal(
                                                        item.tanggal
                                                    )}
                                                </p>

                                                {formatWaktu(
                                                    item.waktu
                                                ) && (
                                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                                                        <Clock
                                                            size={
                                                                11
                                                            }
                                                        />
                                                        <span>
                                                            {formatWaktu(
                                                                item.waktu
                                                            )}{" "}
                                                            WIB
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    header: "Agenda & Lokasi",
                                    className: "w-auto min-w-[280px]",
                                    headerClassName:
                                        "w-auto min-w-[280px]",
                                    render: (
                                        item: AgendaType
                                    ) => (
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                                                {item.judul}
                                            </p>

                                            {item.lokasi && (
                                                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                                                    <MapPin
                                                        size={
                                                            11
                                                        }
                                                        className="shrink-0"
                                                    />
                                                    <span className="truncate max-w-[420px]">
                                                        {
                                                            item.lokasi
                                                        }
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    header: "Status",
                                    className: "w-36",
                                    headerClassName:
                                        "w-36",
                                    render: (
                                        item: AgendaType
                                    ) => {
                                        const status =
                                            getStatusBadge(
                                                item.status
                                            );
                                        const Icon =
                                            getStatusIcon(
                                                item.status
                                            );

                                        return (
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold ${status.color}`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                                                />
                                                <Icon
                                                    size={12}
                                                />
                                                {
                                                    status.label
                                                }
                                            </span>
                                        );
                                    },
                                },
                                {
                                    header: "Aksi",
                                    headerClassName:
                                        "text-center w-32",
                                    className:
                                        "text-center w-32",
                                    render: (
                                        item: AgendaType
                                    ) => (
                                        <div className="flex items-center justify-center gap-1">
                                            <Link
                                                href={route(
                                                    "be.agenda.show",
                                                    item.id
                                                )}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                                                title="Detail"
                                            >
                                                <Eye
                                                    size={15}
                                                />
                                            </Link>

                                            <Link
                                                href={route(
                                                    "be.agenda.edit",
                                                    item.id
                                                )}
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/30 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2
                                                    size={15}
                                                />
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    openDeleteModal(
                                                        item
                                                    )
                                                }
                                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2
                                                    size={15}
                                                />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            data={localAgendas.data}
                        />
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/20">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <p className="text-xs text-slate-500 dark:text-slate-300">
                                Menampilkan{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-100">
                                    {localAgendas.from ??
                                        0}
                                </span>{" "}
                                sampai{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-100">
                                    {localAgendas.to ?? 0}
                                </span>{" "}
                                dari{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-100">
                                    {localAgendas.total ??
                                        0}
                                </span>{" "}
                                data
                            </p>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span>
                                        Tampilkan
                                    </span>

                                    <select
                                        value={perPage}
                                        onChange={(e) =>
                                            setPerPage(
                                                parseInt(
                                                    e.target
                                                        .value
                                                )
                                            )
                                        }
                                        className="h-8 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg focus:ring-3 focus:ring-teal-500/10 focus:border-teal-500 py-1 px-2.5 outline-none cursor-pointer dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                    >
                                        <option value="5">
                                            5
                                        </option>
                                        <option value="10">
                                            10
                                        </option>
                                        <option value="20">
                                            20
                                        </option>
                                        <option value="50">
                                            50
                                        </option>
                                    </select>
                                </div>

                                <Pagination
                                    links={localAgendas.links}
                                    onPageChange={(
                                        url: string
                                    ) =>
                                        fetchData(url)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* =====================================================
                DELETE MODAL
            ====================================================== */}
            <ConfirmationModal
                show={showDeleteModal}
                processing={processing}
                title="Hapus Agenda"
                message={
                    selectedItem
                        ? `Apakah Anda yakin ingin menghapus agenda "${selectedItem.judul}"? Data yang dihapus tidak dapat dikembalikan.`
                        : "Apakah Anda yakin ingin menghapus agenda ini?"
                }
                onConfirm={handleDelete}
                onCancel={() =>
                    setShowDeleteModal(false)
                }
            />
        </MainLayout>
    );
}
