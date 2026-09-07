import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import Badge from "@/Components/UI/Badge";
import Card from "@/Components/UI/Card";
import ConfirmationModal from "@/Components/UI/ConfirmationModal";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    ThumbsUp,
    ThumbsDown,
    Trash2,
    MapPin,
    Calendar,
    User,
    ShieldCheck,
    Image as ImageIcon,
} from "lucide-react";

// Interface disamakan persis dengan Laporan di Index.tsx, supaya
// tidak ada field yang "hilang" antara list dan detail.
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

interface Props {
    laporan: Laporan;
}

const formatTanggal = (d?: string | null) => {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch {
        return "—";
    }
};

const formatTanggalWaktu = (d?: string | null) => {
    if (!d) return "—";
    try {
        return new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "—";
    }
};

// Sama persis dengan helper di Index.tsx, supaya label & warna
// badge status konsisten di kedua halaman.
const getStatusBadge = (status: string) => {
    const statusMap: Record<
        string,
        { label: string; type: "default" | "success" | "warning" | "danger" | "info" }
    > = {
        pending: { label: "Menunggu", type: "warning" },
        reviewed: { label: "Sudah Direview", type: "info" },
        approved: { label: "Disetujui ✅", type: "success" },
        rejected: { label: "Ditolak ❌", type: "danger" },
    };
    return statusMap[status] || { label: status, type: "default" };
};

// Baris info kecil dipakai berulang (wilayah, pengirim, tanggal, dll)
function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5 break-words">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function Show({ laporan }: Props) {
    const [showApprove, setShowApprove] = useState(false);
    const [showReject, setShowReject] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const { delete: destroy, processing } = useForm({});

    const statusInfo = getStatusBadge(laporan.status);
    const wilayah = [laporan.desa_kelurahan, laporan.kecamatan]
        .filter(Boolean)
        .join(", ");

    const confirmApprove = () => {
        router.patch(
            route("be.laporan-kegiatan.approve", laporan.id),
            {},
            { preserveScroll: true, onSuccess: () => setShowApprove(false) }
        );
    };

    const confirmReject = () => {
        router.patch(
            route("be.laporan-kegiatan.reject", laporan.id),
            {},
            { preserveScroll: true, onSuccess: () => setShowReject(false) }
        );
    };

    const confirmDelete = () => {
        destroy(route("be.laporan-kegiatan.destroy", laporan.id), {
            onSuccess: () => setShowDelete(false),
        });
    };

    return (
        <MainLayout>
            <Head title={laporan.judul} />

            <Link
                href={route("be.laporan-kegiatan.index")}
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-teal-700 transition-colors mb-5"
            >
                <ArrowLeft size={16} /> Kembali ke daftar laporan
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ===== KOLOM UTAMA ===== */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge type="info">Pokja {laporan.kategori_pokja}</Badge>
                            <Badge type={statusInfo.type}>{statusInfo.label}</Badge>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                            {laporan.judul}
                        </h1>

                        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                                Deskripsi Kegiatan
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {laporan.deskripsi || "Tidak ada deskripsi tambahan."}
                            </p>
                        </div>
                    </Card>

                    <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                            Dokumentasi Foto
                        </p>
                        {laporan.foto_url ? (
                            <img
                                src={laporan.foto_url}
                                alt={laporan.judul}
                                className="rounded-xl w-full max-w-lg border border-slate-200 dark:border-slate-700"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-600">
                                <ImageIcon size={28} className="text-slate-300 mb-2" />
                                <p className="text-xs text-slate-400">
                                    Kader tidak melampirkan foto pada laporan ini.
                                </p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* ===== SIDEBAR INFO ===== */}
                <div className="space-y-6">
                    <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-5">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            Informasi Laporan
                        </p>

                        <InfoRow
                            icon={<User size={16} />}
                            label="Dikirim oleh"
                            value={
                                laporan.nama_dasawisma ||
                                laporan.user?.name ||
                                "Tidak diketahui"
                            }
                        />

                        <InfoRow
                            icon={<MapPin size={16} />}
                            label="Wilayah"
                            value={wilayah || "—"}
                        />

                        <InfoRow
                            icon={<Calendar size={16} />}
                            label="Tanggal Dikirim"
                            value={formatTanggal(laporan.created_at)}
                        />

                        {laporan.reviewer && (
                            <InfoRow
                                icon={<ShieldCheck size={16} />}
                                label="Direview oleh"
                                value={
                                    <>
                                        {laporan.reviewer.name}
                                        <span className="block text-xs text-slate-400 font-normal mt-0.5">
                                            {formatTanggalWaktu(laporan.reviewed_at)}
                                        </span>
                                    </>
                                }
                            />
                        )}
                    </Card>

                    {/* ===== AKSI ===== */}
                    <Card className="p-6 dark:bg-slate-800 dark:border-slate-700 space-y-3">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                            Tindakan
                        </p>

                        {laporan.status === "pending" && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setShowApprove(true)}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-sm font-semibold transition-colors"
                                >
                                    <ThumbsUp size={16} />
                                    Setujui Laporan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReject(true)}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-sm font-semibold transition-colors"
                                >
                                    <ThumbsDown size={16} />
                                    Tolak Laporan
                                </button>
                            </>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowDelete(true)}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-sm font-medium transition-colors"
                        >
                            <Trash2 size={16} />
                            Hapus Laporan
                        </button>
                    </Card>
                </div>
            </div>

            <ConfirmationModal
                show={showApprove}
                processing={false}
                title="Setujui Laporan"
                message={`Anda yakin ingin menyetujui laporan "${laporan.judul}"? Data akan masuk ke statistik Pokja ${laporan.kategori_pokja}.`}
                onConfirm={confirmApprove}
                onCancel={() => setShowApprove(false)}
                confirmText="Setujui"
                cancelText="Batal"
                confirmVariant="success"
            />

            <ConfirmationModal
                show={showReject}
                processing={false}
                title="Tolak Laporan"
                message={`Anda yakin ingin menolak laporan "${laporan.judul}"?`}
                onConfirm={confirmReject}
                onCancel={() => setShowReject(false)}
                confirmText="Tolak"
                cancelText="Batal"
                confirmVariant="danger"
            />

            <ConfirmationModal
                show={showDelete}
                processing={processing}
                title="Hapus Laporan"
                message={`Hapus laporan "${laporan.judul}"? Data yang dihapus tidak dapat dikembalikan.`}
                onConfirm={confirmDelete}
                onCancel={() => setShowDelete(false)}
            />
        </MainLayout>
    );
}
