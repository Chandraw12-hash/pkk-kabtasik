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
interface BukuKegiatanRow {
    nama: string;
    jabatan?: string | null;
    tanggal?: string | null;
    tempat?: string | null;
    uraian?: string | null;
}

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
    data_angka?: {
        jenis_formulir?: string | null;
        buku_kegiatan?: BukuKegiatanRow[] | null;
        buku_kegiatan_count?: number | null;
        [key: string]: unknown;
    } | null;
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

// Tanggal YYYY-MM-DD dari baris Buku Kegiatan — parse manual agar tidak
// mundur sehari (new Date("2026-10-10") dibaca UTC tengah malam).
const formatTanggalBuku = (d?: string | null) => {
    if (!d) return "—";
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d.trim());
    try {
        const dt = m
            ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
            : new Date(d);
        return dt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch {
        return d;
    }
};

const isBukuKegiatan = (laporan: Laporan): boolean =>
    laporan.kategori_pokja === "I" &&
    laporan.data_angka?.jenis_formulir === "buku_kegiatan_lampiran_413" &&
    Array.isArray(laporan.data_angka?.buku_kegiatan);

// Sheet Buku Kegiatan Pokja I — Lampiran 4.13 (Kemendagri & PKK Pusat).
// Kolom: 1 NO | 2 NAMA | 3 JABATAN | 4 TANGGAL | 5 TEMPAT | 6 URAIAN | 7 TTD.
// Kolom tanda tangan sengaja dikosongkan (diisi basah saat cetak).
function BukuKegiatanTable({ laporan }: { laporan: Laporan }) {
    const rows = (laporan.data_angka?.buku_kegiatan ?? []).filter(
        (r) => r && (r.nama || r.uraian)
    );
    if (rows.length === 0) return null;

    const th =
        "border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 text-center";
    const td =
        "border border-slate-300 px-3 py-2 text-sm text-slate-700 align-top";

    return (
        <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-start justify-between gap-4 mb-1">
                <div className="flex-1 text-center">
                    <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-wide">
                        BUKU KEGIATAN
                    </h2>
                </div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                    LAMPIRAN 4.13
                </p>
            </div>

            <div className="overflow-x-auto -mx-1 px-1">
                <table className="w-full border-collapse min-w-[760px]">
                    <thead>
                        <tr>
                            <th className={th} rowSpan={2}>
                                NO
                            </th>
                            <th className={th} rowSpan={2}>
                                NAMA
                            </th>
                            <th className={th} rowSpan={2}>
                                JABATAN
                            </th>
                            <th className={th} colSpan={3}>
                                KEGIATAN
                            </th>
                            <th className={th} rowSpan={2}>
                                TANDA TANGAN
                            </th>
                        </tr>
                        <tr>
                            <th className={th}>TANGGAL</th>
                            <th className={th}>TEMPAT</th>
                            <th className={th}>URAIAN</th>
                        </tr>
                        <tr>
                            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                                <th
                                    key={n}
                                    className={`${th} font-semibold text-slate-400`}
                                >
                                    {n}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={i}>
                                <td className={`${td} text-center`}>{i + 1}</td>
                                <td className={`${td} font-medium`}>
                                    {r.nama || "—"}
                                </td>
                                <td className={td}>{r.jabatan || "—"}</td>
                                <td className={`${td} whitespace-nowrap`}>
                                    {formatTanggalBuku(r.tanggal)}
                                </td>
                                <td className={td}>{r.tempat || "—"}</td>
                                <td className={`${td} whitespace-pre-wrap`}>
                                    {r.uraian || "—"}
                                </td>
                                <td className={td}>&nbsp;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-center text-xs italic text-slate-400">
                Kementerian Dalam Negeri &amp; Tim Penggerak PKK Pusat
            </p>
        </Card>
    );
}

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
                            {isBukuKegiatan(laporan) && (
                                <Badge type="info">Buku Kegiatan • Lamp. 4.13</Badge>
                            )}
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

                    {isBukuKegiatan(laporan) && (
                        <BukuKegiatanTable laporan={laporan} />
                    )}

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
