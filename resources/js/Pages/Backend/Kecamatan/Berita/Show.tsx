import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminKecamatanLayout from '../../../../Components/Layout/AdminKecamatanLayout';
import {
    ArrowLeft,
    Calendar,
    User as UserIcon,
    MapPin,
    Tag,
    CheckCircle2,
    Clock,
    XCircle,
    FileText,
} from 'lucide-react';

interface Berita {
    id: number;
    judul: string;
    slug: string;
    konten: string;
    kategori: string;
    kecamatan: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'draft';
    foto_url: string | null;
    tanggal_formatted: string;
    created_at: string;
    reject_reason?: string | null;
    user?: {
        name: string;
        username: string;
    };
}

interface Props {
    berita: Berita;
    kecamatan: string;
}

export default function Show({ berita, kecamatan }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={14} /> Disetujui
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={14} /> Menunggu
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle size={14} /> Ditolak
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-50 text-slate-600 border border-slate-200">
                        <FileText size={14} /> Draft
                    </span>
                );
        }
    };

    return (
        <AdminKecamatanLayout>
            <Head title={berita.judul} />

            {/* Back Button */}
            <Link
                href="/kecamatan/berita"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors mb-4"
            >
                <ArrowLeft size={16} /> Kembali ke Daftar Berita
            </Link>

            {/* Content */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {/* Image */}
                {berita.foto_url && (
                    <div className="w-full max-h-[400px] overflow-hidden bg-slate-100">
                        <img
                            src={berita.foto_url}
                            alt={berita.judul}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-6 lg:p-8">
                    {/* Status & Kategori */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {getStatusBadge(berita.status)}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-teal-50 text-teal-700 border border-teal-200">
                            <Tag size={12} /> {berita.kategori}
                        </span>
                        {berita.kecamatan && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-50 text-slate-600 border border-slate-200">
                                <MapPin size={12} /> {berita.kecamatan}
                            </span>
                        )}
                    </div>

                    {/* Judul */}
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                        {berita.judul}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} /> {berita.tanggal_formatted}
                        </span>
                        {berita.user?.name && (
                            <span className="flex items-center gap-1.5">
                                <UserIcon size={14} /> {berita.user.name}
                            </span>
                        )}
                    </div>

                    {/* Konten */}
                    <div
                        className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: berita.konten }}
                    />

                    {/* Alasan Penolakan */}
                    {berita.status === 'rejected' && berita.reject_reason && (
                        <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-lg">
                            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                                Alasan Penolakan
                            </p>
                            <p className="text-sm text-rose-600">{berita.reject_reason}</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminKecamatanLayout>
    );
}
