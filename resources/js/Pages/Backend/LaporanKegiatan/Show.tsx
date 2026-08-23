import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function Show({ laporan }: { laporan: any }) {
    return (
        <MainLayout>
            <Head title={laporan.judul} />
            <Link
                href={route("be.laporan-kegiatan.index")}
                className="inline-flex items-center gap-2 text-sm text-slate-500 mb-4"
            >
                <ArrowLeft size={16} /> Kembali
            </Link>
            <h1 className="text-xl font-bold text-slate-800 mb-2">
                {laporan.judul}
            </h1>
            <p className="text-sm text-slate-500 mb-4">
                Pokja {laporan.kategori_pokja} · {laporan.status}
            </p>
            <p className="text-slate-600 whitespace-pre-wrap">
                {laporan.deskripsi || "—"}
            </p>
            {laporan.foto_url && (
                <img
                    src={laporan.foto_url}
                    alt=""
                    className="mt-6 rounded-xl max-w-lg border border-slate-200"
                />
            )}
        </MainLayout>
    );
}
